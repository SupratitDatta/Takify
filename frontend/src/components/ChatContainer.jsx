import React, { useState, useEffect, useRef, useLayoutEffect } from "react";
import ChatInput from "./ChatInput";
import Logout from "./Logout";
import axios from "axios";
import { v4 as uuidv4 } from "uuid";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "../css/chatContainer.css";

export default function ChatContainer({ currentChat, socket }) {
    const [messages, setMessages] = useState([]);
    const scrollRef = useRef();
    const [arrivalMessage, setArrivalMessage] = useState(null);

    const toastProps = {
        position: "bottom-right",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        theme: "dark",
    };

    const handleSendMsg = async (msg) => {
        try {
            const userData = JSON.parse(localStorage.getItem(process.env.REACT_APP_LOCALHOST_KEY));
            if (userData) {
                socket.emit("send-msg", {
                    to: currentChat._id,
                    from: userData._id,
                    msg,
                });
                await axios.post("http://localhost:5000/api/messages/addmsg", {
                    from: userData._id,
                    to: currentChat._id,
                    message: msg,
                });
                const newMessage = { fromSelf: true, message: msg };
                setMessages((prevMessages) => [...prevMessages, newMessage]);
            }
        }
        catch (error) {
            console.error("Error sending message:", error);
            toast.error("An unexpexted error occured while sending message", toastProps);
        }
    };

    const fetchMessages = async () => {
        try {
            const userData = JSON.parse(localStorage.getItem(process.env.REACT_APP_LOCALHOST_KEY));
            if (userData) {
                const response = await axios.post("http://localhost:5000/api/messages/getmsg", {
                    from: userData._id,
                    to: currentChat._id,
                });
                setMessages(response.data);
            }
        }
        catch (error) {
            console.error("Error fetching messages:", error);
            toast.error("Something went wrong while fetching messages", toastProps);
        }
    };

    useEffect(() => {
        if (currentChat) {
            fetchMessages();
        }
    }, [currentChat, messages]);

    useEffect(() => {
        if (socket) {
            socket.on("msg-recieve", (msg) => {
                setArrivalMessage({ fromSelf: false, message: msg });
            });
        }
    }, [socket]);

    useEffect(() => {
        if (arrivalMessage) {
            setMessages((prevMessages) => [...prevMessages, arrivalMessage]);
        }
    }, [arrivalMessage]);

    useLayoutEffect(() => {
        scrollRef.current?.scrollIntoView({ behavior: "smooth" });
    }, [messages.length]);

    return (
        <>
            <div className="chat-container">
                <div className="chat-header">
                    <div className="user-details">
                        <div className="avatar">
                            <img
                                src={`data:image/svg+xml;base64,${currentChat.avatarImage}`}
                                alt=""
                            />
                        </div>
                        <div className="username">
                            <h3>{currentChat.username}</h3>
                        </div>
                    </div>
                    <Logout />
                </div>
                <div className="chat-messages">
                    {messages.map((message) => (
                        <div key={uuidv4()} className={`message ${message.fromSelf ? "sended" : "received"}`}>
                            <div className="content">
                                <p>{message.message}</p>
                            </div>
                        </div>
                    ))}
                    <div ref={scrollRef}></div>
                </div>
                <ChatInput handleSendMsg={handleSendMsg} />
                <ToastContainer />
            </div>
        </>
    );
}