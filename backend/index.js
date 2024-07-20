import app from "./app.js";
import dotenv from "dotenv";
import { Server } from "socket.io";
import ConnectDB from "./database/index.js";

dotenv.config({
    path: './.env'
});

const startServer = async () => {
    try {
        await ConnectDB();

        app.on("error", (error) => {
            console.error("The following error occurred: ", error);
            throw error;
        });

        const PORT = process.env.PORT || 5000;
        const server = app.listen(PORT, () => {
            console.log(`SERVER HAS STARTED AT PORT ${PORT}`);
        });

        const io = new Server(server, {
            cors: {
                origin: "http://localhost:3000",
                credentials: true,
            },
        });

        global.onlineUsers = new Map();

        io.on("connection", (socket) => {
            global.chatSocket = socket;

            socket.on("add-user", (userId) => {
                onlineUsers.set(userId, socket.id);
            });

            socket.on("send-msg", (data) => {
                const sendUserSocket = onlineUsers.get(data.to);
                if (sendUserSocket) {
                    socket.to(sendUserSocket).emit("msg-receive", data.msg);
                }
            });
        });

    } catch (err) {
        console.error("MongoDB connection failed. The following error occurred: ", err);
    }
};

startServer();
