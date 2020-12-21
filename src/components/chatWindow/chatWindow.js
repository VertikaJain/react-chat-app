import React, { Component } from 'react'
import ContactList from './contactList'
import MessageBox from './messageBox'
import API from '../../services/api'


export default class ChatWindow extends Component {
    constructor(props) {
        super(props)
        this.state = {
            users: [],
            messageToUser: "",
            ws: null,
            chats: {},
            lastSentMessage: undefined
        }
        this.getSelectedUser = this.getSelectedUser.bind(this)
        this.getNewMsgObj = this.getNewMsgObj.bind(this)
    }

    async componentDidMount() {

        // API call to fetch all contacts
        try {
            let contactsResult = await API.getContacts(this.props.loggedInUserObj._id, this.props.loggedInUserObj.role)
            this.setState({ users: contactsResult.data.data })
        } catch (error) {
            console.log("error:", error);
        }

        // Fetch Existing Chats from LocalStorage
        let lsChats = JSON.parse(localStorage.getItem(this.props.loggedInUserObj._id + "_messages"))
        this.setState({ chats: { ...lsChats } })

        // Web Socket Connection
        let ws = new WebSocket(`ws://localhost:4000/chat/${this.props.loggedInUserObj._id}`)
        console.log("New Web Socket Connection: ", ws);

        ws.onopen = () => {
            console.log("Connected Websocket main component.");
            this.setState({ ws: ws });
        }

        ws.onmessage = async (e) => {
            let newMessage = JSON.parse(e.data)
            // In case message is from self, save state-stored message to Chats i.e. no need of using/decrypting the received message
            // This is only for verifying that the messages have successfully been received.
            if (newMessage.senderid === this.props.loggedInUserObj._id) {
                newMessage.message = this.state.lastSentMessage
            } else { // Otherwise decrypt it and then save to Chats
                // Decryption using Signal Protocol
                let decrytedMessage = await this.props.signalProtocolManagerUser.decryptMessageAsync(newMessage.senderid, newMessage.message)
                newMessage.message = decrytedMessage
            }

            // Update message data to Chats & LocalStorage -> 2 Scenarios
            // 1. If the Chat already exists
            if (newMessage.chatId in this.state.chats) {
                this.setState(prevState => ({
                    chats: {
                        ...prevState.chats, [newMessage.chatId]: {
                            ...prevState.chats[newMessage.chatId],
                            messages: [...prevState.chats[newMessage.chatId].messages.concat(newMessage)]
                        }
                    }
                }), () => localStorage.setItem(this.props.loggedInUserObj._id + "_messages", JSON.stringify(this.state.chats)))
            }
            // 2. In case the Chat does not exist, Create New Chat
            else {
                let newChat = {
                    chatId: newMessage.chatId,
                    members: [newMessage.senderid, newMessage.receiverid],
                    messages: []
                }
                newChat.messages.push(newMessage)
                this.setState(prevState => ({
                    chats: { ...prevState.chats, [newMessage.chatId]: newChat }
                }), () => localStorage.setItem(this.props.loggedInUserObj._id + "_messages", JSON.stringify(this.state.chats)))
            }
        }

        ws.onclose = () => {
            console.log("Disconnected Websocket main component.");
            // redirect to login
        }
    }

    // Method To Update the Selected User from Contact List Component to the Message Box Component
    getSelectedUser(selectedUser) {
        this.setState({ messageToUser: selectedUser })
    }

    // Method to Send New Message using Web Socket when User hits send button from Message Box component
    async getNewMsgObj(newMsgObj) {
        let selectedUserChatId = this.getSelectedUserChatId()
        let msgToSend = { chatId: selectedUserChatId, senderid: this.props.loggedInUserObj._id, receiverid: this.state.messageToUser._id, ...newMsgObj }
        // Send Message for Encryption to Signal Server, then send the Encrypted Message to Push server
        try {
            let encryptedMessage = await this.props.signalProtocolManagerUser.encryptMessageAsync(this.state.messageToUser._id, newMsgObj.message);
            msgToSend.message = encryptedMessage
            this.state.ws.send(JSON.stringify(msgToSend))
            this.setState({ lastSentMessage: newMsgObj.message }) // Storing last-sent message for Verification with Received Message
        } catch (error) {
            console.log(error);
        }
    }

    // Method to return the chatID of the Currently Selected User
    getSelectedUserChatId() {
        // Because of the state selectedUserChatId problem, we are selecting the chatId everytime a new message is being sent
        let selectedUserChatId = undefined
        for (let chat of Object.values(this.state.chats)) {
            if (chat.members.includes(this.state.messageToUser._id)) {
                selectedUserChatId = chat.chatId
                break
            }
        }
        return selectedUserChatId
    }

    render() {
        return (
            <div className="container flex mx-auto m-2 rounded h-screen bg-white border border-blue-800 bg-gray-100">
                {(this.state.users.length > 0) && <ContactList
                    users={this.state.users}
                    selectedUser={this.getSelectedUser}
                    chats={this.state.chats}
                />}
                {this.state.messageToUser && <MessageBox
                    selectedUser={this.state.messageToUser}
                    loggedInUserDP={this.props.loggedInUserObj.img}
                    setNewMsgObj={this.getNewMsgObj}
                    messages={(this.state.chats[this.getSelectedUserChatId()]) && this.state.chats[this.getSelectedUserChatId()].messages}
                />}
            </div>
        )
    }
}
