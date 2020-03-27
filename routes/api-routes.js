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
					res.send(newRes);
				} else {
					console.log('making a new room');
					makeNewRoom(req.params.id1, req.params.id2)
						.then((response) => {
							let newRes = {
								id: response.room,
								action: response.value
							};
							res.send(newRes);
						});
				}
			});
	});
	app.get('/members/chatrooms/room/:roomid/oldData', (req, res) => {
		// this path sends the chat room html page
		if (!req.user) {
			res.redirect('/members');
		}
		let room = req.params.roomid;
		db.Message.findAll({
			where: {
				RoomId: room
			}
		}).then((messages) => {
			res.json(messages);
		});
	});
	function checkRoom(id1, id2) {
		return new Promise((resolve, reject) => {
			db.Room.findAll()
				.then((response) => {
					for (let i = 0; i < response.length; i++) {
						if ((response[i].guest == id2 && response[i].UserId == id1) || (response[i].guest == id1 && response[i].UserId == id2)) {
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

				//console.log("HIT!!");
				//console.log(data.dataValues.id);
				//console.log("END!!")
				//console.log(username + " " + location + " " + interest + " " + aboutMe + " " + available)
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
			db.Info.findOne({
				where: {
					UserId: req.user.id
				}
			}).then(function (results) {
				//console.log(results);
				res.json({
					email: req.user.email,
					id: req.user.id,
					username: results.dataValues.username,
					location: results.dataValues.location,
					interest: results.dataValues.interest,
					aboutMe: results.dataValues.aboutMe,
					available: results.available
				});

			})

		}
	});


	// Route for returning to the user other members with the most common interests

	app.get("/api/others", (req, res) => {
		// Finds the users location
		let interests = '';
		db.Info.findOne({
			where: {

				UserId: req.user.id
			}
		}).then((data) => {
			console.log(data);

			// Querys server for all members with same location
			interests = data.dataValues.interest;
			

			db.Info.findAll({
				where: {
					location: data.dataValues.location
				}
			}).then(data => {
				res.json(sortByInterest(req.user.id, interests, data));
			});

		}).catch(function(err){
			console.log(err);

		});
	});

	// Parses the raw data and returns a list of objects with id, name, location, about info,
	// and the list of common interests as parameters.
	const sortByInterest = (id, interests, data) => {
		console.log('sortby');
		const compatibilityList = [];

		const UserInterests = interests.split(',');
		//console.log("data");
		let OthersInterests = [];

		//console.log(data.length);
		for (let i = 0; i < data.length; i++) {

			if (id != data[i].dataValues.UserId && data[i].dataValues.available == 1) { // excludes the user from the list
				
				const obj = {
					id: data[i].dataValues.id,
					username: data[i].dataValues.username,
					location: data[i].location,
					aboutMe: data[i].aboutMe,
					list: []
				};

				OthersInterests = data[i].dataValues.interest.split(',');
				obj.list = sort(UserInterests, OthersInterests);
				compatibilityList.push(obj);
			}
		}
		//console.log(compatibilityList);

		return(findMostCompatible(5, compatibilityList));

	};

	// Takes a count for the number of objects to return and a list of objects that 
	// each contain the common interests of each member then Sorts the members
	// by the number of common interests and returns a list of objects.
	const findMostCompatible = (count, list) => {
		//console.log('find');
		const compatibilityList = [];
		const tempList = [...list];
		let listCount = 0;


		while (listCount < count && tempList.length > 0) {
			let index = 0;
			let mostInCommon = tempList[index];
			for (let i = 0; i < tempList.length - 1; i++) {

				if (mostInCommon.list.length < tempList[i + 1].list.length) {
					mostInCommon = tempList[i + 1];
					index = i + 1;

				}
			}


			tempList.splice(index, 1);
			compatibilityList.push(mostInCommon);
			listCount++;
		}
		// console.log(compatibilityList);

		return (compatibilityList);

	};

	// Takes two lists of interests as parameters and returns a list with common interests
	const sort = (first, last) => {
		let count = 0;
		let list = [];
		for (let i = 0; i < first.length; i++) {
			for (let j = 0; j < last.length; j++) {
				if (first[i] === last[j]) {
					list[count] = [first[i]];
					count++;
				}
			}

		}
		return (list);
	};

	app.put("/api/availability", (req, res) => {

		console.log("route Hit")
		db.Info.update(
			req.body,
			{

			  where: {
				UserId: req.user.id
			  }
			}).then(function(dbPost) {
			res.json(dbPost);
		  });

	});

	app.delete('/api/users/:id', (req, res) => {
		console.log("ID " + req.params.id);
		db.User.destroy({

			where: {
				id: req.params.id
			}
		}).then(function () {
			console.log(req.body);
			console.log('Deletion successful');
			res.redirect('/');
		});
	});

	app.get('/api/availability', (req, res) => {
		db.Info.findOne({
			where: {
				UserId: req.user.id
			}
		}).then((data) => {
			res.json(data.available);

		});
	});
};
