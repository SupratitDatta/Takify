import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import authRoute from "./routes/auth.routes.js"
import messageRoutes from "./routes/messages.routes.js"

const app = express();
dotenv.config({ path: "./.env" });

app.use(
    cors({
        origin: [process.env.FRONTEND_URL],
        methods: "POST",
        credentials: true,
    })
);

app.use(express.json({ limit: "16kb" }));
app.use(express.urlencoded({ extended: true, limit: "16kb" }));
app.use(express.static("public"));

app.get("/ping", (_req, res) => {
    return res.json({ msg: "Ping Successful" });
});
app.use("/api/auth", authRoute);
app.use("/api/messages", messageRoutes);

export default app;