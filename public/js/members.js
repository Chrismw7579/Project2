/* eslint-disable linebreak-style */
/* eslint-disable no-undef */
/* eslint-disable quotes */
$(document).ready(function() {
	// This file just does a GET request to figure out which user is logged in
	// and updates the HTML on the page
	$.get("/api/user_data").then(function(data) {
		$(".member-name").text(data.email);
	});
});

//$('#availabilitySwitch').on("click",function(){
	
// 	let newAvailability = {
// 	  available : document.getElementById('availabilitySwitch').checked ? 1 : 0
// 	}
// 	console.log(newAvailability);
// 	$.ajax({
// 	  method: "PUT",
// 	  url: "/api/availability",
// 	  data: newAvailability
// 	})
// 	  .then(function(data) {
// 		console.log(data)
// 	});
// });

$('#availabilitySwitch').on("click",function(){
	console.log(document.getElementById('availabilitySwitch').checked);
	
	// console.log(document.getElementById('availabilitySwitch').checked);
	// console.log("start");
	// console.log($('#availabilitySwitch').checked);
	// console.log("end");

	if(document.getElementById('availabilitySwitch').checked===true){
		console.log("I am being clicked");
		var newStatus={
			available:1
		};
		updateToggle(newStatus.available); 

	}
	else{
		//console.log("I am being clicked");
 	var newStatus={
		 available:0
		};
		updateToggle(newStatus.available);
  
	}
   
});

function updateToggle(available){
	$.get('/api/toggle',{
		available:available
	}).then(function(data){
		console.log("status sent to api-routes is:",data);
	});
}
