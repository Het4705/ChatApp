const express = require('express');
const app = express();
const path = require('path');
const { Server } = require('socket.io');
const http = require('http');
const server = http.createServer(app);
const io = new Server(server);

app.use(express.static(path.resolve("./public")));
app.get("/", (req, res) => {
    return res.sendFile(path.resolve("./public/index.html")); // Use path.resolve for consistent file path
});

let activeUserCount = 0; // To store the number of active users

io.on("connection", (socket) => {
    const clientIPAddress = socket.handshake.address;
    console.log(`New user connected from IP address: ${clientIPAddress}`);
    activeUserCount++; // Increment the active user count

    // Emit the updated active user count to all clients
    io.emit('update-user-count', activeUserCount);

    // Handle user messages
    socket.on("user-msg", (message) => {
        const returnMessage = [message[0], message[1]];
        io.emit("message", returnMessage);
    });

    // Handle user disconnection
    socket.on("disconnect", () => {
        console.log("User disconnected");
        activeUserCount--; // Decrement the active user count
        io.emit('update-user-count', activeUserCount); // Broadcast the updated user count
    });
});

server.listen(9000, () => {
    console.log(`Server started at port 9000`);
});
