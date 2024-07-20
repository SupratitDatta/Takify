import { User } from "../models/user.model.js";
import bcrypt from "bcrypt";

const login = async (req, res, next) => {
    try {
        const { username, password } = req.body;

        const user = await User.findOne({ username });
        if (!user) {
            return res.json({ msg: "Incorrect Username or Password", status: false });
        }

        if (!(password == user.password)) {
            return res.json({ msg: "Incorrect Username or Password", status: false });
        }

        // const isPasswordValid = await bcrypt.compare(password, user.password);
        // if (!password) {
        //     return res.json({ msg: "Incorrect Username or Password", status: false });
        // }
        // user.password = undefined;

        return res.json({ status: true, user });
    }
    catch (error) {
        next(error);
    }
};

const register = async (req, res, next) => {
    try {
        const { username, email, password } = req.body;

        const isUsernamePresent = await User.findOne({ username });
        if (isUsernamePresent) {
            return res.json({ msg: "Username already exists", status: false });
        }
        if (username.length < 3) {
            return res.json({ msg: "Username should be greater than 3 characters.", status: false });
        }

        const isEmailPresent = await User.findOne({ email });
        if (isEmailPresent) {
            return res.json({ msg: "Email already exists", status: false });
        }

        if (password.length < 8) {
            return res.json({ msg: "Password should be equal or greater than 8 characters.", status: false });
        }

        // const hashedPassword = await bcrypt.hash(password, 10);
        // const user = await User.create({ email, username, password: hashedPassword });
        // user.password = undefined;

        const user = await User.create({ email, username, password});

        return res.json({ status: true, user });
    }
    catch (error) {
        next(error);
    }
};

const getAllUsers = async (req, res, next) => {
    try {
        const users = await User.find({ _id: { $ne: req.params.id } }).select([
            "email", "username", "avatarImage", "_id",
        ]);

        return res.json(users);
    }
    catch (error) {
        next(error);
    }
};

const setAvatar = async (req, res, next) => {
    try {
        const userId = req.params.id;
        const avatarImage = req.body.image;

        const userData = await User.findByIdAndUpdate(
            userId,
            { isAvatarImageSet: true, avatarImage },
            { new: true }
        );

        return res.json({
            isSet: userData.isAvatarImageSet,
            image: userData.avatarImage,
        });
    }
    catch (error) {
        next(error);
    }
};

const logOut = (req, res, next) => {
    try {
        if (!req.params.id) {
            return res.json({ msg: "User id is required " });
        }

        onlineUsers.delete(req.params.id);
        return res.send();
    }
    catch (error) {
        next(error);
    }
};

export { login, register, getAllUsers, setAvatar, logOut };