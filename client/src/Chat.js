import React, { useEffect, useState } from 'react';

function Chat({ socket, username, room }) { /* The component accepts three props: socket, username, and room. These props are passed from the parent component, App. */
    const [currentMessage, setCurrentMessage] = useState("");
    const [messageList, setMessageList] = useState([]);

    const sendMessage = async () => { /* Asynchronous function because we want to wait for the message to be sent before updating any state.*/
        if (currentMessage !== "") {
            const messageData = {
                room: room,
                author: username,
                message: currentMessage,
                time: new Date().getHours().toString().padStart(2, '0') + ":" + new Date().getMinutes().toString().padStart(2, '0'),
            };

            await socket.emit("send_message", messageData);
            setMessageList((list) => [...list, messageData]);
            setCurrentMessage(""); /* Clears the chat input every time a text is sent */
        }
    };

    useEffect(() => {
        socket.on("receive_message", (data) => {
            setMessageList((list) => [...list, data]);
        });
    }, [socket]); /* The useEffect hook calls the function inside of it whenever there is a change in the [socket] dependency inside it. */

    return (
        <div className="chat-window">
            <div className="chat-header">
                <p>Live Chat</p>
            </div>
            <div className="chat-body">
                {messageList.map((messageContent, index) => {
                    return (
                        <div key={index} className="message" id={username === messageContent.author ? "you" : "other"}>
                            <div>
                                <div className="message-content">
                                    <p>{messageContent.message}</p>
                                </div>
                                <div className="message-meta">
                                    <p id="time">{messageContent.time}</p>
                                    <p id="author">{messageContent.author}</p>
                                </div>
                            </div>
                        </div>
                    );
                })}
            </div>
            <div className="chat-footer">
                <input type="text" value={currentMessage} placeholder="Type a message" onChange={(event) => { setCurrentMessage(event.target.value) }} onKeyDown={(event) => { event.key === "Enter" && sendMessage() }} />
                <button onClick={sendMessage}>&#9658;</button>
            </div>
        </div>
    );
}

export default Chat;