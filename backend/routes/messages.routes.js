import { Router } from "express";
import { addMessage, getMessages } from "../controllers/message.controller.js";

const router = Router();

router.post("/addmsg/", addMessage);
router.post("/getmsg/", getMessages);

export default router;