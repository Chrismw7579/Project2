$(document).ready(function() {
const pageOne = $('#firstPage');
const pageTwo = $('#secondPage');
const pageThree = $('#thirdPage');
  $('#availabilitySwitch').on("click",function(){
    console.log(document.getElementById('availabilitySwitch').checked);

    if($('#availabilitySwitch').checked==true){
      console.log("I am being clicked");
      var newStatus={
        available:1
      }
      updateToggle(newStatus.available)  

    }
    else{
      console.log("I am being clicked");
      var newStatus={
        available:0
      }
      updateToggle(newStatus.available)
  
    }
   
  })

  function updateToggle(available){
		$.get('/api/toggle',{
			available:available
		}).then(function(data){
			console.log("status sent to api-routes is:",data);
    });
  }


 
  let userId;
  let userLocation;
  $.get("/api/user_data").then(function(data) {
    userId = data.id;
    userLocation = data.location;
    console.log(userId);
    $(".member-name").text(data.username);
    document.getElementById('availabilitySwitch').checked = data.available;
  });

  //Hangout Button Event Listner
  $('#findPeopleBtn').on("click", function(){

    $.get("/api/others", {
      id: userId
    }).then(function(data){
      console.log(data);

      pageOne.css("display", "none");
      pageTwo.css("display", "initial");

      showMap(userLocation);
    });

  });

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




















//Code to generate cards; must be added in a event listener function

  // for(let i=0; i<5; i++){
  //   let icon1 = $("<i>");
  //   icon1.attr("class", "material-icons right");
  //   icon1.text("more_vert");

  //   let sp1 = $("<span>");
  //   sp1.attr("class", "card-title activator grey-text text-darken-4");
  //   sp1.text("Mark Fischer");

  //   let anchor = $("<a>");
  //   anchor.attr("class", "waves-effect waves-light btn btn-small indigo lighten-2");
  //   anchor.text("CONNECT");

  //   let pTag1 = $("<p>");

  //   let divCardContent = $("<div>");
  //   divCardContent.attr("class", "card-content");

  //   sp1.append(icon1);
  //   pTag1.append(anchor);
  //   divCardContent.append(sp1);
  //   divCardContent.append(pTag1);


  //   let icon2 = $("<i>");
  //   icon2.attr("class", "material-icons right");
  //   icon2.text("close");

  //   let sp2 = $("<span>");
  //   sp2.attr("class", "card-title grey-text text-darken-4")
  //   sp2.text("Card Title");

  //   let pTag2 = $("<p>");
  //   pTag2.text("Here is some more information about this product that is only revealed once clicked on.");

  //   let divCardReveal = $("<div>");
  //   divCardReveal.attr("class", "card-reveal");

  //   sp2.append(icon2);
  //   divCardReveal.append(sp2);
  //   divCardReveal.append(pTag2);

  //   let divCard = $("<div>");
  //   divCard.attr("class", "card-content");
  //   divCard.append(divCardContent);
  //   divCard.append(divCardReveal);

  //   $("#cardsHolderDiv").append(divCard);

  // }