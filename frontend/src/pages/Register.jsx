import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate, Link } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import icon from "../assets/icon.png";
import "react-toastify/dist/ReactToastify.css";
import "../css/register.css";

export default function Register() {
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

    const [values, setValues] = useState({
        username: "",
        email: "",
        password: "",
        confirmPassword: "",
    });

    useEffect(() => {
        if (localStorage.getItem(process.env.REACT_APP_LOCALHOST_KEY)) {
            navigate("/");
        }
    }, [navigate]);

    const handleChange = (event) => {
        setValues({ ...values, [event.target.name]: event.target.value });
    };

    const dataValidation = () => {
        const { password, confirmPassword, username, email } = values;
        if (password !== confirmPassword) {
            toast.error("Password and confirm password should be same", toastProps);
            return false;
        }
        else if (username.length < 3) {
            toast.error("Username should be greater than 3 characters", toastProps);
            return false;
        }
        else if (password.length < 8) {
            toast.error("Password should be equal or greater than 8 characters", toastProps);
            return false;
        }
        else if (email === "") {
            toast.error("Email is required.", toastProps);
            return false;
        }

        return true;
    };

    const handleSubmit = async (event) => {
        event.preventDefault();
        if (dataValidation()) {
            const { email, username, password } = values;
            try {
                const { data } = await axios.post("http://localhost:5000/api/auth/register", {
                    username,
                    email,
                    password,
                });

                if (data.status === false) {
                    toast.error(data.msg, toastProps);
                }

                if (data.status === true) {
                    toast.success("User Registered Succesfully", toastProps);
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
            <div className="register-container">
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
                    />
                    <input
                        type="email"
                        placeholder="Email"
                        name="email"
                        onChange={(e) => handleChange(e)}
                    />
                    <input
                        type="password"
                        placeholder="Password"
                        name="password"
                        onChange={(e) => handleChange(e)}
                    />
                    <input
                        type="password"
                        placeholder="Confirm Password"
                        name="confirmPassword"
                        onChange={(e) => handleChange(e)}
                    />
                    <button type="submit">Register</button>
                    <span>
                        Already have an account ? <Link to="/login">Log  In</Link>
                    </span>
                </form>
            </div>
            <ToastContainer />
        </>
    );
}