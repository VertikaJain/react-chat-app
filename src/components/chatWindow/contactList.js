import React, { Component } from 'react'
// import { Link } from 'react-router-dom';

export default class ContactList extends Component {
    constructor(props) {
        super(props)
        this.state = {
            users: this.props.users,
            selectedUserID: ""
        }
    }

    setSelectedUser(userid) {
        this.setState({ selectedUserID: userid })
        this.props.msgUser(userid)
    }

    getContacts() {
        const contactDetails = this.state.users.map(user =>
            <div className="user flex mt-2" id={user._id} key={user._id} onClick={() => this.setSelectedUser(user._id)}>
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
            <div className="contact-box w-1/4 bg-blue-900 text-white ">
                <div className="flex">
                    <i class="las la-bars p-2 text-xl"></i>
                    <i className="search-bar las la-search p-2 text-xl"></i>
                    <input className="search-bar px-2 bg-blue-900 text-white w-full " placeholder="Search here.."></input>
                </div>
                <div className="contact-list grid-cols-1 p-2">
                    {this.getContacts()}
                </div>
            </div>
        )
    }
}
