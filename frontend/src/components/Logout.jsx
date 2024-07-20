import React from "react";
import { useNavigate } from "react-router-dom";
import { BiPowerOff } from "react-icons/bi";
import axios from "axios";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "../css/logout.css";

export default function Logout() {
    const navigate = useNavigate();

    const toastProps = {
        position: "bottom-right",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        theme: "dark",
    };

    const handleClick = async () => {
        try {
            const id = await JSON.parse(
                localStorage.getItem(process.env.REACT_APP_LOCALHOST_KEY)
            )._id;
            const data = await axios.get(`http://localhost:5000/api/auth/logout/${id}`);
            if (data.status === 200) {
                localStorage.clear();
                navigate("/login");
                toast.success("Successfully logged out!", toastProps);
            }
            else {
                toast.error("Logout failed. Please try again.", toastProps);
            }
        }
        catch (error) {
            console.error("Error during logout:", error);
            toast.error("An error occurred. Please try again later", toastProps);
        }
    };
    return (
        <button className="logout-button" onClick={handleClick}>
            <BiPowerOff />
            <ToastContainer />
        </button>
    );
}