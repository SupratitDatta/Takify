import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate, Link } from "react-router-dom";
import icon from "../assets/icon.png";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "../css/login.css"

export default function Login() {
    const navigate = useNavigate();
    const [values, setValues] = useState({ username: "", password: "" });
    
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
        if (localStorage.getItem(process.env.REACT_APP_LOCALHOST_KEY)) {
            navigate("/");
        }
    }, [navigate]);

    const handleChange = (event) => {
        setValues({ ...values, [event.target.name]: event.target.value });
    };

    const dataValidation = () => {
        const { username, password } = values;
        if (username === "" || password === "") {
            toast.error("Username and Password are required", toastProps);
            return false;
        }
        return true;
    };

    const handleSubmit = async (event) => {
        event.preventDefault();
        if (dataValidation()) {
            const { username, password } = values;
            try {
                const { data } = await axios.post("http://localhost:5000/api/auth/login", {
                    username,
                    password,
                });
                if (!data.status) {
                    toast.error(data.msg, toastProps);
                } else {
                    localStorage.setItem(
                        process.env.REACT_APP_LOCALHOST_KEY,
                        JSON.stringify(data.user)
                    );
                    navigate("/");
                }
            }
            catch (error) {
                toast.error("Something went wrong. Please try again", toastProps);
            }
        }
    };

    return (
        <>
            <div className="login-container">
                <form action="" onSubmit={(event) => handleSubmit(event)}>
                    <div className="brand">
                        <img src={icon} alt="logo" />
                        <h1>TAKIFY</h1>
                    </div>
                    <input
                        type="text"
                        placeholder="Username"
                        name="username"
                        onChange={(e) => handleChange(e)}
                        min="3"
                    />
                    <input
                        type="password"
                        placeholder="Password"
                        name="password"
                        onChange={(e) => handleChange(e)}
                    />
                    <button type="submit">Log In</button>
                    <span>
                        Don't have an account ? <Link to="/register">SIGN UP</Link>
                    </span>
                </form>
            </div>
            <ToastContainer />
        </>
    );
}