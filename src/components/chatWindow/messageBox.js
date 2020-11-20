import React, { Component } from 'react'

export default class MessageBox extends Component {
    constructor(props) {
        super(props)
        this.state = {}
    }


    render() {
        return (
            <div className="message-box w-3/5">
                <div className=" w-full relative h-full grid grid-flow-rows">

                    <div className="user-bar flex w-full py-4 absolute inset-x-0 top-0">
                        <div className="w-12 rounded-full relative h-12 text-center mx-2">
                            <img className="profile-picture absolute h-full object-cover self-center p-2" src="https://upload.wikimedia.org/wikipedia/en/8/88/Sally_Brown.png" alt="dp" />
                        </div>
                        <div className="contact-name font-bold w-3/4 float-left py-2">username here</div>
                        <div className="icons w-1/4 text-right mr-4">
                            <i class="fas fa-video p-2 text-l"></i>
                            <i class="fa fa-phone p-2 text-l"></i>
                            <i class="fa fa-ellipsis-v p-2 text-l"></i>
                        </div>
                    </div>

                    <div class="message-area clearfix overflow-auto my-20 p-2">

                        <div className="incoming w-3/4 float-left flex my-2">
                            <div className="w-16 rounded-full relative h-16 mx-2 border px-2">
                                <img className="profile-picture absolute h-full object-cover self-center p-2" src="https://upload.wikimedia.org/wikipedia/en/8/88/Sally_Brown.png" alt="dp" />
                            </div>
                            <div className=" w-5/6 float-left bg-black text-white shadow-lg clear-both p-16 rounded-tr-lg rounded-br-lg rounded-bl-lg mt-2">
                                incoming msgorem  </div>
                        </div>

                        <div className="outgoing w-3/4 justify-end float-right flex my-2">
                            <div className=" w-5/6 text-black shadow-lg clear-both p-16 float-right rounded-tl-md rounded-br-md rounded-bl-md mt-2">
                                outgoing msg orem orem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged. It was popularised in the 1960s with the release of Letraset sheets containing Lorem Ipsum passages, and more recently with desktop publishing software like Aldus PageMaker including versions 
                            </div>
                            <div className="w-16 rounded-full relative h-16 mx-2 px-2 border float-right">
                                <img className="profile-picture absolute h-full object-cover self-center p-2" src="https://upload.wikimedia.org/wikipedia/en/8/88/Sally_Brown.png" alt="dp" />
                            </div>
                        </div>

        
                    </div>

                    <div className="input-box flex p-4 bottom-0 absolute inset-x-0 bottom-0 bg-white">
                        <input className="msg-input p-2 w-4/5 float-left text-sm focus:outline-none focus:ring" placeholder="Write Message.."></input>
                        <div className="icons py-2 w-1/5 text-center flex">
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
