
$(document).ready(function () {
  const socket = io('/');
  let currentUserEmail = $('#userInfo').attr('userEmail');
  let currentUserId = $('#userInfo').attr('userId');
  const pageOne = $('#firstPage');
  const pageTwo = $('#secondPage');
  const pageThree = $('#thirdPage');
  const pageDelete = $('#deletePage');
  const pageNoMatch = $('#noMatchPage');

  fetch('/api/availability')
    .then((data) => {
      return data.json();
    }).then((response) => {
      if (response) {
        document.getElementById('availabilitySwitch').checked = true;
      }
    })

  $('#availabilitySwitch').on("click", function () {

    let newAvailability = {
      available: document.getElementById('availabilitySwitch').checked ? 1 : 0
    }

    console.log(newAvailability);

    $.ajax({
      method: "PUT",
      url: "/api/availability",
      data: newAvailability
    })
      .then(function (data) {
        console.log(data);

        if (!newAvailability.available) {
          console.log(newAvailability);

          pageTwo.css('display', 'none');
          pageThree.css('display', 'initial');
          pageOne.css('display', 'none');
          pageNoMatch.css('display', 'none');
        }

        else {

          pageTwo.css('display', 'none');
          pageThree.css('display', 'none');
          pageOne.css('display', 'initial');
          pageNoMatch.css('display', 'none');
        }
      });
  });

  let userId;
  let userLocation;
  $.get("/api/user_data").then(function (data) {
    userId = data.id;
    userEmail = data.email;
    userLocation = data.location;
    $('#userInfo').attr('userId', userId);
    $('#userInfo').attr('userEmail', userEmail);
    currentUserEmail = $('#userInfo').attr('userEmail');
    currentUserId = $('#userInfo').attr('userId');
    $(".member-name").text(data.username);
    document.getElementById('availabilitySwitch').checked = data.available;
    if (data.available) {
      pageTwo.css('display', 'none');
      pageThree.css('display', 'none');
      pageOne.css('display', 'initial');
    }
    else {
      pageTwo.css('display', 'none');
      pageThree.css('display', 'initial');
      pageOne.css('display', 'none');
    }
  });

  //Hangout Button Event Listner
  $('#findPeopleBtn').on("click", function () {

    $.get("/api/others", {
      id: userId
    }).then(function (data) {

      console.log(data);

      pageOne.css("display", "none");
      pageTwo.css("display", "initial");

      //Get a string of shared interests from the incoming data

      function getInterests(arr) {
        let interestStr = [];
        for (let i = 0; i < arr.length; i++) {

          interestStr.push(arr[i][0]);
        }
        return interestStr.toString();
      }


      // $('#connect-btn-0').attr('data-id', '32');
      //console.log($('#connect-btn-0').attr('data-id'));

      if (data.length === 0) {
        pageTwo.css('display', 'none');
        pageNoMatch.css('display', 'initial');
      }

      for (let i = 0; i < data.length; i++) {

        $(`#card-id-${i}`).css('display', 'block');
        $(`#username${i}`).text(data[i].username);
        $(`#sharedInterests${i}`).text(getInterests(data[i].list));
        $(`#aboutMe${i}`).text(data[i].aboutMe);
        //Setting data attributes for the 'connect' button to be accessed by chat functionality
        $(`#connect-btn-${i}`).attr('data-id', data[i].id);
        $(`#connect-btn-${i}`).attr('data-username', data[i].username);
      }

      showMap(userLocation);
    });

  });


  // =============================================================================================

  const messageContainer = document.getElementById('message-container');
  const messageForm = document.getElementById('send-container');
  const messageInput = document.getElementById('message-input');
  const currentlyMessaging = document.getElementById('talkingTo');
  let currentUserRoom;

  $('.connect-btn').on("click", function (e) {
    let otherUserId = ($(this).attr('data-id'));
    currentlyMessaging.textContent = "Talking to " + $(this).attr('data-username');
    e.preventDefault();
    fetch(`/api/find-room/${currentUserId}/${otherUserId}`)
      .then(response => response.json())
      .then((data) => {
        currentUserRoom = data.id;
        joinRoom(data.id);
        reloadOldData(currentUserRoom, '');
      });

  });

  function joinRoom(roomId) {
    // this function will take the room id and emit a 'join' message down the socket to the listener in the server
    socket.emit('join-room', roomId);
    console.log(`joining room ${roomId}`);
  }

  socket.on('chat-message', data => {
    appendMessage(`${data.name}: ${data.message}`);
  });

  messageForm.addEventListener('submit', e => {
    e.preventDefault();
    if (messageInput.value != '') {
      reloadOldData(currentUserRoom, messageInput.value);
    }
  });

  function reloadOldData(roomId, newMessage) {
    // this function will make a request to the server to get the rooms stored chat messages
    messageContainer.innerHTML = "";
    fetch(`/members/chatrooms/room/${roomId}/oldData`)
      .then((data) => {
        return data.json();
      }).then((response) => {
        response.forEach(element => {
          let userName = element.name;
          if (userName == currentUserEmail) { userName = 'You'; }
          appendMessage(`${userName}: ${element.data}`);
        });
      }).then(() => {
        if (newMessage != '') {
          appendMessage(`You: ${newMessage}`);
          socket.emit('send-chat-message', currentUserRoom, currentUserEmail, newMessage);
          messageInput.value = '';
        }
      });
  }

  function appendMessage(message) {
    const messageElement = document.createElement('div');
    messageElement.innerText = message;
    messageContainer.append(messageElement);
  }

  // =============================================================================================

  function showMap(userLocation) {

    var map;
    var service;
    var infowindow;

    let location = userLocation;

    function geocode(location) {
      //let cityInput = $("#city-input").val().trim();
      let cityInput = "Redmond";

      let geocodeURL = `https://us1.locationiq.com/v1/search.php?key=94f01861555da1&q=${location},Washington,USA&format=json`
      $.ajax({
        url: geocodeURL,
        method: "GET"
      })
        .then(function (response) {
          let searchLatString = response[0].lat;
          let searchLonString = response[0].lon;
          let searchLat = parseFloat(searchLatString).toFixed(3);
          let searchLon = parseFloat(searchLonString).toFixed(3);
          console.log(response);
          initialize(searchLat, searchLon);

        });

    }

    function initialize(lat, lon) {
      var pyrmont = new google.maps.LatLng(lat, lon);

      map = new google.maps.Map(document.getElementById('map'), {
        center: pyrmont,
        zoom: 15,
        gestureHandling: 'greedy'
      });


      var request = {
        query: 'cafe',
        location: pyrmont,
        radius: '1000',
      };


      service = new google.maps.places.PlacesService(map);
      service.textSearch(request, callback);
    }


    function callback(results, status) {
      if (status == google.maps.places.PlacesServiceStatus.OK) {
        for (var i = 0; i < results.length; i++) {
          var place = results[i];
          let marker = createMarker(results[i].geometry.location);
          //console.log(results);

          marker.addListener('click', function () {
            map.setZoom(13);
            map.setCenter(marker.getPosition());

          });

        }
      }
    }


    var createMarker = function (latLon) {
      console.log("HIT HERE")
      marker = new google.maps.Marker({
        position: latLon,
        map: map,
        title: 'cafe'
      })
      return marker;

    }
    geocode(location);
  }


  //event listener for deleting account


  $('#delete-account').on('click', function (e) {

    e.preventDefault();
    pageOne.css('display', 'none');
    pageTwo.css('display', 'none');
    pageThree.css('display', 'none');
    pageNoMatch.css('display', 'none');
    pageDelete.css('display', 'block');

    $('#deletebtn').on('click', function () {
      $.ajax({
        method: 'DELETE',
        url: `/api/users/${userId}`
      })
        .then(function (data) {
          console.log(data);
        });
    });


  });

  $(".dropdown-trigger").dropdown({
    coverTrigger: false
  });

});//End of document.ready