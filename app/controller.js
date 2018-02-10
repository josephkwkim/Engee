// makes sure application isn't broken
$(document).ready(function() {

  $('body').addClass('loaded');

  // global variables
  var host = 'localhost';
  var sel_features = [];
  var sel_target = []; // only one item
  var selected_target;
  var sel_model = []; // only one item

  function init() {
    setupListeners();
  }

  function process(response) {
    console.log(response);
  }

  // add response to sel_features
  function selectFeature(response) {
    sel_features.push(response);
    console.log("Selected " + response + " as Feature!");
  }

  // assign sel_target to response
  function selectTarget(response) {
    sel_target.push(response);
    console.log("Selected " + response + " as Target!");
  }

  // remove response from sel_features
  function unselectFeature(response) {
    var index = sel_features.indexOf(response);
    if (index > -1) {
      sel_features.splice(index, 1);
    }
    console.log("Unselected " + response + " as Feature!");
  }

  // remove response from sel_target
  function unselectTarget(response) {
    var index = sel_target.indexOf(response);
    if (index > -1) {
      sel_target.splice(index, 1);
    }
    console.log("Unselected " + response + " as Target!");
  }

  // add response to sel_model
  function selectModel(response) {
    sel_model.push(response);
    //window.open ('loading/load.html','_self', false);

    // OPEN THE LOADING SCREEN
    document.getElementById('loader-wrapper').style = 'display:block';
    document.getElementById('Page1').style = 'display:none';
    $('body').removeClass('loaded');

    setTimeout(function() {
      document.getElementById('Page1').style = 'display:block';
      $('body').addClass('loaded');
    }, 3000);

    console.log("Selected " + response + " as Model!");
    $.ajax({
      url: 'http://' + host + ':5000/',
      type: 'POST',
      data: JSON.stringify({
        name: "Chose Model",
        phase: 4,
        model: response
      }),
      contentType: 'application/json',
      dataType: 'json',
    }).done((response) => {
      displayLoading(response)
    });
  }

  // for generating interface after selecting dataset
  function displayData(response) {
    column_names = response.column_names;
    num_columns = column_names.length;
    first_rows = response.first_rows;
    all_rows = first_rows;
    num_rows = 6;
    all_rows.unshift(column_names);

    // Unhide the Model Nav Bar button
    document.getElementById("ModelNavBar").style.display = "block";

    // Unhide the Model Section
    document.getElementById("ModelSection").style.display = "block";

    table = document.getElementById("OverviewTable");

    // insert header row
    var row = table.insertRow(-1);
    for (var c = 0; c < num_columns; c++) {
      var header = document.createElement("TH");
      header.innerHTML = all_rows[0][c];
      header.style.color = "white";
      header.style.background = "#503A60";
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

    // unhide the Features Section
    document.getElementById("FeaturesSection").style.display = "block";

    // create feature choices
    for (var c = 0; c < num_columns; c++) {
      var button = document.createElement("button");
      button.className = 'btn';
      button.id = "attributeF" + c;
      button.innerHTML = all_rows[0][c];
      button.style.margin = "5px";
      button.style.backgroundColor = "#F4DEC7";
      document.getElementById("FeaturesDiv").appendChild(button);
      listenFeature("attributeF" + c);
    }

    // create choose features button
    var chooseButtonX = document.createElement("button");
    chooseButtonX.id = "chooseButtonX";
    chooseButtonX.className = 'btn btn-outline-light btn-xl';
    chooseButtonX.innerHTML = "Choose Features";
    document.getElementById("ChooseButtonXDiv").appendChild(chooseButtonX);
    setupListeners(listener = "chooseButtonX");

    $('html, body').animate({
      scrollTop: $('#model').offset().top
    }, 'slow');
    document.getElementById("file").disabled = true;
  }

  // for generating interface after selecting features
  function processFeatures(response) {
    // DISPLAY CHOSEN BUTTONS

    // display Target title
    document.getElementById("TargetSection").style.display = "block";

    // create target choices
    for (var c = 0; c < num_columns; c++) {
      if (sel_features.indexOf(all_rows[0][c]) == -1) {
        var button = document.createElement("button");
        button.className = 'btn';
        button.id = "attributeT" + c;
        button.innerHTML = all_rows[0][c];
        button.style.margin = "5px";
        button.style.backgroundColor = "#F4DEC7";
        document.getElementById("TargetDiv").appendChild(button);
        listenTarget("attributeT" + c);
      }
    }

    // create choose target button
    var chooseButtonY = document.createElement("button");
    chooseButtonY.id = "chooseButtonY";
    chooseButtonY.className = 'btn btn-primary btn-xl';
    chooseButtonY.innerHTML = "Choose Target";
    document.getElementById("ChooseButtonYDiv").appendChild(chooseButtonY);
    setupListeners(listener = "chooseButtonY");

    $('html, body').animate({
      scrollTop: $('#TargetSection').offset().top
    }, 'slow');
    document.getElementById("chooseButtonX").disabled = true;
  }

  // for generating interface after selecting target
  function processTarget(response) {

    //Unhide Model Type
    document.getElementById("ModelType").style.display = "block";

    // create regression button
    var regressButton = document.createElement("button");
    regressButton.id = "regressButton";
    regressButton.className = 'btn btn-outline-light btn-xl';
    regressButton.innerHTML = "Regression";
    regressButton.style.margin = "10px";
    document.getElementById("ModelTypeDiv").appendChild(regressButton);
    setupListeners(listener = "regressButton");

    // create classification button
    var classifyButton = document.createElement("button");
    classifyButton.id = "classifyButton";
    classifyButton.className = 'btn btn-outline-light btn-xl';
    classifyButton.innerHTML = "Classification";
    classifyButton.style.margin = "10px";
    document.getElementById("ModelTypeDiv").appendChild(classifyButton);
    setupListeners(listener = "classifyButton");

    $('html, body').animate({
      scrollTop: $('#ModelType').offset().top
    }, 'slow');
    document.getElementById("chooseButtonY").disabled = true;
  }

  // wrapper for feature selection setupListeners
  function listenFeature(id) {
    var featureChoice = document.getElementById(id);
    if (typeof window.addEventListener === 'function') {
      featureChoice.addEventListener("click", function() {
        console.log(featureChoice.style.backgroundColor);
        if (featureChoice.style.backgroundColor == 'rgb(244, 222, 199)') {
          featureChoice.style.backgroundColor = '#AB6B3A';
          featureChoice.style.color = 'white';
          selectFeature(featureChoice.innerHTML);
        } else {
          featureChoice.style.backgroundColor = '#F4DEC7';
          featureChoice.style.color = 'black';
          unselectFeature(featureChoice.innerHTML);
        }
      });
    }
  }

  // wrapper for target selection setupListeners
  function listenTarget(id) {
    var targetChoice = document.getElementById(id);
    if (typeof window.addEventListener === 'function') {
      targetChoice.addEventListener("click", function() {
        console.log(targetChoice.style.backgroundColor);
        if (targetChoice.style.backgroundColor == 'rgb(244, 222, 199)') {
          targetChoice.style.backgroundColor = '#AB6B3A';
          targetChoice.style.color = 'white';

          if (selected_target != null) {
            prevTargetChoice = selected_target;
            prevTargetChoice.style.backgroundColor = '#F4DEC7';
            prevTargetChoice.style.color = 'black';
            unselectTarget(prevTargetChoice.innerHTML);
          }

          selected_target = targetChoice;
          selectTarget(targetChoice.innerHTML);
        } else {
          targetChoice.style.backgroundColor = '#F4DEC7';
          targetChoice.style.color = 'black';
          unselectTarget(targetChoice.innerHTML);
        }
      });
    }
  }

  function processModelList(response) {
    // create model choices
    for (var m = 0; m < response.length; m++) {
      var button = document.createElement("button");
      button.id = "model" + m;
      button.innerHTML = response[m];
      button.className = 'btn btn-primary text-uppercase';

      button.style.height = '180px';
      button.style.width = '180px';
      button.style.borderRadius = '50%';
      button.style.fontSize = '1.2em';
      button.style.margin = "10px";
      button.style.whiteSpace = 'normal';
      button.style.fontFamily = 'Lato';
      button.style.fontWeight = 'bold';

      document.getElementById("ModelSelectDiv").appendChild(button);
      listenModel("model" + m);
    }
    //Unhide Model Selection
    document.getElementById("ModelSelection").style = 'display:block';
    document.getElementById("regressButton").disabled = true;
    document.getElementById("classifyButton").disabled = true;
    $('html, body').animate({
      scrollTop: $('#ModelSelection').offset().top
    }, 'slow');

  }

  // wrapper for model selection setupListeners
  function listenModel(id) {
    var modelChoice = document.getElementById(id);
    if (typeof window.addEventListener === 'function') {
      modelChoice.addEventListener("click", function() {
        selectModel(modelChoice.innerHTML)
      });
    }
  }

  // loading screen while model trains
  function displayLoading() {
    console.log("Loading...");
  }

  function setupListeners(listener = "") {
    // condition for init
    if (listener == "") {
      // listener for iris selection
      $("#SelectIris").click(function(event) {
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
        }).done((response) => {
          displayData(response)
        });
      });

      // listener for file selection
      $('input[type=file]').change(function() {
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
        }).done((response) => {
          displayData(response)
        });
      });
    }

    // condition for selecting features
    if (listener == "chooseButtonX") {
      $("#chooseButtonX").click(function(event) {
        if (sel_features.length > 0) {
          console.log("Chose Features!");
          $.ajax({
            url: 'http://' + host + ':5000/',
            type: 'POST',
            data: JSON.stringify({
              name: "Chose Features",
              phase: 2,
              features: sel_features
            }),
            contentType: 'application/json',
            dataType: 'json',
          }).done((response) => {
            processFeatures(response)
          });
        }
      });
    }

    // condition for selecting target
    if (listener == "chooseButtonY") {
      $("#chooseButtonY").click(function(event) {
        if (sel_target.length > 0) {
          console.log("Chose Target!");
          $.ajax({
            url: 'http://' + host + ':5000/',
            type: 'POST',
            data: JSON.stringify({
              name: "Chose Target",
              phase: 2,
              target: sel_target
            }),
            contentType: 'application/json',
            dataType: 'json',
          }).done((response) => {
            processTarget(response)
          });
        }
      });
    }

    // condition for selecting regression models
    if (listener == "regressButton") {
      $("#regressButton").click(function(event) {
        console.log("Chose Regression Models!");
        $.ajax({
          url: 'http://' + host + ':5000/',
          type: 'POST',
          data: JSON.stringify({
            name: "Chose Regress",
            phase: 3
          }),
          contentType: 'application/json',
          dataType: 'json',
        }).done((response) => {
          processModelList(response)
        });
      });
    }

    // condition for selecting classification models
    if (listener == "classifyButton") {
      $("#classifyButton").click(function(event) {
        console.log("Chose CLassification Models!");
        $.ajax({
          url: 'http://' + host + ':5000/',
          type: 'POST',
          data: JSON.stringify({
            name: "Chose Classify",
            phase: 3
          }),
          contentType: 'application/json',
          dataType: 'json',
        }).done((response) => {
          processModelList(response)
        });
      });
    }

    // next listener here

  }

  console.log("Starting App...");
  init();

});
