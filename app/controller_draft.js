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
    num_columns = column_names.length;
    first_rows = response.first_rows;
    all_rows = first_rows;
    num_rows = 6;
    all_rows.unshift(column_names);

    table = document.getElementById("OverviewTable");

    // insert preview label
    var label = document.createElement("label");
    label.innerHTML = "Preview of Dataset:";
    document.getElementById("PreviewDiv").appendChild(label);

    // insert header row
    var row = table.insertRow(-1);
    for (var c = 0; c < num_columns; c++) {
        var header = document.createElement("TH");
        header.innerHTML = all_rows[0][c];
        row.appendChild(header);
    }

    // insert data rows
    for (var r = 1; r < num_rows; r++) {
        row = table.insertRow(-1);
        for (var c = 0; c < num_columns; c++) {
            var cell = row.insertCell(-1);
            cell.innerHTML = all_rows[r][c];
        }
    }

    // create feature buttons
    for (var c = 0; c < num_columns; c++) {
      var button = document.createElement("button");
      button.innerHTML = all_rows[0][c];
      document.getElementById("FeaturesDiv").appendChild(button);
      // Add event handler
      /*button.addEventListener ("click", function() {
        alert("did something") }); */
    }

    var chooseButton = document.createElement("button");
    chooseButton.innerHTML = "Choose Features";
    document.getElementById("FeaturesDiv").appendChild(chooseButton);
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
