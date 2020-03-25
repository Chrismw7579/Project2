$(document).ready(function() {

	const pageOne = $('#firstPage');

	const pageTwo = $('#secondPage');

	const pageThree = $('#thirdPage');

	const pageDelete = $('#deletePage');



	$('#availabilitySwitch').on('click',function(){

		console.log(document.getElementById('availabilitySwitch').checked);

	});

 

	let userId;

	let userLocation;

	$.get('/api/user_data').then(function(data) {

		userId = data.id;

		userLocation = data.location;

		console.log(userId);

		$('.member-name').text(data.username);

		document.getElementById('availabilitySwitch').checked = data.available;

	});



	//Hangout Button Event Listener

	$('#findPeopleBtn').on('click', function(){



		$.get('/api/others', {

			id: userId

		}).then(function(data){

			// console.log(data);



			pageOne.css('display', 'none');

			pageTwo.css('display', 'initial');



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

			let cityInput = 'Redmond';

			let geocodeURL = `https://us1.locationiq.com/v1/search.php?key=94f01861555da1&q=${location},Washington,USA&format=json`;

			$.ajax({

				url: geocodeURL,

				method: 'GET'

			})

				.then(function (response) {

					let searchLatString = response[0].lat;

					let searchLonString = response[0].lon;

					let searchLat = parseFloat(searchLatString).toFixed(3);

					let searchLon = parseFloat(searchLonString).toFixed(3);

					// console.log(response);

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

			// console.log('HIT HERE');

			marker = new google.maps.Marker({

				position: latLon,

				map : map,

				title: 'cafe'

			});

			return marker;

		};



		geocode(location);



	}





	//event listener for deleting account

	$('#delete-account').on('click', function(e){

		e.preventDefault();



		pageOne.css('display', 'none');

		pageTwo.css('display', 'none');

		pageThree.css('display', 'none');

		pageDelete.css('display', 'block');



		$('#deletebtn').on('click', function(){

			$.ajax({

				method: 'DELETE',

				url: `/api/users/${userId}`

			})

				.then(function(data) {

					console.log(data);

				});


		});











  });//End of document.ready
  

  $(".dropdown-trigger").dropdown();


});

