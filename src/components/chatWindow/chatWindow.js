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
            messageData: [],
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

        // Web Socket to Fetch all message-data
        let ws = new WebSocket(`ws://localhost:4000/chat/${this.props.loggedInUserObj._id}`)
        console.log("ws: ", ws);
        ws.onopen = () => {
            console.log("Connected websocket main component.");
            this.setState({ ws: ws });
        }
        ws.onmessage = async (e) => {
            let msgData = JSON.parse(e.data)
            // Decryption
            if (Array.isArray(msgData)) {
                for (let data of msgData) {
                    let decrytedMessage = await this.props.signalProtocolManagerUser.decryptMessageAsync(data.from, data.msg)
                    data.msg = decrytedMessage
                }
            }
            else {
                let decrytedMessage = await this.props.signalProtocolManagerUser.decryptMessageAsync(msgData.from, msgData.msg)
                msgData.msg = decrytedMessage
            }
            this.setState(prevState => ({
                messageData: prevState.messageData.concat(msgData)
            }))

        }
        ws.onclose = () => {
            console.log("Disconnected websocket main component.");
            // redirect to login
        }
    }

    getSelectedUser(selectedUser) {
        this.setState({ messageToUser: selectedUser })
    }

    async getNewMsgObj(newMsgObj) {
        let msgToSend = { senderid: this.props.loggedInUserObj._id, receiverid: this.state.messageToUser._id, ...newMsgObj }
        // send data for encryption, then send to push server
        try {
            let encryptedMessage = await this.props.signalProtocolManagerUser.encryptMessageAsync(this.state.messageToUser._id, newMsgObj.message);
            msgToSend.message = encryptedMessage
            this.state.ws.send(JSON.stringify(msgToSend))
            this.setState({ lastSentMessage: newMsgObj.message })
        } catch (error) {
            console.log(error);
        }
    }

    render() {
        return (
            <div className="container flex mx-auto m-2 rounded h-screen bg-white border border-blue-800 bg-gray-100">
                {(this.state.users.length > 0) && <ContactList
                    users={this.state.users}
                    selectedUser={this.getSelectedUser}
                    messageData={this.state.messageData}
                />}
                {this.state.messageToUser && <MessageBox
                    selectedUser={this.state.messageToUser}
                    loggedInUserDP={this.props.loggedInUserObj.img}
                    messageData={this.state.messageData.filter(msg => (msg.from === this.state.messageToUser._id ||
                        (msg.from === this.props.loggedInUserObj._id && msg.to === this.state.messageToUser._id)))}
                    setNewMsgObj={this.getNewMsgObj}
                />}
            </div>
        )
    }
}
