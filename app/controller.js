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
    $( "#LinReg" ).click( function( event ) {
      $.ajax({
        url: 'http://' + host + ':5000/',
        type: 'POST',
        data: JSON.stringify({
          name: "Simple Regression from FRONT",
          }),
        contentType: 'application/json',
        dataType: 'json',
      }).done((response) => { process(response) } );
    } );

    $( "#NeuNet" ).click( function( event ) {
      $.ajax({
        url: 'http://' + host + ':5000/',
        type: 'POST',
        data: JSON.stringify({
          name: "Neural Network from FRONT",
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
