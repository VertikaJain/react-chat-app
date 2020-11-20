import React, { Component } from 'react'
import ContactList from './contactList'
import MessageBox from './messageBox'
import API from '../../services/api'

export default class ChatWindow extends Component {
    constructor(props) {
        super(props)
        this.state = {
            loggedInUserId: "",
            users: [],
            messageToUser: ""
        }
        this.getSelectedUser = this.getSelectedUser.bind(this)
    }

    async componentDidMount() {
        this.setState({ loggedInUserId: this.props.id })
        try {
            let contactsResult = await API.getContacts(this.props.id)
            this.setState({ users: contactsResult.data.data })
        } catch (error) {
            console.log("error:", error);
        }
    }

    getSelectedUser(selectedUser) {
        this.setState({ messageToUser: selectedUser })
    }

    render() {
        return (
            <div className="box-content mx-auto h-3/4 w-3/4 m-12 px-16 border rounded bg-blue-400">
                <div className="container flex mx-auto m-16 rounded h-screen bg-white">
                    {(this.state.users.length > 0) && <ContactList users={this.state.users} selectedUser={this.getSelectedUser} />}
                    {this.state.messageToUser && <MessageBox selectedUser={this.state.messageToUser} loggedInUserId={this.state.loggedInUserId} />}
                </div>
            </div>
        )
    }
}
