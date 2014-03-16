//Global Objects
var card_array = new Array();
var card_map = new Array();
var network = new mk_network();
var select = new mk_selection();
var player = new mk_player();

//Global Variables
var top_z = 70;
var last_update = (8 * 3600) + 1; 	//The EPOCH was 16:00 our time........... The server has a locale!

//This global event listener will release all
//		locks when the user clicks on something
//		other than cards.
window.onclick = function(e)
{
	if(e.button == 0 && e.target.name != "test"){
		//We got a left click, release all locks
		select.release_locks();
	}
	
}

//This small function removes the browser's context
//		menu from appearing on a right click
//We have overwritten this functionality.
document.addEventListener("contextmenu", function(e){
 				e.preventDefault();
			}, false);