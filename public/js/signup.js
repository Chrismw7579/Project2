/* eslint-disable linebreak-style */
/* eslint-disable no-unused-vars */
/* eslint-disable linebreak-style */
/* eslint-disable no-undef */
/* eslint-disable quotes */
$(document).ready(function() {
	// Getting references to our form and input
	var signUpForm = $("form.signup");
	var emailInput = $("input#email-input");
	var passwordInput = $("input#password-input");
	var userNameInput = $("input#username-input");
	var cityInput = $("input#city-input");
	var interestInput = $("input#interest-input");
	var aboutMeInput = $("#about-input");

	// When the signup button is clicked, we validate the email and password are not blank
	signUpForm.on("submit", function(event) {
		event.preventDefault();
		var userData = {
			email: emailInput.val().trim(),
			password: passwordInput.val().trim(),
			username: userNameInput.val().trim(),
			location: cityInput.val().trim(),
			interest: interestInput.val().trim(),
			aboutMe: aboutMeInput.val().trim(),
			available: 1
		};

		if (!userData.email || !userData.password) {
			return;
		}
		// If we have an email and password, run the signUpUser function
		signUpUser(userData.email, userData.password, userData.username, userData.location, userData.interest, userData.aboutMe, userData.available);
		emailInput.val("");
		passwordInput.val("");
	});

	// Does a post to the signup route. If successful, we are redirected to the members page
	// Otherwise we log any errors
	function signUpUser(email, password, userName, location, interest, aboutMe, available) {
		console.log(email + " " + password + " " + userName + " " + location + " " + interest + " " + aboutMe + " " + available);
		$.post("/api/signup", {
			email: email,
			password: password,
			username: userName,
			location: location,
			interest: interest,
			aboutMe: aboutMe,
			available: available
		})
			.then(function(data) {
				window.location.replace("/members");
				// If there's an error, handle it by throwing up a bootstrap alert
			})
			.catch(handleLoginErr);
	}

	function handleLoginErr(err) {
		$("#alert .msg").text(err.responseJSON);
		$("#alert").fadeIn(500);
	}
});
