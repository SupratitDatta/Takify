import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { Buffer } from "buffer";
import loader from "../assets/loader.gif";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "../css/setAvatar.css"

export default function SetAvatar() {
    const navigate = useNavigate();
    const [avatars, setAvatars] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [selectedAvatar, setSelectedAvatar] = useState(undefined);

    const toastProps = {
        position: "bottom-right",
        autoClose: 8000,
        pauseOnHover: true,
        draggable: true,
        theme: "dark",
    };

    useEffect(() => {
        const checkUser = async () => {
            if (!localStorage.getItem(process.env.REACT_APP_LOCALHOST_KEY)) {
                navigate("/login");
            }
        };
        checkUser();
    }, [navigate]);

    const setProfilePicture = async () => {
        if (selectedAvatar === undefined) {
            toast.error("Please select an avatar", toastProps);
        }
        else {
            const user = await JSON.parse(
                localStorage.getItem(process.env.REACT_APP_LOCALHOST_KEY)
            );

            const { data } = await axios.post(`http://localhost:5000/api/auth/setavatar/${user._id}`, {
                image: avatars[selectedAvatar],
            });

            if (data.isSet) {
                user.isAvatarImageSet = true;
                user.avatarImage = data.image;
                localStorage.setItem(
                    process.env.REACT_APP_LOCALHOST_KEY,
                    JSON.stringify(user)
                );
                navigate("/");
            }
            else {
                toast.error("Error setting avatar. Please try again.", toastProps);
            }
        }
    };

    const fetchAvatars = async () => {
        const data = [];
        let fetchedAvatar = true;
        for (let i = 0; i < 5; i++) {
            try {
                const image = await axios.get(`https://api.multiavatar.com/4645646/${Math.round(Math.random() * 1000)}`);
                const buffer = new Buffer(image.data);
                data.push(buffer.toString("base64"));
            }
            catch (error) {
                fetchedAvatar = false;
            }
        }
        if (!fetchedAvatar) {
            toast.error("Error fetching avatars. Please try again later.", toastProps);
        }
        setAvatars(data);
        setIsLoading(false);
    };

    useEffect(() => {
        fetchAvatars();
    }, []);

    return (
        <>
            {isLoading ? (
                <div className="avatar-container">
                    <img src={loader} alt="loader" className="loader" />
                </div>
            ) : (
                <div className="avatar-container">
                    <div className="title-container">
                        <h1>Pick an Avatar as your profile picture</h1>
                    </div>
                    <div className="avatars">
                        {avatars.map((avatar, index) => {
                            return (
                                <div
                                    key={index}
                                    className={`avatar ${selectedAvatar === index ? "selected" : ""
                                        }`}
                                >
                                    <img
                                        src={`data:image/svg+xml;base64,${avatar}`}
                                        alt="avatar"
                                        onClick={() => setSelectedAvatar(index)}
                                    />
                                </div>
                            );
                        })}
                    </div>
                    <button onClick={setProfilePicture} className="submit-btn">
                        Set as Profile Picture
                    </button>
                    <ToastContainer />
                </div>
            )}
        </>
    );
}