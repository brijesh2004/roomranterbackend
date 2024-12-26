const express = require("express");
const cors = require('cors');
require("./db/conn");
require('dotenv').config();
const cookieParser = require('cookie-parser');
const userrouter = require('./router/userroute');
const roomsrouter = require('./router/roomsroute');
const chatRoutes = require("./router/chatroute");
const messageRoutes = require("./router/messageRoutes");


// sockit i setup
const http = require('http');
const { Server } = require("socket.io");

const app = express();
const PORT = process.env.PORT || 8000;

// create an http server
const server = http.createServer(app);

// initialize socket.io

const io = new Server(server, {
    pingTimeout:60000,
    cors: {
        origin: `${process.env.LOCALPATH}`,
        // methods: ['GET', 'POST'],
        // credentials: true
    }
})

app.use(cookieParser());
app.use(
    cors({
        origin: `${process.env.LOCALPATH}`,
        methods: ['GET', 'POST', 'DELETE', 'UPDATE'],
        credentials: true
    })
)


app.use(express.json());
app.use("/users", userrouter);
app.use("/rooms", roomsrouter);
app.use("/chat" , chatRoutes);
app.use("/message" , messageRoutes);





io.on('connection' , (socket)=>{

    socket.on('setup' , (userId)=>{
        socket.join(userId);
        socket.emit("connected");
    });

    socket.on("join chat" ,(room)=>{
        socket.join(room);
    })

    socket.on("typeing" , (room)=>socket.in(room).emit("typing"));
    socket.on("stop typing" , (room)=> socket.in(room).emit("stop typing"));

    socket.on("new message" , (data)=>{
        const chat = data.newMessage;
        // in the users we have sender and receiver user
        socket.in(chat.receiver).emit("message received" , chat);
    });

    socket.off("setup" , ()=>{
        socket.leave(userData._id);
    })
})





server.listen(PORT, () => {
    console.log(`Listening on the port Number ${PORT}`);
})

