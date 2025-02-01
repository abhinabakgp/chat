const socket = io("http://localhost:3000"); // Connect to server

const chatBox = document.getElementById("chat-box");
const messageInput = document.getElementById("message");

// Send Message
function sendMessage() {
    const message = messageInput.value.trim();
    if (message) {
        socket.emit("chat message", message);
        messageInput.value = "";
    }
}

// Receive Message
socket.on("chat message", (msg) => {
    const messageDiv = document.createElement("div");
    messageDiv.textContent = msg;
    chatBox.appendChild(messageDiv);
    chatBox.scrollTop = chatBox.scrollHeight; // Auto-scroll
});
