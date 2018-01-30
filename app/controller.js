// global variables
var host = 'localhost';

function init(){
  setupListeners();
}

function process(response) {
  console.log("Received at the FRONT!");
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

  $( "#NeuNet" ).click(function() {
    alert( "Selected Neural Net!" );
  } );

  // next listener here

}

init();
console.log("Starting App...");
