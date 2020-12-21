import React, { Component } from 'react'

export default class ContactList extends Component {
    constructor(props) {
        super(props)
        this.state = {
            users: this.props.users
        }
    }

    setSelectedUser(selectedUser) {
        this.props.selectedUser(selectedUser)
    }

    // Method to Update Last Message
    getLastMessage(userid) {
        for (let chat of Object.values(this.props.chats)) {
            if (chat.members.includes(userid)) {
                return chat.messages[chat.messages.length - 1]
            }
        }
    }

    getLastMessageDetails(user) {
        let lastMessage = this.getLastMessage(user._id)
        const lastMessageDetails = (
            <>
                <div className="grid w-full">
                    <div className="contact-name font-bold px-2">{user.name}</div>
                    {lastMessage ? <div className="last-message px-2 text-sm">{lastMessage.message}</div> : null}
                </div>
                {lastMessage ? <div className="last-message-time w-1/4 text-right">{lastMessage.date}</div> : null}
            </>
        )
        return lastMessageDetails
    }

    getContacts() {

        const contactDetails = this.state.users.map(user =>
            <div className="user flex mt-2 p-2 border-b " id={user._id} key={user._id} onClick={() => this.setSelectedUser(user)}>
                <div className="w-1/4 rounded-full relative h-12 text-center">
                    <img className="profile-picture absolute h-full object-cover self-center" src={"/images/" + user.img} alt="dp" />
                </div>
                {this.getLastMessageDetails(user)}
            </div>
        )
        return (contactDetails)
    }

    render() {
        return (
            <div className="contact-box w-2/5 bg-gray-900 text-white rounded-l">
                <div className="flex mt-2">
                    <i className="las la-bars p-2 ml-2 text-xl"></i>
                    <i className="search-bar las la-search p-2 text-xl"></i>
                    <input className="search-bar px-2 bg-gray-900 text-white w-full focus:outline-none focus:ring rounded" placeholder="Search here.."></input>
                    <i className="las la-ellipsis-v p-2 text-xl"></i>
                </div>
                <div className="contact-list grid-cols-1 p-2">
                    {this.getContacts()}
                </div>
            </div>
        )
    }
}
