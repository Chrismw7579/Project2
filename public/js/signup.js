$(document).ready(function() {
  // Getting references to our form and input
  var signUpForm = $("form.signup");
  var emailInput = $("input#email-input");
  var passwordInput = $("input#password-input");
  var userNameInput = $("input#username-input");
  var cityInput = $("input#city-input")
  var interestInput = $("input#interest-input");
  var aboutMeInput = $("#about-input");

  let cityNameInput = "";

  populateLocationDropdown();
  $('.dropdown-toggle').dropdown();

// Get the selected location from dropdown

    $(".dropdown-item").on("click", function(){
      cityNameInput = $(this)[0].text;
      console.log(cityNameInput);

      $('#displaySelectedLocation').text(cityNameInput);

  });

 // When the signup button is clicked, we validate the email and password are not blank
  signUpForm.on("submit", function(event) {
    event.preventDefault();
    let selectedInterests = [];

    $('#checkboxes input:checked').each(function() {
        selectedInterests.push($(this).attr('name'));
    });

    var userData = {
      email: emailInput.val().trim(),
      password: passwordInput.val().trim(),
      username: userNameInput.val().trim(),
      location: cityNameInput.trim(),
      interest: selectedInterests.toString(),
      aboutMe: aboutMeInput.val().trim(),
      available: 1
    };

    // Make sure all the fields have some data
    if (!userData.email || !userData.password || !userData.username || !userData.location || !userData.interest || !userData.aboutMe) {
      handleLoginErr("Fields cannot be blank");
      return;
    }
    //Verify the min requirements for e-mail format
    if(!(/.+@.+\..+/gi.test(userData.email))){
      handleLoginErr("Please verify your email. The format doesn't look right!");
      return;
    }
    // If we have an email and password, run the signUpUser function

    console.log(userData.email + " " + userData.password + " " + userData.username + " " + userData.location + " " + userData.interest + " " + userData.aboutMe + " " + userData.available);

    signUpUser(userData.email, userData.password, userData.username, userData.location, userData.interest, userData.aboutMe, userData.available);
    emailInput.val("");
    passwordInput.val("");
  });

  // Does a post to the signup route. If successful, we are redirected to the members page
  // Otherwise we log any errors
  function signUpUser(email, password, userName, location, interest, aboutMe, available) {
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
      .catch(function(err){
        if(err.responseJSON.name === "SequelizeUniqueConstraintError"){
          handleLoginErr("E-mail already exists");
        }
        else{
          handleLoginErr("Something went wrong. Please try later!");
        }
      });
  }

  function handleLoginErr(err) {
    console.log("Hit in catch part");

    $("#alert .msg").text(err);//.responseJSON
    $("#alert").fadeIn(500);
  }

  function populateLocationDropdown(){
    for(i=0; i<cityNames.length; i++){
      let anchorItem = $("<a>");
      anchorItem.attr("class", "dropdown-item");
      anchorItem.text(cityNames[i]);

      let listItem = $("<li>");
      listItem.append(anchorItem);
     
      $(".dropdown-menu").append(listItem);
    }
  }
});



