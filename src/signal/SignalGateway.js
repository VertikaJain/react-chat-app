
import util from './helpers'
import SignalProtocolStore from "./InMemorySignalProtocolStore";

const libsignal = window.libsignal
/**
 * Dummy signal server connector.
 * 
 * In a real application this component would connect to your signal 
 * server for storing and fetching user public keys over HTTP.
 */
export class SignalServerStore {
    /* constructor() {
        this.store = {};
    } */
    /**
     * When a user logs on they should generate their keys and then register them with the server.
     * 
     * @param userId The user ID.
     * @param preKeyBundle The user's generated pre-key bundle.
     */
    registerNewPreKeyBundle(userId, preKeyBundle) {
        let storageBundle = { ...preKeyBundle }
        storageBundle.identityKey = util.arrayBufferToBase64(storageBundle.identityKey)
        storageBundle.preKey.publicKey = util.arrayBufferToBase64(storageBundle.preKey.publicKey)
        storageBundle.signedPreKey.publicKey = util.arrayBufferToBase64(storageBundle.signedPreKey.publicKey)
        storageBundle.signedPreKey.signature = util.arrayBufferToBase64(storageBundle.signedPreKey.signature)
        localStorage.setItem(userId, JSON.stringify(storageBundle))
        // this.store[userId] = preKeyBundle;
    }

    /**
     * Gets the pre-key bundle for the given user ID.
     * If you want to start a conversation with a user, you need to fetch their pre-key bundle first.
     * 
     * @param userId The ID of the user.
     */
    getPreKeyBundle(userId) {
        let storageBundle = JSON.parse(localStorage.getItem(userId))
        storageBundle.identityKey = util.base64ToArrayBuffer(storageBundle.identityKey)
        storageBundle.preKey.publicKey = util.base64ToArrayBuffer(storageBundle.preKey.publicKey)
        storageBundle.signedPreKey.publicKey = util.base64ToArrayBuffer(storageBundle.signedPreKey.publicKey)
        storageBundle.signedPreKey.signature = util.base64ToArrayBuffer(storageBundle.signedPreKey.signature)
        return storageBundle
        // return this.store[userId];
    }
}

/**
 * A signal protocol manager.
 */
class SignalProtocolManager {
    constructor(userId, signalServerStore) {
        this.userId = userId;
        this.store = new SignalProtocolStore();
        this.signalServerStore = signalServerStore;
    }

    /**
     * Initialize the manager when the user logs on.
     */
    async initializeAsync() {
        await this._generateIdentityAsync();

        var preKeyBundle = await this._generatePreKeyBundleAsync();

        this.signalServerStore.registerNewPreKeyBundle(this.userId, preKeyBundle);
    }

    /**
     * Encrypt a message for a given user.
     * 
     * @param remoteUserId The recipient user ID.
     * @param message The message to send.
     */
    async encryptMessageAsync(remoteUserId, message) {
        var sessionCipher = this.store.loadSessionCipher(remoteUserId);

        if (sessionCipher == null) {
            var address = new libsignal.SignalProtocolAddress(remoteUserId, 123);
            // Instantiate a SessionBuilder for a remote recipientId + deviceId tuple.
            var sessionBuilder = new libsignal.SessionBuilder(this.store, address);

            var remoteUserPreKey = this.signalServerStore.getPreKeyBundle(remoteUserId);
            // Process a prekey fetched from the server. Returns a promise that resolves
            // once a session is created and saved in the store, or rejects if the
            // identityKey differs from a previously seen identity for this address.
            await sessionBuilder.processPreKey(remoteUserPreKey);

            var sessionCipher = new libsignal.SessionCipher(this.store, address);
            this.store.storeSessionCipher(remoteUserId, sessionCipher);
        }

        let cipherText = await sessionCipher.encrypt(util.toArrayBuffer(message));
        return cipherText
    }

    /**
     * Decrypts a message from a given user.
     * 
     * @param remoteUserId The user ID of the message sender.
     * @param cipherText The encrypted message bundle. (This includes the encrypted message itself and accompanying metadata)
     * @returns The decrypted message string.
     */
    async decryptMessageAsync(remoteUserId, cipherText) {
        var sessionCipher = this.store.loadSessionCipher(remoteUserId);

        if (sessionCipher == null) {
            var address = new libsignal.SignalProtocolAddress(remoteUserId, 123);
            var sessionCipher = new libsignal.SessionCipher(this.store, address);
            this.store.storeSessionCipher(remoteUserId, sessionCipher);
        }

        var messageHasEmbeddedPreKeyBundle = cipherText.type == 3;
        // Decrypt a PreKeyWhisperMessage by first establishing a new session.
        // Returns a promise that resolves when the message is decrypted or
        // rejects if the identityKey differs from a previously seen identity for this address.
        if (messageHasEmbeddedPreKeyBundle) {
            var decryptedMessage = await sessionCipher.decryptPreKeyWhisperMessage(cipherText.body, 'binary');
            return util.toString(decryptedMessage);
        } else {
            // Decrypt a normal message using an existing session
            var decryptedMessage = await sessionCipher.decryptWhisperMessage(cipherText.body, 'binary');
            return util.toString(decryptedMessage);
        }
    }

    /**
     * Generates a new identity for the local user.
     */
    async _generateIdentityAsync() {
        var results = await Promise.all([
            libsignal.KeyHelper.generateIdentityKeyPair(),
            libsignal.KeyHelper.generateRegistrationId(),
        ]);

        this.store.put('identityKey', results[0]);
        this.store.put('registrationId', results[1]);
    }

    /**
     * Generates a new pre-key bundle for the local user.
     * 
     * @returns A pre-key bundle.
     */
    async _generatePreKeyBundleAsync() {
        var result = await Promise.all([
            this.store.getIdentityKeyPair(),
            this.store.getLocalRegistrationId()
        ]);

        let identity = result[0];
        let registrationId = result[1];

        var keys = await Promise.all([
            libsignal.KeyHelper.generatePreKey(registrationId + 1),
            libsignal.KeyHelper.generateSignedPreKey(identity, registrationId + 1)
        ]);

        let preKey = keys[0]
        let signedPreKey = keys[1];

        this.store.storePreKey(preKey.keyId, preKey.keyPair);
        this.store.storeSignedPreKey(signedPreKey.keyId, signedPreKey.keyPair);

        return {
            identityKey: identity.pubKey,
            registrationId: registrationId,
            preKey: {
                keyId: preKey.keyId,
                publicKey: preKey.keyPair.pubKey
            },
            signedPreKey: {
                keyId: signedPreKey.keyId,
                publicKey: signedPreKey.keyPair.pubKey,
                signature: signedPreKey.signature
            }
        };
    }
}

export async function createSignalProtocolManager(userid, name, dummySignalServer) {
    let signalProtocolManagerUser = new SignalProtocolManager(userid, dummySignalServer);
    await Promise.all([
        signalProtocolManagerUser.initializeAsync(),
    ]);
    return signalProtocolManagerUser
}




