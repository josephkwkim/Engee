// makes sure application isn't broken
$(document).ready(function() {

  // global variables
  var host = 'localhost';

  function init() {
    setupListeners();
  }

  function process(response) {
    console.log(response);
  }

  function setupListeners() {
    $( "#SelectIris" ).click( function( event ) {
      console.log("FRONT: Clicked on Iris");
      $.ajax({
        url: 'http://' + host + ':5000/',
        type: 'POST',
        data: JSON.stringify({
          name: "Selected Iris",
          fname: "iris",
          file: "../data/iris.csv"
          }),
        contentType: 'application/json',
        dataType: 'json',
      }).done((response) => { process(response) } );
    } );

    $( 'input[type=file]' ).change(function () {
      var fileName = this.files[0].name;
      console.log("FRONT: Clicked on Select and Chose " + fileName);
      $.ajax({
        url: 'http://' + host + ':5000/',
        type: 'POST',
        data: JSON.stringify({
          name: "Selected Own Data",
          file: fileName,
          }),
        contentType: 'application/json',
        dataType: 'json',
      }).done((response) => { process(response) } );
    } );

    // next listener here

  }

  console.log("Starting App...");
  init();

});
