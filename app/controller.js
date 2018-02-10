// makes sure application isn't broken
$(document).ready(function() {

  $('body').addClass('loaded');

  // global variables
  var host = 'localhost';
  var sel_features = [];
  var sel_target = []; // only one item
  var selected_target;
  var sel_model = []; // only one item
  var list_models;
  var model_status;
  var model_type;
  //var train_time = 0.0;

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
    if (sel_model.length > 0) {
      sel_model.pop();
    }
    sel_model.push(response);
    //window.open ('loading/load.html','_self', false);

    // OPEN THE LOADING SCREEN
    document.getElementById('loader-wrapper').style = 'display:block';
    document.getElementById('Page1').style = 'display:none';
    $('body').removeClass('loaded');

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

    //train_time = 0.0;

    model_status = setTimeout(function() {
      console.log("Checking for Model Status...");
      /*console.log("Time: " + train_time);

      train_time = train_time + 0.5;
      if (train_time > 45) {
        clearInterval(model_status);
        $('body').addClass('loaded');
        console.log("Model Timed Out! Did you commit a MISTAKE?");
      }*/

      $.ajax({
        url: 'http://' + host + ':5000/',
        type: 'POST',
        data: JSON.stringify({
          name: "Model Status",
          phase: 5
        }),
        contentType: 'application/json',
        dataType: 'json',
      }).done((response) => {
        displayMetrics(response)
      });
    }, 500);

  }

  function listenSelectedModel(num) {
    var selectedModel = document.getElementById("selectedModel" + num);
    selectedModel.addEventListener("click", function() {
      $('body').removeClass('loaded');
      selectModel(selectedModel.innerHTML);
    });
  }

  // for when the model has finished training
  function displayMetrics(response) {
    if (response[0] == "ERROR") {
      document.getElementById('ErrorMessage').style.display = 'block';
      document.getElementById('Page1').style = 'display:block';
      document.location.href="#ModelSelection";
      $('body').addClass('loaded');
    }
    else {
      // generate side buttons for reselection
      var modelButton1 = document.getElementById('selectedModel1');
      modelButton1.innerHTML = list_models[0];
      listenSelectedModel(1);
      var modelButton2 = document.getElementById('selectedModel2');
      modelButton2.innerHTML = list_models[1];
      listenSelectedModel(2);
      var modelButton3 = document.getElementById('selectedModel3');
      modelButton3.innerHTML = list_models[2];
      listenSelectedModel(3);
      var modelButton4 = document.getElementById('selectedModel4');
      modelButton4.innerHTML = list_models[3];
      listenSelectedModel(4);
      var modelButton5 = document.getElementById('selectedModel5');
      modelButton5.innerHTML = list_models[4];
      listenSelectedModel(5);

      // display model name
      var modelNameLabel = document.getElementById('modelName');
      modelNameLabel.innerHTML = sel_model;

      // display model heading
      var modelLabel = document.getElementById('modelHeading');
      modelLabel.innerHTML = sel_model;

      // display model accuracy
      var scoreLabel = document.getElementById('modelAccuracy');
      scoreLabel.innerHTML = response[0];

      // plot graphs
      document.getElementById('plot1').src = '../output/plot1.jpg';
      document.getElementById('plot2').src = '../output/plot2.jpg';

      // output code snippet
      document.getElementById('codeSnippet').value = response[1];

      for (var f = 0; f < sel_features.length; f++) {
        var labelFeature = document.createElement("Label");
        var inputFeature = document.createElement("input");

        inputFeature.id = "inputF" + f;
        labelFeature.id = "labelF" + f;
        labelFeature.innerHTML = sel_features[f];
        document.getElementById('PredictionInputs').appendChild(labelFeature);
        document.getElementById('PredictionInputs').appendChild(inputFeature);
      }

      // create prediction button
      var predictButton = document.createElement("button");
      predictButton.id = "PredictButton"
      predictButton.innerHTML = "Predict";
      document.getElementById('PredictionInputs').appendChild(predictButton);
      setupListeners("predictButton");

      clearTimeout(model_status);
      //train_time = 0.0;
      $('body').addClass('loaded');
      document.getElementById('PageR').style = 'display:block';
    }
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
    list_models = response;
    // create model choices
    for (var m = 0; m < response.length; m++) {
      // drop old buttons if they exist
      var oldButton = document.getElementById('model' + m);
      if (oldButton != null) oldButton.parentNode.removeChild(oldButton);

      var button = document.createElement("button");
      button.id = "model" + m;
      button.innerHTML = response[m];
      button.className = 'btn btn-primary text-uppercase btn-circle';

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
    //document.getElementById("regressButton").disabled = true;
    //document.getElementById("classifyButton").disabled = true;
    $('html, body').animate({
      scrollTop: $('#ModelSelection').offset().top
    }, 'slow');
  }

  $(document).on("mouseenter", ".btn-circle", function() {
    $("#Gradient").css("display", "none");
    $("#Lasso").css("display", "none");
    $("#Linear").css("display", "none");
    $("#Neural1").css("display", "none");
    $("#Support1").css("display", "none");
    $("#KNearest").css("display", "none");
    $("#Logistic").css("display", "none");
    $("#Neural2").css("display", "none");
    $("#RandomForest").css("display", "none");
    $("#Support2").css("display", "none");

    $("#ModelDescription").css("display", "block");
    if (model_type == 'Regression') {
      $("#RegressionDescription").css("display", "block");
    }
    if (model_type == 'Classification') {
      $("#ClassificationDescription").css("display", "block");
    }
  });

  $(document).on("mouseenter", "#model0", function() {
    if (model_type == 'Regression') {
      $("#Gradient").css("display", "block");
    }
    if (model_type == 'Classification') {
      $("#KNearest").css("display", "block");
    }
  });

  $(document).on("mouseenter", "#model1", function() {
    if (model_type == 'Regression') {
      $("#Lasso").css("display", "block");
    }
    if (model_type == 'Classification') {
      $("#Logistic").css("display", "block");
    }
  });

  $(document).on("mouseenter", "#model2", function() {
    if (model_type == 'Regression') {
      $("#Linear").css("display", "block");
    }
    if (model_type == 'Classification') {
      $("#Neural2").css("display", "block");
    }
  });

  $(document).on("mouseenter", "#model3", function() {
    if (model_type == 'Regression') {
      $("#Neural1").css("display", "block");
    }
    if (model_type == 'Classification') {
      $("#RandomForest").css("display", "block");
    }
  });

  $(document).on("mouseenter", "#model4", function() {
    if (model_type == 'Regression') {
      $("#Support1").css("display", "block");
    }
    if (model_type == 'Classification') {
      $("#Support2").css("display", "block");
    }
  });


  $(document).on("mouseleave", "#ModelSelectRow", function() {

    $("#Gradient").fadeOut(500);
    $("#Lasso").fadeOut(500);
    $("#Linear").fadeOut(500);
    $("#Neural1").fadeOut(500);
    $("#Support1").fadeOut(500);
    $("#KNearest").fadeOut(500);
    $("#Logistic").fadeOut(500);
    $("#Neural2").fadeOut(500);
    $("#RandomForest").fadeOut(500);
    $("#Support2").fadeOut(500);

    setTimeout(function() {
      $("#ModelDescription").css("display", "none");
      $("#RegressionDescription").css("display", "none");
      $("#ClassificationDescription").css("display", "none");
    }, 500);

    /*
    $("#Gradient").css("display", "none");
    $("#Lasso").css("display", "none");
    $("#Linear").css("display", "none");
    $("#Neural1").css("display", "none");
    $("#Support1").css("display", "none");
    $("#KNearest").css("display", "none");
    $("#Logistic").css("display", "none");
    $("#Neural2").css("display", "none");
    $("#RandomForest").css("display", "none");
    $("#Support2").css("display", "none");
    */

  });

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

  // create space for prediction to be shown
  function displayPrediction(response) {
    var labelPrediction = document.createElement("Label");
    labelPrediction.id = "LabelPrediction";
    labelPrediction.innerHTML = response;
    document.getElementById('PredictionInputs').appendChild(labelPrediction);
  }

  function setupListeners(listener = "") {
    // condition for init
    if (listener == "") {
      $("#HomeButton").click(function(event) {
          window.location = index.html;
          window.location.reload();
      });

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
        model_type = 'Regression';
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
        console.log("Chose Classification Models!");
        model_type = 'Classification';
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

    // condition for making a prediction
    if (listener == "predictButton") {
      $("#PredictButton").click(function(event) {
        console.log("Made Prediction");
        var predFail = false;
        var predictThis = [];
        for (var f = 0; f < sel_features.length; f++) {
          var feature = document.getElementById("inputF" + f);
          var input = feature.value;
          if (input === "" || isNaN(input)) predFail = true;
          predictThis.push(input);
        }
        if (!predFail) {
          $.ajax({
            url: 'http://' + host + ':5000/',
            type: 'POST',
            data: JSON.stringify({
              name: "Make Prediction",
              phase: 6,
              predictThis: predictThis
            }),
            contentType: 'application/json',
            dataType: 'json',
          }).done((response) => {
            displayPrediction(response)
          });
       }
      });
    }

    // next listener here

  }

  console.log("Starting App...");
  init();

});
