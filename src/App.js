import React, { Component } from 'react'
import Login from './components/login/login'
import ChatWindow from "./components/chatWindow/chatWindow";

import './App.css';
export default class ChatApp extends Component {
  constructor(props) {
    super(props)
    this.state = {
      isLoggedIn: false,
      id: ""
    }
    this.setLoggedinUser = this.setLoggedinUser.bind(this)
  }

  setLoggedinUser(userid) {
    this.setState({ isLoggedIn: true })
    this.setState({ id: userid })
  }

  render() {

    return (
      <div className="App">
        { !this.state.isLoggedIn && <Login loginProp={this.setLoggedinUser} />}
        { this.state.isLoggedIn && this.state.id !== "" && <ChatWindow id={this.state.id} />}
      </div>
    )
  }
}
