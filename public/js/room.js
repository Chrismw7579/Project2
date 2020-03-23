/* eslint-disable no-unused-vars */
/* eslint-disable no-undef */
const socket = io('/');

// THIS IS ALL THE WEBSOCKET HANDLING CODE
const messageContainer = document.getElementById('message-container');
const messageForm = document.getElementById('send-container');
const messageInput = document.getElementById('message-input');

const currentUser = document.getElementById('myid');
const currentUserId = currentUser.getAttribute('value');
const currentUserEmail = currentUser.getAttribute('name');
const currentRoom = currentUser.getAttribute('room');
const currentAction = currentUser.getAttribute('action');

messageForm.addEventListener('submit', e => {
	e.preventDefault();
	const message = messageInput.value;
	appendMessage(`You: ${message}`);
	socket.emit('send-chat-message', currentRoom, currentUserEmail, message);
	messageInput.value = '';
});

socket.on('chat-message', data => {
	appendMessage(`${data.name}: ${data.message}`);
});

function joinRoom(roomId) {
	socket.emit('join-room', roomId);
	console.log(`joining room: ${roomId}`);
}

function reloadOldData(roomId) {
	// this function will make a request to the server to get the rooms stored chat messages
}

function appendMessage(message) {
	const messageElement = document.createElement('div');
	messageElement.innerText = message;
	messageContainer.append(messageElement);
}

function init() {
	// this function will connect to the private room and if it was an existing room, then repopulate the client with the old messages of the chat
	joinRoom(currentRoom);
}

init();