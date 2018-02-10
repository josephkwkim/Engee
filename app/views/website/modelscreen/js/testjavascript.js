var host = 'localhost';
var sel_features = [];
var sel_target = []; // only one item
var selected_target;
var sel_model = []; // only one item

document.getElementById("selectedNeuralNetwork").onclick = function() {selectModel()}
document.getElementById("selectedLinearRegression").onclick = function () { selectModel() }
document.getElementById("selectedLasso").onclick = function () { selectModel() }
document.getElementById("selectedGradient").onclick = function () { selectModel() }
document.getElementById("selectedSupportVector").onclick = function () { selectModel() }


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
}

// add response to sel_model
function selectModel() {
		//sel_model.push(response);
	console.log("to send message to backend");
	window.open('../loading/load.html', '_self', false);
}

function changeColor() {
	if(document.getElementById("param1").style.color != "yellow"){
		document.getElementById("param1").style.color = "yellow";
		document.getElementById("param2").style.color = "grey";
	}
	else{
		document.getElementById("param1").style.color = "grey";
	}
 
}

function changeColor2() {
	if(document.getElementById("param2").style.color != "yellow"){
		document.getElementById("param2").style.color = "yellow";
		document.getElementById("param1").style.color = "grey";
	}
	else{
		document.getElementById("param2").style.color = "grey";
	}
 
}

function increaseHue(x){
	x.style.backgroundColor = "rgb(73,77,86)";
}

function originalHue(x){
	x.style.backgroundColor = "#353942";
}

function popupAppear(element) {
	var op = 0.1;  // initial opacity
	element.style.display = 'block';
	var timer = setInterval(function () {
		if (op >= 1) {
			clearInterval(timer);
		}
		element.style.opacity = op;
		element.style.filter = 'alpha(opacity=' + op * 100 + ")";
		op += op * 0.2;
	}, 10);
}

function popupDisappear(element){
	var op = 1;  // initial opacity
	var timer = setInterval(function () {
		if (op <= 0.1) {
			clearInterval(timer);
			element.style.display = 'none';
		}
		element.style.opacity = op;
		element.style.filter = 'alpha(opacity=' + op * 100 + ")";
		op -= op * 0.5;
	}, 50);
}