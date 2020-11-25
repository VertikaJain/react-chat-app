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
            messageData: []
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
        let ws = new WebSocket(`ws://localhost:3000/chat/${this.props.loggedInUserObj._id}`)
        console.log("ws: ", ws);
        ws.onopen = () => {
            console.log("Connected websocket main component.");
            this.setState({ ws: ws });
        }
        ws.onmessage = (e) => {
            let msgData = JSON.parse(e.data)
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

    getNewMsgObj(newMsgObj) {
        let msgToSend = { senderid: this.props.loggedInUserObj._id, receiverid: this.state.messageToUser._id, ...newMsgObj }
        this.state.ws.send(JSON.stringify(msgToSend))
    }

    render() {
        return (
            <div className="box-content mx-auto h-3/4 w-3/4 m-12 px-16 border rounded bg-blue-400">
                <div className="container flex mx-auto m-16 rounded h-screen bg-white">
                    {(this.state.users.length > 0) && <ContactList users={this.state.users} selectedUser={this.getSelectedUser} />}
                    {this.state.messageToUser && <MessageBox
                        selectedUser={this.state.messageToUser}
                        loggedInUserDP={this.props.loggedInUserObj.img}
                        messageData={this.state.messageData.filter(msg => (msg.from === this.state.messageToUser._id ||
                            (msg.from === this.props.loggedInUserObj._id && msg.to === this.state.messageToUser._id)))}
                        setNewMsgObj={this.getNewMsgObj}
                    />}
                </div>
            </div>
        )
    }
}
