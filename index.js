const express = require('express');
const app = express();
const path = require('path');
const { Server } = require('socket.io');
const http = require('http');
const server = http.createServer(app);
const io = new Server(server);

app.use(express.static(path.resolve("./public")));
app.get("/", (req, res) => {
    return res.sendFile(path.resolve("./public/index.html"));
});

let userCount = 0;
let activeUsers = {}; // To store the active users and their names

io.on("connection", (socket) => {
    const clientIPAddress = socket.handshake.address;
    console.log(`New user connected from IP address: ${clientIPAddress}`);
    
    // Increment the user count
    userCount++;
    io.emit('update-user-count', userCount);

    // Handle setting the username
    socket.on('set-username', (username) => {
        activeUsers[socket.id] = { username, ip: clientIPAddress };
        io.emit('update-user-list', Object.values(activeUsers));
    });

    // Handle user messages
    socket.on("user-msg", (message) => {
        const returnMessage = [message[0], message[1]];
        io.emit("message", returnMessage);
    });

    // Handle user disconnection
    socket.on("disconnect", () => {
        // Decrement the user count
        userCount--;
        io.emit("update-user-count", userCount);
        console.log(`User ${activeUsers[socket.id]?.username || 'unknown'} disconnected`);
        
        // Remove the user from the active users list
        delete activeUsers[socket.id];
        io.emit('update-user-list', Object.values(activeUsers));
    });
});

server.listen(9000, () => {
    console.log(`Server started at port 9000`);
});
