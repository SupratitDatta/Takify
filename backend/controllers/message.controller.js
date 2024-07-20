import { Message } from "../models/message.model.js";

const getMessages = async (req, res, next) => {
    try {
        const { from, to } = req.body;
        if (!from || !to) {
            return res.status(400).json({ msg: "From and To fields are required" });
        }

        const messages = await Message.find({
            users: {
                $all: [from, to],
            },
        }).sort({ updatedAt: 1 });

        const projectedMessages = messages.map((msg) => ({
            fromSelf: msg.sender.toString() === from,
            message: msg.message.text,
        }));

        res.json(projectedMessages);
    } catch (ex) {
        next(ex);
    }
};

const addMessage = async (req, res, next) => {
    try {
        const { from, to, message } = req.body;
        if (!from || !to || !message) {
            return res.status(400).json({ msg: "From, To, and Message fields are required" });
        }

        const data = await Message.create({
            message: { text: message },
            users: [from, to],
            sender: from,
        });

        if (data) {
            res.json({ msg: "Message added successfully." });
        } else {
            res.status(500).json({ msg: "Failed to add message to the database" });
        }
    } catch (error) {
        next(error);
    }
};

export { getMessages, addMessage };
