$(document).ready(function() {
  // This file just does a GET request to figure out which user is logged in
  // and updates the HTML on the page
  $('#availabilitySwitch').on("click",function(){
    console.log(document.getElementById('availabilitySwitch').checked);
  })
 
  let userId;
  $.get("/api/user_data").then(function(data) {
    userId = data.id;
    console.log(userId);
    $(".member-name").text(data.username);
  });

});




















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