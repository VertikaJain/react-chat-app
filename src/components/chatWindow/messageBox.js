import React, { Component } from 'react'

export default class MessageBox extends Component {
    constructor(props) {
        super(props)
        this.state = {
            msgText: "",
        }
        this.sendMessageToServer = this.sendMessageToServer.bind(this)
    }

    handleMessageText(e) {
        this.setState({ msgText: e.target.value })
    }

    sendMessageToServer() {
        if (this.state.msgText) { //to not send empty message
            let msgObj = {
                message: this.state.msgText,
                date: Date.now()
            }
            this.props.setNewMsgObj(msgObj)
        }
    }

    addMessagesToChat() {
        const msgContent = this.props.messageData.map(function (mdata) {
            if ( mdata.to === this.props.selectedUser._id)
                return (<div key={mdata.msgid} className="outgoing w-3/4 justify-end float-right flex my-2">
                    <div className=" w-max text-black shadow-lg clear-both p-8 rounded-tl-md rounded-br-md rounded-bl-md mt-2">
                        {mdata.msg}</div>
                    <div className="w-16 rounded-full relative h-16 mx-2 px-2 border">
                        <img className="profile-picture absolute h-full object-cover self-center p-2" src="https://upload.wikimedia.org/wikipedia/en/8/88/Sally_Brown.png" alt="dp" />
                    </div>
                </div>)
            else
                return (<div key={mdata.msgid} className="incoming w-3/4 flex my-2">
                    <div className="w-16 rounded-full relative h-16 mx-2 border px-2">
                        <img className="profile-picture absolute h-full object-cover self-center p-2" src={this.props.selectedUser.img} alt="dp" />
                    </div>
                    <div className=" w-5/6 bg-gray-900 text-white shadow-lg clear-both p-8 rounded-tr-lg rounded-br-lg rounded-bl-lg mt-2">
                        {mdata.msg}</div>
                </div>)



        }.bind(this))
        return (msgContent)
    }

    render() {
        return (
            <div className="message-box w-3/5">
                <div className=" w-full relative h-full grid grid-flow-rows">

                    <div className="user-bar flex w-full py-4 absolute inset-x-0 top-0">
                        <div className="w-12 rounded-full relative h-12 text-center mx-2">
                            <img className="profile-picture absolute h-full object-cover self-center p-2" src={this.props.selectedUser.img} alt="dp" />
                        </div>
                        <div className="contact-name font-bold w-3/4 float-left py-2">{this.props.selectedUser.name}</div>
                        <div className="icons w-1/4 text-right mr-4">
                            <i className="fas fa-video p-2 text-l"></i>
                            <i className="fa fa-phone p-2 text-l"></i>
                            <i className="fa fa-ellipsis-v p-2 text-l"></i>
                        </div>
                    </div>

                    <div className="message-area clearfix overflow-auto my-20 p-2">
                        {this.addMessagesToChat()}
                    </div>

                    <div className="input-box flex p-4 bottom-0 absolute inset-x-0 bottom-0 bg-white">
                        <input className="msg-input p-2 w-4/5 float-left text-sm focus:outline-none focus:ring" placeholder="Write Message.."
                            value={this.state.msgText} onChange={(e) => this.handleMessageText(e)}>
                        </input>
                        <div className="icons py-2 w-1/5 text-center flex">
                            <i className="las la-grin p-2 text-xl"></i>
                            <i className="las la-paperclip p-2 text-xl"></i>
                            <i className="las la-image p-2 text-xl"></i>
                        </div>
                        <div className="bar text-gray-300 text-4xl px-4">|</div>

                        <i className="send-button lar la-paper-plane p-4 text-xl mx-4" onClick={() => this.sendMessageToServer()}></i>
                    </div>
                </div>
            </div>
        )
    }
}
