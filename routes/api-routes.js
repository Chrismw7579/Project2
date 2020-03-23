/* eslint-disable linebreak-style */
/* eslint-disable no-undef */
/* eslint-disable quotes */
/* eslint-disable linebreak-style */
// Requiring our models and passport as we've configured it
var db = require("../models");
var passport = require("../config/passport");

module.exports = function (app) {

	// =====================================================================
	app.get('/api/find-room/:id1/:id2', (req, res) => {
		checkRoom(req.params.id1, req.params.id2)
			.then((response) => {
				if (response.value) {
					console.log('found existing room');
					let newRes = {
						id: response.room,
						action: response.value
					};
					console.log(newRes);
					res.send(newRes);
				} else {
					console.log('making a new room');
					makeNewRoom(req.params.id1, req.params.id2)
						.then((response) => {
							let newRes = {
								id: response.room,
								action: response.value
							};
							console.log(newRes);
							res.send(newRes);
						});
				}
			});
	});
	function checkRoom(id1, id2) {
		return new Promise((resolve, reject) => {
			db.Room.findAll()
				.then((response) => {
					for (let i = 0; i < response.length; i++) {
						console.log((response[i].guest == id2 && response[i].UserId == id1));
						console.log((response[i].guest == id1 && response[i].UserId == id2));
						if ( (response[i].guest == id2 && response[i].UserId == id1) || (response[i].guest == id1 && response[i].UserId == id2)) {
							resolve({
								value: true,
								room: response[i].id
							});
						}
					}
					resolve({ value: false });
				}).catch((err) => {
					reject(err);
				});
		});
	}
	function makeNewRoom(user1, user2) {
		return new Promise((resolve, reject) => {
			db.Room.create({
				guest: user2,
				data: '',
				UserId: user1,
			}).then((newModel) => {
				console.log('new room created in the database');
				resolve({
					room: newModel.id,
					value: false
				});
			}).catch((err) => {
				reject(err);
			});
		});
	}
	function updateRoomData(newMessage) {
		// this function will be used to add new chat messages to the rooms internal storage
	}
	function getRoomData(roomid) {
		// gets the past message data from a room and sends it back to the user
	}
	// =====================================================================

	// Using the passport.authenticate middleware with our local strategy.
	// If the user has valid login credentials, send them to the members page.
	// Otherwise the user will be sent an error
	app.post("/api/login", passport.authenticate("local"), function (req, res) {
		res.json(req.user);
	});

	// Route for signing up a user. The user's password is automatically hashed and stored securely thanks to
	// how we configured our Sequelize User Model. If the user is created successfully, proceed to log the user in,
	// otherwise send back an error
	app.post("/api/signup", function (req, res) {
		let username = req.body.username;
		let location = req.body.location;
		let interest = req.body.interest;
		let aboutMe = req.body.aboutMe;
		let available = req.body.available;

		db.User.create({
			email: req.body.email,
			password: req.body.password
		})
			.then(function (data) {

				console.log("HIT!!");
				console.log(data.dataValues.id);
				console.log("END!!");
				console.log(username + " " + location + " " + interest + " " + aboutMe + " " + available);
				db.Info.create({
					username: username,
					location: location,
					interest: interest,
					aboutMe: aboutMe,
					available: available,
					UserId: data.dataValues.id
				}).then(function () {
					res.redirect(307, "/api/login");
				}).catch(function (err) {
					console.log(err);
					res.status(401).json(err);
				});
			})
			.catch(function (err) {
				res.status(401).json(err);
			});
	});

	// Route for logging user out
	app.get("/logout", function (req, res) {
		req.logout();
		res.redirect("/");
	});

	// Route for getting some data about our user to be used client side
	app.get("/api/user_data", function (req, res) {
		if (!req.user) {
			// The user is not logged in, send back an empty object
			res.json({});
		} else {
			// Otherwise send back the user's email and id
			// Sending back a password, even a hashed password, isn't a good idea
			res.json({
				email: req.user.email,
				id: req.user.id
			});
		}
	});

	app.get('/api/users', function (req, res) {
		db.User.findAll()
			.then((data) => {
				res.json(data);
			});
	});
};