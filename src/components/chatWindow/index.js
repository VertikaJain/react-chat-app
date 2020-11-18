import React, { Component } from 'react'
import axios from 'axios'

export default class ChatWindow extends Component {
    constructor(props) {
        super(props)
        this.state = {
            users: []
        } //empty array of users/contacts

        console.log("props: ", this.props);
    }

    componentDidMount() {
        axios.get(`http://localhost:3000/api/users/${this.props.id}`)
            .then(response => {
                console.log("response:", response)
                this.setState({ users: response.data.data })
                console.log("users: ", this.state.users);
            })
    }

    getContacts() {
        const listItems = this.state.users.map((user) =>
            <li key={user._id}>{user.name}</li>
        );
        return (
            <ul>{listItems}</ul>
        );

    }

    render() {
        return (
            <div>
                <label class="block text-lg font-bold mb-4 py-2 text-center bg-blue-800 text-white">QED42 Chat Window</label>
                <div className="flex container mx-auto m-4">

                    <div className="container w-1/4 mx-auto px-8 items-center py-2" >
                        <label className="font-bold mb-2 p-2">Contacts</label>
                        {this.getContacts()}
                        {/* <select
                            class="text-xl font-bold mb-2 p-2 w-full text-center bg-blue-500 rounded focus:outline-none focus:shadow-outline text-white"
                            id="receiver">
                        </select> */}
                    </div>

                    <div class="chat-window container w-3/4 mx-auto px-8 items-center py-2 border">
                        <label className="sender-heading text-xl font-bold mb-2 py-2 px-4 w-full text-center bg-blue-500 rounded focus:outline-none focus:shadow-outline text-white">
                            Selected Contact: </label>

                        <div class="message-area clearfix h-64 overflow-y-auto"></div>

                        <div class="input-area flex mt-2">
                            <input name="message" id="inputTextMessage"
                                class="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                                type="text" placeholder="Enter message here..." />
                            <button id="send"
                                class="btn-primary rounded-full text-white font-bold py-2 px-4 ml-4 rounded focus:outline-none focus:shadow-outline"
                                type="submit">
                                Send
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        )
    }
}
