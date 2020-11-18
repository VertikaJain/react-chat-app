import React, { Component } from 'react'
import axios from 'axios'
import ContactList from './contactList'
import MessageBox from './messageBox'

export default class ChatWindow extends Component {
    constructor(props) {
        super(props)
        this.state = {
            users: [],
            messageToUserID: ""
        }
        this.getToMessageUserId = this.getToMessageUserId.bind(this)
    }

    componentDidMount() {
        axios.get(`http://localhost:3000/api/users/${this.props.id}`)
            .then(response => {
                console.log("response:", response)
                this.setState({ users: response.data.data })
            })
    }

    getToMessageUserId(userid) {
        this.setState({ messageToUserID: userid })
    }

    render() {
        return (
            <div className="container flex mx-auto m-16  border rounded h-screen">
                {(this.state.users.length > 0) && <ContactList users={this.state.users} msgUser={this.getToMessageUserId} />}
                {this.state.messageToUserID && <MessageBox userid={this.state.messageToUserID} />}
            </div>
        )
    }
}
