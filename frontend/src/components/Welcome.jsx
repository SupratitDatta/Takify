import React, { useState, useEffect } from "react";
import Hello from "../assets/hello.gif";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "../css/welcome.css";

export default function Welcome() {
    const [userName, setUserName] = useState("");

    const toastProps = {
        position: "bottom-right",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        theme: "dark",
    };

    const fetchUserName = async () => {
        try {
            const user = JSON.parse(localStorage.getItem(process.env.REACT_APP_LOCALHOST_KEY));
            if (user) {
                setUserName(user.username);
            } 
            else {
                toast.error("User not found in localStorage", toastProps);
            }
        } 
        catch (error) {
            console.error("Error fetching user from localStorage:", error);
            toast.error("Failed to load user information.", toastProps);
        }
    };

    useEffect(() => {
        fetchUserName();
    }, []);

    return (
        <div className="welcome-container">
            <img src={Hello} alt="Hello" />
            <h1>Welcome, <span>{userName}</span>!</h1>
            <h3>Please select a chat to start messaging.</h3>
            <ToastContainer />
        </div>
    );
}