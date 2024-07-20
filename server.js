const express = require("express");
const path = require("path");

const app = express();
const server = require("http").createServer(app);

const io = require("socket.io")(server);

app.use(express.static(path.join(__dirname, "/public")));

io.on("connection", function (socket) {
    socket.on("joinRoom", function (data) {
        socket.join(data.room);
        socket.room = data.room;
        socket.username = data.username;
        socket.broadcast.to(data.room).emit("update", `${data.username} joined the room.`);
    });

    socket.on("newuser", function (data) {
        socket.join(data.room);
        socket.room = data.room;
        socket.username = data.username;
        socket.broadcast.to(data.room).emit("update", `${data.username} joined the conversation`);
    });

    socket.on("exituser", function (username) {
        socket.broadcast.to(socket.room).emit("update", `${username} left the conversation`);
        socket.leave(socket.room);
    });

    socket.on("chat", function (message) {
        socket.broadcast.to(socket.room).emit("chat", message);
    });
});

server.listen(5000, () => {
    console.log("Server is running on port 5000");
});
