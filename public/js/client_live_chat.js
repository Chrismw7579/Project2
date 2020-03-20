/* eslint-disable linebreak-style */
/* eslint-disable no-undef */
const socket = io();
const messageForm = document.getElementById('send-container');
const messageInput = document.getElementById('message-field');
const messageContainer = document.getElementById('message-container');

//gets users name with a prompt
let userName = prompt('username: ');
//sends message and username to server
messageForm.addEventListener('submit', e => {
	e.preventDefault();
	const text = messageInput.value;
	const message = {
		name: userName,
		message: text
	};
	socket.emit('send-chat-message', message);
	messageInput.value = '';
	appendMessage(text, userName);
});
//handle server console messages
socket.on('chat-message', data => {
	console.log(data);
});
//handle new messages
socket.on('new-message', data => {
	console.log('message-recieved');
	appendMessage(data.message, data.name);
});
//appends a message to the screen
const appendMessage = (message, name) => {
	const newDiv = document.createElement('div');
	const text = document.createElement('h1');
	text.textContent = `${name}: ${message}`;
	newDiv.setAttribute('id', 'message');
	newDiv.appendChild(text);
	messageContainer.prepend(newDiv);
};