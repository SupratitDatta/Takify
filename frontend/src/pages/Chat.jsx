import React, { useEffect, useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import ChatContainer from "../components/ChatContainer";
import Contacts from "../components/Contacts";
import Welcome from "../components/Welcome";
import { io } from "socket.io-client";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "../css/chat.css";

export default function Chat() {
    const navigate = useNavigate();
    const socket = useRef(null);
    const [contacts, setContacts] = useState([]);
    const [currentChat, setCurrentChat] = useState(null);
    const [currentUser, setCurrentUser] = useState(null);

    const toastProps = {
        position: "bottom-right",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        theme: "dark",
    };

    const checkUserLoggedIn = async () => {
        try {
            const user = JSON.parse(localStorage.getItem(process.env.REACT_APP_LOCALHOST_KEY));
            if (!user) {
                navigate("/login");
            }
            else {
                setCurrentUser(user);
            }
        }
        catch (error) {
            console.error("Error fetching user from localStorage:", error);
            toast.error("Error fetching user data. Redirecting to login.", toastProps);
            navigate("/login");
        }
    };

    useEffect(() => {
        checkUserLoggedIn();
    }, [navigate]);

    useEffect(() => {
        if (currentUser) {
            socket.current = io("http://localhost:5000");
            socket.current.emit("add-user", currentUser._id);

            return () => {
                socket.current.disconnect();
            };
        }
    }, [currentUser]);

    const fetchUsers = async () => {
        try {
            if (currentUser) {
                if (currentUser.isAvatarImageSet) {
                    const response = await axios.get(`http://localhost:5000/api/auth/allusers/${currentUser._id}`);
                    setContacts(response.data);
                }
                else {
                    navigate("/setAvatar");
                }
            }
        }
        catch (error) {
            console.error("Error fetching users:", error);
            toast.error("Failed to fetch users. Please try again later.", toastProps);
        }
    };

    useEffect(() => {
        if (currentUser) {
            fetchUsers();
        }
    }, [currentUser, navigate]);

    const handleChatChange = (chat) => {
        setCurrentChat(chat);
    };

    return (
        <>
            <div className="chat-body">
                <div className="wrap">
                    <div className="top-plane"></div>
                    <div className="container">
                        <Contacts contacts={contacts} changeChat={handleChatChange} />
                        {currentChat === null ? (
                            <Welcome />
                        ) : (
                            <ChatContainer currentChat={currentChat} socket={socket.current} />
                        )}
                    </div>
                    <div className="bottom-plane"></div>
                </div>
            </div>
            <ToastContainer />
        </>
    );
}