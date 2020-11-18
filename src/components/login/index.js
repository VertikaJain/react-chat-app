import React, { Component } from 'react'
import axios from 'axios'

export default class Login extends Component {
    constructor(props) {
        super(props)
        this.state = {
            username: "",
        }
    }

    onLoginComplete = (userid) => {
        this.props.loginProp(userid)
    }

    login = () => {
        // Call Login API to get user ID if the user exists in DB
        axios.get(`http://localhost:3000/api/users/login/${this.state.username}`)
            .then(response => {
                this.onLoginComplete(response.data._id)
            })
    }

    handleUser = e => {
        this.setState({ username: e.target.value })
    }
    render() {
        return (
            <div>
                <div className="login container mx-auto w-full max-w-xs items-center pt-12">
                    <form action="chat.html" method="GET" className="bg-white shadow-md rounded px-8 pt-8 pb-8 m-4">
                        <label className="block text-lg font-bold mb-4 py-2 text-center bg-blue-500 rounded text-white">QED42 Chat Login</label>
                        <div className="mb-4">
                            <label className="block text-gray-700 text-sm font-bold mb-2"/*  for="username" */>
                                Username</label>
                            <input value={this.state.username} onChange={(e) => this.handleUser(e)}
                                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                                id="username" type="text" placeholder="Enter Username here..." />
                        </div>
                        <button id="login" onClick={() => this.login()}
                            class="btn-primary rounded-full text-white font-bold py-2 px-4 mx-16 rounded focus:outline-none focus:shadow-outline place-self-center"
                            type="button">
                            Sign In</button>
                    </form>
                    <p className="text-center text-gray-500 text-xs">
                        &copy;2020 QED42. All rights reserved.</p>
                </div>
            </div>
        )
    }
}
