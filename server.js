/* eslint-disable no-undef */
const express = require('express');
const app = express();
const http = require('http').createServer(app);
const io = require('socket.io')(http);




















// =============================================
// send files to client
app.get('/', function (req, res) {
	res.sendFile(__dirname + '/html/live_chat.html');
});
app.use(express.static('public'));
// ==============================================

//handles all client responses
io.on('connection', function (socket) {
	//identifies new user
	console.log('New User');
	socket.emit('chat-message', 'Welcome!');
	//client responses
	socket.on('send-chat-message', (data) => {
		socket.broadcast.emit('new-message', data);
	});
});
//confirms server is listening on the right port
http.listen(3000, function () {
	console.log('listening on *:3000');
});