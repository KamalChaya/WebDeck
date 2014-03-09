var card_array = new Array();
var card_map = new Array();
var network = new mk_network();
var select = new mk_selection();
var player = new mk_player();
//alert(network);
var top_z = 70;
//var customDelim = '~';
var last_update = (8 * 3600) + 1; 	//The EPOCH was 16:00 our time........... The server has a locale!
var shift_down = 0;

window.onclick = function(e)
{
	//alert("You clicked on the page!");
	if(e.button == 0 && e.target.name != "test"){
		//We got a left click
		//release all locks
		select.release_locks();
	}
	console.log("onclicked!");
}
/*$(document).click(function(e) {
	var target = $(e.target);
	alert(target.attr('id'));
});*/

window.onkeydown = function(e)
{
	if(e.keyCode == 16){
		//alert("Got shift down!");
		shift_down += 1;
	}
}

window.onkeyup = function(e)
{
	if(e.keyCode == 16){
		//alert("Shift was released!");
		shift_down -= 1;
	}
}

window.onmouseup = function(e)
{
	console.log("mouseup!");
}
window.onmousedown = function(e)
{
	console.log("mousedown!");
}

document.addEventListener("contextmenu", function(e){
e.preventDefault();
}, false);
//document.addEventListener("onmouseup", card_array[selection.])