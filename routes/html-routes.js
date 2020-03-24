/* eslint-disable linebreak-style */
/* eslint-disable indent */
/* eslint-disable no-undef */
// Requiring path to so we can use relative routes to our HTML files
var path = require('path');

// Requiring our custom middleware for checking if a user is logged in
var isAuthenticated = require('../config/middleware/isAuthenticated');

module.exports = function (app) {

  app.get('/', function (req, res) {
    // If the user already has an account send them to the members page
    if (req.user) {
      res.redirect('/members');
    }
    res.sendFile(path.join(__dirname, '../public/signup.html'));
  });

  // ==========================================================================
  app.get('/members/chatrooms', function (req, res) {
    // this path sends the base chatroom navigation file
    if (!req.user) {
      res.redirect('/members');
    }
    res.send(getChatrooms(req.user.id));
  });

  app.get('/members/chatrooms/room/:roomid', (req, res) => {
    // this path sends the chat room html page
    if (!req.user) {
      res.redirect('/members');
    }
    res.send(getRooms(req.user, req.params.roomid, req.params.action));
  });
  // ==========================================================================
  app.get('/login', function (req, res) {
    // If the user already has an account send them to the members page
    if (req.user) {
      res.redirect('/members');
    }
    res.sendFile(path.join(__dirname, '../public/login.html'));
  });

  // Here we've add our isAuthenticated middleware to this route.
  // If a user who is not logged in tries to access this route they will be redirected to the signup page
  app.get('/members', isAuthenticated, function (req, res) {
    res.sendFile(path.join(__dirname, '../public/members.html'));
  });


  function getChatrooms(id) {
    let template = `<!DOCTYPE html>
		<html lang="en">
		
		<head>
			<meta charset="UTF-8">
			<meta name="viewport" content="width=device-width, initial-scale=1.0">
			<meta http-equiv="X-UA-Compatible" content="ie=edge">
			<title>Chat App</title>
			<link rel="stylesheet" href="/stylesheets/live_chat.css">
		</head>
		
		<body>
	
			<div id="myid" value="${id}"></div>
		
			<div id="users-container">
				<!-- all the users found by the server will go here -->
			</div>
		
			<script src="/socket.io/socket.io.js"></script>
			<script src="https://ajax.googleapis.com/ajax/libs/jquery/3.4.1/jquery.min.js"></script>
			<script src="/js/chatrooms.js"></script>
		</body>
		
		</html>`;
    return template;
  }

  function getRooms(id, room, action) {
    let template = `<!DOCTYPE html>
		<html lang="en">
		
		<head>
			<meta charset="UTF-8">
			<meta name="viewport" content="width=device-width, initial-scale=1.0">
			<meta http-equiv="X-UA-Compatible" content="ie=edge">
			<title>Private Room</title>
			<link rel="stylesheet" href="/stylesheets/live_chat.css">
		</head>
		
    <body>
      <div id="myid" value="${id.id}" name="${id.email}" room="${room}" action="${action}"></div>
			<div id="message-container"></div>
			<form id="send-container">
				<input type="text" id="message-input">
				<button type="submit" id="send-button">Send</button>
			</form>
		
			<script src="/socket.io/socket.io.js"></script>
			<script src="https://ajax.googleapis.com/ajax/libs/jquery/3.4.1/jquery.min.js"></script>
			<script src="/js/room.js"></script>
		</body>
		
		</html>`;
    return template;
  }
};
