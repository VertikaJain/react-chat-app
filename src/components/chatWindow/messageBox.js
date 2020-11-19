import React, { Component } from 'react'

export default class MessageBox extends Component {
    constructor(props) {
        super(props)
        this.state = {}
    }
    render() {
        return (
            <div className="message-box w-3/4">
                <div className=" w-full relative h-full grid">


                    <div className="user-bar flex w-full py-2 absolute inset-x-0 top-0">
                        <div className="w-12 rounded-full relative h-12 text-center mx-2">
                            <img className="profile-picture absolute h-full object-cover self-center p-2" src="https://upload.wikimedia.org/wikipedia/en/8/88/Sally_Brown.png" alt="dp" />
                        </div>
                        <div className="contact-name font-bold w-3/4 float-left py-2">username here</div>
                        <div className="icons w-1/4 text-right">
                            <i class="las la-video p-2 text-xl fill-current"></i>
                            <i class="las la-phone p-2 text-xl"></i>
                            <i class="las la-ellipsis-v p-2 text-xl"></i>
                        </div>
                    </div>


                    <div class="message-area clearfix overflow-y-auto mt-16 p-2">msgarea</div>


                    <div className="input-box flex p-4 bottom-0 absolute inset-x-0 bottom-0">
                        <input className="msg-input p-2 w-5/6 float-left text-sm focus:outline-none focus:ring" placeholder="Write Message.."></input>
                        <div className="icons py-2 w-1/6 text-center">
                            <i class="las la-grin p-2 text-xl"></i>
                            <i class="las la-paperclip p-2 text-xl"></i>
                            <i class="las la-image p-2 text-xl"></i>
                        </div>
                        <div className="bar text-gray-300 text-4xl px-4">|</div>
                        <i class="lar la-paper-plane p-4 text-xl mx-4"></i>
                    </div>
                </div>
            </div>
        )
    }
}
