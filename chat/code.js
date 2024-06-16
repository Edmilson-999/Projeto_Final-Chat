window.onload = () => {
    const joinScreen = document.querySelector('.join-screen');
    const chatScreen = document.querySelector('.chat-screen');
    const joinUser = document.getElementById('join-user');
    const sendMessage = document.getElementById('send-message');
    const exitChat = document.getElementById('exit-chat');
    const messageInput = document.getElementById('message-input');
    const messagesContainer = document.querySelector('.messages');
    let socket = io('http://localhost:5000'); // Conexão ao servidor na porta 5000
    let username = '';

    joinUser.addEventListener('click', () => {
        username = document.getElementById('username').value;
        if (username.length == 0) {
            return;
        }
        socket.emit('newuser', username);
        joinScreen.classList.remove('active');
        chatScreen.classList.add('active');
    });

    exitChat.addEventListener('click', () => {
        socket.emit('exituser', username);
        chatScreen.classList.remove('active');
        joinScreen.classList.add('active');
        socket.disconnect();
    });

    sendMessage.addEventListener('click', () => {
        let message = messageInput.value;
        if (message.length == 0) {
            return;
        }
        renderMessage('my', {
            username: username,
            text: message
        });
        socket.emit('chat', {
            username: username,
            text: message
        });
        messageInput.value = '';
    });

    socket.on('update', (message) => {
        renderMessage('update', message);
    });

    socket.on('chat', (message) => {
        renderMessage('other', message);
    });

    function renderMessage(type, message) {
        let messageElement = document.createElement('div');
        messageElement.classList.add('message', `${type}-message`);
        if (type === 'my') {
            messageElement.innerHTML = `<div><div class="name">Eu</div><div class="text">${message.text}</div></div>`;
        } else if (type === 'other') {
            messageElement.innerHTML = `<div><div class="name">${message.username}</div><div class="text">${message.text}</div></div>`;
        } else if (type === 'update') {
            messageElement.classList.remove('message');
            messageElement.classList.add('update');
            messageElement.innerText = message;
        }
        messagesContainer.appendChild(messageElement);
        messagesContainer.scrollTop = messagesContainer.scrollHeight;
    }
};
