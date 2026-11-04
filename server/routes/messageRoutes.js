import express from "express"; 
import  {isAunthenticated } from "../middleware/auth.js";
import { getMessages, getUserForSideBar, sendMessage } from "../controllers/messageController.js";
import upload from "../middleware/multer.js";

const messageRouter = express.Router();

messageRouter.get("/users", isAunthenticated, getUserForSideBar);
messageRouter.get("/get-messages/:id", isAunthenticated, getMessages);
messageRouter.get("mark/:id", isAunthenticated, getMessages);
messageRouter.post("/send/:id", isAunthenticated, upload.single("image"), sendMessage);

export default messageRouter;