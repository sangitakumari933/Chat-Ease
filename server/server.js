import express from "express";
import dotenv from "dotenv"
import cors from "cors";
import http from "http";
import { connectDB } from "./config/db.js";
import userRouter from "./routes/userRoutes.js";
import messageRouter from "./routes/messageRoutes.js";
import {Server} from "socket.io";
import cookieParser from "cookie-parser";

dotenv.config({
  path:".env"
})

//create express app and http 
const app = express();
const server = http.createServer(app);

//instialize socket.io server
export const io = new Server(server, {
   cors: {
    origin: "https://chat-ease-client.vercel.app",
    credentials: true,
  },
});

//Store online users 
export const userSocketMap = {}; //{userId:socketId}

//socket.io connection handler
io.on("connection", (socket)=>{
  const userId = socket.handshake.query.userId;
  

  if(userId) userSocketMap[userId] = socket.id;

  //emit online users to all connected clients
  io.emit("getOnlineUsers", Object.keys(userSocketMap));

  socket.on("disconnect", ()=>{
    delete userSocketMap[userId];
    io.emit('getOnlineUsers', Object.keys(userSocketMap))
  })
})

//middleware setup
app.use(express.json({limit:"4mb"}));
app.use(cookieParser());


app.use(
  cors({
    origin: "http://localhost:5173",
    credentials: true,
  })
);

app.use("/api/auth", userRouter);
app.use("/api/messages", messageRouter);

const PORT = process.env.PORT || 5000;

//connect to mongoDb
connectDB();

export default server;

