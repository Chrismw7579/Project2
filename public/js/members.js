$(document).ready(function() {
const pageOne = $('#firstPage');
const pageTwo = $('#secondPage');
const pageThree = $('#thirdPage');

  $('#availabilitySwitch').on("click",function(){
    
      let newAvailability = {
        available : document.getElementById('availabilitySwitch').checked ? 1 : 0
      }

      console.log(newAvailability);

      $.ajax({
        method: "PUT",
        url: "/api/availability",
        data: newAvailability
      })
        .then(function(data) {
          console.log(data);

        if(!newAvailability.available){
          pageTwo.css('display', 'none');
          pageThree.css('display', 'initial');
          pageOne.css('display', 'none');
        }
        else{
          pageTwo.css('display', 'none');
          pageThree.css('display', 'none');
          pageOne.css('display', 'initial');
        }
      });
  });
 
  let userId;
  let userLocation;
  $.get("/api/user_data").then(function(data) {
    userId = data.id;
    userLocation = data.location;
    console.log(userId);
    $(".member-name").text(data.username);
    document.getElementById('availabilitySwitch').checked = data.available;
      if(data.available){
        pageTwo.css('display', 'none');
        pageThree.css('display', 'none');
        pageOne.css('display', 'initial');
      }
      else{
        pageTwo.css('display', 'none');
        pageThree.css('display', 'initial');
        pageOne.css('display', 'none');
      }
  });

  //Hangout Button Event Listner
  $('#findPeopleBtn').on("click", function(){

    $.get("/api/others", {
      id: userId
    }).then(function(data){
      console.log(data);

      pageOne.css("display", "none");
      pageTwo.css("display", "initial");

      //Get a string of shared interests from the incoming data
      function getInterests(arr){
        let interestStr = [];
        for(let i=0; i<arr.length; i++){
          interestStr.push(arr[i][0]);
        }
        return interestStr.toString();
      }

     // $('#connect-btn-0').attr('data-id', '32');
     //console.log($('#connect-btn-0').attr('data-id'));

      for(let i=0; i<data.length; i++){
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

  $('.connect-btn').on("click", function(){
      console.log("start")
      console.log($(this).attr('data-id'));
      console.log($(this).data('id'));
      console.log($(this).attr('data-username'));
      console.log($(this).data('username'));
      console.log('end');
  })

  function showMap(userLocation){
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
          marker.addListener('click', function() {
                map.setZoom(13);
                map.setCenter(marker.getPosition());
          });

        }
      }
    }

    var createMarker = function(latLon){
        console.log("HIT HERE")
        marker = new google.maps.Marker({
            position: latLon,
            map : map,
            title: 'cafe'
        })
        return marker;
    }
    geocode(location);
  }

});//End of document.ready