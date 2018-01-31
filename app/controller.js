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

  function displayData(response) {
    column_names = response.column_names;
    first_rows = response.first_rows;
    all_rows = first_rows;
    all_rows.unshift(column_names);

    table = document.getElementById("OverviewTable");
    for (var r = 0; r < table.rows.length; r++) {
      for (var c = 0; c < table.rows[r].cells.length; c++) {
        table.rows[r].cells[c].innerHTML = all_rows[r][c];
      }
    }
  }

  function setupListeners() {
    $( "#SelectIris" ).click( function( event ) {
      console.log("FRONT: Clicked on Iris");
      $.ajax({
        url: 'http://' + host + ':5000/',
        type: 'POST',
        data: JSON.stringify({
          name: "Selected Iris",
          phase: 1,
          fname: "iris",
          file: "../data/iris.csv"
          }),
        contentType: 'application/json',
        dataType: 'json',
      }).done((response) => { displayData(response) } );
    } );

    $( 'input[type=file]' ).change(function () {
      var fileName = this.files[0].name;
      console.log("FRONT: Clicked on Select and Chose " + fileName);
      $.ajax({
        url: 'http://' + host + ':5000/',
        type: 'POST',
        data: JSON.stringify({
          name: "Selected Own Data",
          phase: 1,
          file: fileName,
          }),
        contentType: 'application/json',
        dataType: 'json',
      }).done((response) => { displayData(response) } );
    } );

    $( "#ConfirmButton" ).click( function( event ) {
      var features = document.getElementById("FeaturesText");
      var target = document.getElementById("TargetText");
      console.log("FRONT: Confirmed Features and Target ");
      $.ajax({
        url: 'http://' + host + ':5000/',
        type: 'POST',
        data: JSON.stringify({
          name: "Confirmed Features and Target",
          phase: 2,
          features: features.value,
          target: target.value
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
