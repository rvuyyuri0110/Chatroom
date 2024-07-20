(function () {
    const app = document.querySelector(".app");
    const socket = io();

    let uname;
    let room;

    // Event listener for creating a room
    app.querySelector("#create-room").addEventListener("click", function () {
        uname = app.querySelector("#username").value;
        if (uname.length === 0) {
            return;
        }
        room = Math.floor(100000 + Math.random() * 900000).toString();
        socket.emit("joinRoom", { username: uname, room: room });
        app.querySelector(".join-create-screen").classList.remove("active");
        app.querySelector(".chat-screen").classList.add("active");
        renderMessage("update", `Room created: ${room}`);
    });

    // Event listener to show join room input
    app.querySelector("#join-room-btn").addEventListener("click", function () {
        app.querySelector(".join-room-input").style.display = "block";
    });

    // Event listener for joining a room
    app.querySelector("#join-room").addEventListener("click", function () {
        uname = app.querySelector("#username").value;
        room = app.querySelector("#room-code").value;
        if (uname.length === 0 || room.length === 0) {
            return;
        }
        socket.emit("joinRoom", { username: uname, room: room });
        app.querySelector(".join-create-screen").classList.remove("active");
        app.querySelector(".chat-screen").classList.add("active");
    });

    // Event listener for sending a message
    app.querySelector(".chat-screen #send-message").addEventListener("click", function () {
        sendMessage();
    });

    // Event listener for sending a message on Enter key press
    app.querySelector(".chat-screen #message-input").addEventListener("keypress", function (e) {
        if (e.key === "Enter") {
            sendMessage();
        }
    });

    // Event listener for exiting the chat
    app.querySelector(".chat-screen #exit-chat").addEventListener("click", function () {
        socket.emit("exituser", uname);
        window.location.href = window.location.href;
    });

    // Socket listener for update messages
    socket.on("update", function (update) {
        renderMessage("update", update);
    });

    // Socket listener for chat messages
    socket.on("chat", function (message) {
        renderMessage("other", message);
    });

    // Function to send a message
    function sendMessage() {
        let message = app.querySelector(".chat-screen #message-input").value;
        if (message.length === 0) {
            return;
        }
        renderMessage("my", {
            username: uname,
            text: message
        });
        socket.emit("chat", {
            username: uname,
            text: message
        });
        app.querySelector(".chat-screen #message-input").value = "";
    }

    // Function to render messages on the screen
    function renderMessage(type, message) {
        let messageContainer = app.querySelector(".chat-screen .messages");
        if (type === "my") {
            let el = document.createElement("div");
            el.setAttribute("class", "message my-message");
            el.innerHTML = `
                <div>
                    <div class="name">You</div>
                    <div class="text">${message.text}</div>
                </div>
            `;
            messageContainer.appendChild(el);
        } else if (type === "other") {
            let el = document.createElement("div");
            el.setAttribute("class", "message other-message");
            el.innerHTML = `
                <div>
                    <div class="name">${message.username}</div>
                    <div class="text">${message.text}</div>
                </div>
            `;
            messageContainer.appendChild(el);
        } else if (type === "update") {
            let el = document.createElement("div");
            el.setAttribute("class", "update");
            el.innerText = message;
            messageContainer.appendChild(el);
        }
        messageContainer.scrollTop = messageContainer.scrollHeight - messageContainer.clientHeight;
    }
})();
