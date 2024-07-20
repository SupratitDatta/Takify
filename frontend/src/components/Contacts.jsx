import React, { useState, useEffect } from "react";
import icon from "../assets/icon.png";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "../css/contacts.css";

export default function Contacts({ contacts, changeChat }) {
    const [currentUserName, setCurrentUserName] = useState("");
    const [currentUserImage, setCurrentUserImage] = useState("");
    const [currentSelected, setCurrentSelected] = useState(undefined);

    const toastProps = {
        position: "bottom-right",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        theme: "dark",
    };

    useEffect(() => {
        const fetchUserData = async () => {
            try {
                const userData = JSON.parse(localStorage.getItem(process.env.REACT_APP_LOCALHOST_KEY));
                if (userData) {
                    setCurrentUserName(userData.username);
                    setCurrentUserImage(userData.avatarImage);
                }
                else {
                    toast.error("No user data found in localStorage", toastProps);
                }
            }
            catch (error) {
                console.error("Error fetching user data from localStorage:", error);
                toast.error("Failed to load user data. Please refresh the page", toastProps);
            }
        };

        fetchUserData();
    }, []);

    const changeCurrentChat = (index, contact) => {
        setCurrentSelected(index);
        changeChat(contact);
    };

    return (
        <div className="contact-container">
            <div className="brand">
                <img src={icon} alt="logo" />
                <h1>TAKIFY</h1>
            </div>
            <div className="contacts">
                {contacts.map((contact, index) => (
                    <div
                        key={contact._id}
                        className={`contact ${index === currentSelected ? "selected" : ""}`}
                        onClick={() => changeCurrentChat(index, contact)}
                    >
                        <div className="avatar">
                            <img src={`data:image/svg+xml;base64,${contact.avatarImage}`} alt="" />
                        </div>
                        <div className="username"><h3>{contact.username}</h3></div>
                    </div>
                ))}
            </div>
            <div className="current-user">
                <div className="avatar">
                    <img src={`data:image/svg+xml;base64,${currentUserImage}`} alt="avatar" />
                </div>
                <div className="username">
                    <h2>{currentUserName}</h2>
                </div>
            </div>
            <ToastContainer />
        </div>
    );
}