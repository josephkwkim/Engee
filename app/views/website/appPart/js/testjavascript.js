document.getElementById("param1").onclick = function() {changeColor()};
document.getElementById("param2").onclick = function() {changeColor2()};


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


