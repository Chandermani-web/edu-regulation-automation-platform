import http from "http";
import { Server } from 'socket.io';
import app from "./app.js";
import connectDB from "./database/index.db.js";
import dotenv from 'dotenv';

dotenv.config();
const PORT = process.env.PORT || 3000;

// create server and socker.io instance first
const server = http.createServer(app);
export const io = new Server(server, {
    cors: {
        origin: "https://5173",
        credentials: true,
    }
});
export let onlineUsers = new Map();

io.on("connection",(socket)=>{
    console.log("🟢 User connected:", socket.id);
})


// connect database then start server
connectDB()
    .then(()=>{
        server.listen(PORT, ()=>{
            console.log(`Server running on http://localhost:${PORT}`);
        });
    })
    .catch((err)=>{
        console.log("Failed to connect to DB",err);
    });