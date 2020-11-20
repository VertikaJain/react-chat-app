import React, { Component } from 'react'

export default class ContactList extends Component {
    constructor(props) {
        super(props)
        this.state = {
            users: this.props.users,
        }
    }

    setSelectedUser(selectedUser) {
        this.props.selectedUser(selectedUser)
    }

    getContacts() {

        const contactDetails = this.state.users.map(user =>
            <div className="user flex mt-2 p-2 border-b " id={user._id} key={user._id} onClick={() => this.setSelectedUser(user)}>
                <div className="w-1/4 rounded-full relative h-12 text-center">
                    <img className="profile-picture absolute h-full object-cover self-center px-2" src={user.img} alt="dp" />
                </div>
                <div className="grid w-full">
                    <div className="contact-name font-bold px-2">{user.name}</div>
                    <div className="last-message px-2 text-sm">hi there creating chat app in react js with typescript at qed42</div>
                </div>
                <div className="last-message-time w-1/4 text-right">18:00</div>
            </div>
        )
        return (contactDetails)
    }

    render() {
        return (
            <div className="contact-box w-2/5 bg-gray-900 text-white rounded-l">
                <div className="flex mt-2">
                    <i class="las la-bars p-2 ml-2 text-xl"></i>
                    <i className="search-bar las la-search p-2 text-xl"></i>
                    <input className="search-bar px-2 bg-gray-900 text-white w-full focus:outline-none focus:ring rounded" placeholder="Search here.."></input>
                    <i class="las la-ellipsis-v p-2 text-xl"></i>
                </div>
                <div className="contact-list grid-cols-1 p-2">
                    {this.getContacts()}
                </div>
            </div>
        )
    }
}
