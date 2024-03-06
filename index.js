// we are upgrading a connection from http to socket

const express = require('express');
const app=express();
const path = require('path');
const {Server} =require("socket.io")

// we can't attach socket io directly to express hence we need http module
const http=require("http");
const { Socket } = require('dgram');
const server=http.createServer(app)  
const io = new Server(server) // this will handle sockets

app.use(express.static(path.resolve("./public")));
app.get("/",(req,res)=>{
    return res.sendFile("/public/index.html")
})

io.on("connection",(socket)=>{  //socket==client
    console.log("new user")
    socket.on("user-msg",message=>{
        returnMessage=[message[0],message[1]];
        io.emit("message",returnMessage);
    }
)})

server.listen(9000,()=>{
    console.log(`server started at port 9000`)
})
