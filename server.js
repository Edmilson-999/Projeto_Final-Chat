const express = require("express");
const path = require("path");

const app = express();
const server = require("http").createServer(app);
const io = require("socket.io")(server);

// Servir arquivos estáticos da pasta 'chat'
app.use(express.static(path.join(__dirname, "chat")));

// Evento de conexão
io.on("connection", function(socket) {
    console.log("Um usuário conectou-se");

    // Novo usuário entrou
    socket.on("newuser", function(username) {
        console.log(`${username} juntou-se à conversa`);
        socket.broadcast.emit("update", `${username} juntou-se à conversa`);
    });

    // Usuário saiu
    socket.on("exituser", function(username) {
        console.log(`${username} saiu da conversa`);
        socket.broadcast.emit("update", `${username} saiu da conversa`);
    });

    // Nova mensagem de chat
    socket.on("chat", function(message) {
        console.log("Nova mensagem recebida:", message);
        socket.broadcast.emit("chat", message);
    });

    // Evento de desconexão
    socket.on("disconnect", () => {
        console.log("Um usuário desconectou-se");
    });
});

// Iniciar o servidor na porta 5000
server.listen(5000, () => {
    console.log("Servidor rodando na porta 5000");
});
