
/* eslint-disable linebreak-style */
/* eslint-disable no-mixed-spaces-and-tabs */
/* eslint-disable linebreak-style */
/* eslint-disable quotes */
/* eslint-disable no-undef */
// Requiring necessary npm packages
var express = require("express");
var session = require("express-session");
var app = express();

// this creates the socket.io server needed for live chatting
const server = require('http').Server(app);
const io = require('socket.io')(server);


// Requiring passport as we've configured it
var passport = require("./config/passport");

// Setting up port and requiring models for syncing
var PORT = process.env.PORT || 8080;
var db = require("./models");

// Creating express app and configuring middleware needed for authentication

app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(express.static("public"));


// We need to use sessions to keep track of our user's login status
app.use(session({ secret: "keyboard cat", resave: true, saveUninitialized: true }));
app.use(passport.initialize());
app.use(passport.session());

// Requiring our routes
require("./routes/html-routes.js")(app);
require("./routes/api-routes.js")(app);

// Syncing our database and logging a message to the user upon success

db.sequelize.sync().then(function () {
  server.listen(PORT, function () {
    console.log("==> 🌎  Listening on port %s. Visit http://localhost:%s/ in your browser.", PORT, PORT);
  });
});


// ==================================================================
// this code is all for handling user live chat features using socket.io

io.on('connection', socket => {
  console.log('new web socket opened');
  socket.on('join-room', (roomid) => {
    console.log('user joined room');
    socket.join(roomid);
  });
  socket.on('send-chat-message', (room, userName, message) => {
    console.log('new message recieved');
    socket.to(room).broadcast.emit('chat-message', { message: message, name: userName });
    db.Room.findAll(
      {
        where: {
          id: room
        }
      }
    ).then((foundRoom) => {
      return foundRoom[0];
    }).then((room) => {

      db.Message.findAll(
        {
          where: {
            RoomId: room.id
          }
        }
      ).then((data) => {
        let newData = data.map(message => message.dataValues);

        if(newData.length > 19) {
          let messageId = newData[0].id;
          db.Message.destroy(
            {
              where: {
                id: messageId
              }
            }
          );
        }
      })

      db.Message.create(
        {
          name: userName,
          data: message,
          RoomId: room.id
        }
      );
    });

  });
});

