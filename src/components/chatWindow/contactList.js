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

    getLastMessage(userid) {
        for (let i = this.props.messageData.length - 1; i > 0; i--) {
            if (this.props.messageData[i].from === userid || this.props.messageData[i].to === userid) {
                return <div className="last-message px-2 text-sm">{this.props.messageData[i].msg}</div>
            }
        }
    }

    getLastMessageTime(userid){
        for (let i = this.props.messageData.length - 1; i > 0; i--) {
            if (this.props.messageData[i].from === userid || this.props.messageData[i].to === userid) {
            return <div className="last-message-time w-1/4 text-right">{this.props.messageData[i].time}</div>
            }
        }
    }

    getContacts() {
        const contactDetails = this.state.users.map(user =>
            <div className="user flex mt-2 p-2 border-b " id={user._id} key={user._id} onClick={() => this.setSelectedUser(user)}>
                <div className="w-1/4 rounded-full relative h-12 text-center">
                    <img className="profile-picture absolute h-full object-cover self-center px-2" src={user.img} alt="dp" />
                </div>
                <div className="grid w-full">
                    <div className="contact-name font-bold px-2">{user.name}</div>
                    {this.getLastMessage(user._id)}
                </div>
                {this.getLastMessageTime(user._id)}
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
