
//This function is a placeholder for the funct argument
//	of a synchronous ajax call. If you see it, you did something wrong.
function err_funct(ajax_obj)
{
	alert("This function should only be specified for a synchronous AJAX request! check your function call!");
}

//This function is simply a placeholder when the responseText of
//	an ajax call does not matter.
function empty_funct(ajax_obj)
{
	//Does nothing, just a placeholder.
}

function mk_network()
{
	var locations = document.URL.split("/");
	this.web_root = document.URL.replace(locations[locations.length - 1], "");
	this.game_id = 4;
	this.board_update_interval = 500;	//milliseconds between updates
	this.board_update_timer; 			//A reference to the update timer (incase we need to remove it)
	this.last_update;					//Seconds since the EPOCH that we last updated =)	
	this.send_update_interval = 500;		//milliseconds between updating a card.
	this.send_update_timer;			//A reference to the send timer (we will need to remove it)
	this.grabbed_card = "";			//This variable disable updating the currently selected card. See finish_board_update()
	this.player_id = 1;				//TEMP!! Make a player class for this.
	this.test = 0;
	//Member functions
	//Responsible for getting the 52 cards from the server, creating them
		//and making them draggable.
	this.init_board = function()
	{
		//alert("Initializing board through network class");
		
		var var_string = 'op=3&game_id=' + this.game_id;
		var ajax_obj = this.ajax('cards_mgmt.php', var_string, err_funct, false);
		try {
			var new_game = JSON.parse(ajax_obj.responseText);
		} catch (e) {
			console.log("Parsing error:", e);
		}
		
		for(card_idx in new_game.result){
			cur_card = new_game.result[card_idx];
			var fname = cur_card.cid + '.svg';
			var new_card = new card(fname, cur_card.cid);
		}

		//board_update_timer = setInterval("network.begin_board_update()", this.board_update_interval);
		board_update_timer = setInterval(function(){network.begin_board_update()}, this.board_update_interval);
	}
	
	
	this.begin_board_update = function()
	{
		var var_string = 'op=2&game_id=' + this.game_id + "&lastu=" + last_update;
		this.ajax('cards_mgmt.php', var_string, this.finish_board_update, true);
	}
	
	//Get x,y positions and flip value
	this.finish_board_update = function(ajax_obj)
	{
		try {
			var board_state = JSON.parse(ajax_obj.responseText);
		} catch (e) {
			console.log("Parsing error:", e);
		}
		last_update = board_state.time;
		var added_card = 0;

		for (card_idx in board_state.result) {
			var cur_card = board_state.result[card_idx];
			if (typeof card_array[cur_card.cid] == "undefined") {
				var fname = cur_card.cid + '.svg';
				var new_card = new card(fname, cur_card.cid);

				added_card = 1;
			}
		}

		//if (added_card == 1){
		//	card_array[grabbed_card].set_drag(1);
			/*for (card_idx in board_state.result) {
				var cur_card = board_state.result[card_idx];
				
				if ((+cur_card.lo
			}
			for(card_idx in card_array){
				var cur_card = board_state.result[card_idx]
				if ((+cur_card.locked) == player_id){
					card_array[card_idx].set_drag(1);
				}
			}*/
		//}
		
		//Set positions, flipped and locks.
		//TODO!! Perhaps remove the entry from the JSON or table instead of doing check
		//TODO!! The thing still updates the selected card, even though I told it not to...
		for (card_idx in board_state.result) {
			var cur_card = board_state.result[card_idx];

			if (grabbed_card != cur_card.cid) {
				/*var card_div = document.getElementById('card' + cur_card.cid);
				card_div.style.left = cur_card.xpos + 'px';
				card_div.style.top = cur_card.y_pos + 'px';*/
				card_array[cur_card.cid].set_position(cur_card.x_pos, cur_card.y_pos);

				card_array[cur_card.cid].db_flip_card((+cur_card.flipped));
				if ((+cur_card.locked) == -1) {
					card_array[cur_card.cid].set_selected(0);
				} else if ((+cur_card.locked) != this.player_id) {
					card_array[cur_card.cid].set_selected(-1);
				}
			} else {
				//alert("skipping card update: " + grabbed_card);
			}
		}
	}
	
	//Interface for changing a card's position. Started on mousedown
	//card_id: The index in the card array of the card in question
	this.grab_card = function(card_idx)
	{
		//alert("Beginning transmission of " + card_idx);

		var got_lock = this.secure_lock(card_idx);
		console.log("Got lock returned: " + got_lock.result + " in grab_card().");
		if (got_lock.result == 1){
			//The user is permitted to move it
			card_array[card_idx].set_selected(1);
			
			//Ignore this card's updates
			grabbed_card = card_idx;
			//alert(grabbed_card);
			//Set the timer interval
			card_array[card_idx].set_drag(1);
			this.send_update_timer = setInterval("network._send_pos(" + '"' + card_idx + '"' +");", this.send_update_interval);
			
		} else {
			//Ensure the user cannot move it
			//card_array[card_idx].set_drag(0);
			//card_array[card_idx].set_drag(0);
		}
		
	}
	
	//This small internal function will handle getting
	//	and sending card positions.
	this._send_pos = function(card_idx)
	{
		console.log("_send_pos has been called: transmitting card position: " + card_idx);
		var card = document.getElementById(card_array[card_idx].card_id);
		var x_pos = card.offsetLeft;
		var y_pos = card.offsetTop;
		
		//alert('x_pos = ' + x_pos + '; y_pos' + y_pos);
		//AJAX
		var var_string = "op=1&game_id=" + this.game_id + "&cid=" + card_idx + "&pid=" + this.player_id + "&x_pos=" + x_pos + "&y_pos=" + y_pos;
		//alert(var_string);
		this.ajax("cards_mgmt.php", var_string, empty_funct, true);
		//alert(ajax_obj.responseText);
	}
	
	//Stop transmitting the current position of the card.
	this.stop_send = function(card_idx)
	{
		//if(card_idx != grabbed_card){
		//	alert("A user was able to change their selected card without letting go of the first card. We got problems.");
		//}
		
		//Remove the selection and lock
		//alert("Stopping the selection of " + grabbed_card);
		//card_array[grabbed_card].set_selected(0);
		//this.remove_lock(grabbed_card);
		
		clearInterval(this.send_update_timer);
		
		grabbed_card = "";
	}
	
	//Needs a playerID to check for a lock
	this.set_card_pos = function(card_id)
	{
		
	}//set the x,y position
	
	this.secure_lock = function (card_idx)
	{
		var var_string = "op=4&player_id=" + this.player_id + "&card_id=" + card_idx + "&game_id=" + this.game_id;
		
		var ajax_obj = this.ajax("cards_mgmt.php", var_string, err_funct, false);
		try {
			var board_state = JSON.parse(ajax_obj.responseText);
		} catch (e) {
			console.log("Parsing error:", e);
		}
		
		return (board_state);	//temp: will return database response soon
	}//Asks the database for a selection lock. Returns 1 if successful
	
	//Will remove the user's lock on the currently selected card
	//Preconditions: This user must have a lock on a certain card.
	this.remove_lock = function(card_idx)
	{
		var var_string =  "op=5&player_id=" + this.player_id + "&card_id=" + card_idx + "&game_id=" + this.game_id;
		var ajax_obj = this.ajax("cards_mgmt.php", var_string, err_funct, false);
		try {
			var board_state = JSON.parse(ajax_obj.responseText);
		} catch (e) {
			console.log("Parsing error:", e);
		}
		
		if ((board_state.result) == 0){
			alert("We have lock release failures!");
		}
	}
	
	this.release_locks = function()
	{
		var var_string = 'op=7&game_id=' + this.game_id + "&player_id=" + this.player_id;
		//alert(var_string);
		var ajax_obj = this.ajax('cards_mgmt.php', var_string, err_funct, false);
		console.log(ajax_obj.responseText)
		try {
			var cards = JSON.parse(ajax_obj.responseText);
		} catch (e) {
			console.log("Parsing error:", e);
		}
		//alert(result.responseText);
		for(card_idx in cards.result){
			cur_card = cards.result[card_idx];
			//alert("'" + cards[card_idx].cid + "'");
			card_array[cur_card.cid].set_selected(0);
		}
	}
	
	this.flipdb = function(card_idx, flip_val)
	{
		var var_string = "op=6&pid="+player_id+"&card_id=" + card_idx + "&game_id=" + this.game_id + "&flipped=" + flip_val;
		//alert(var_string);
		var ajax_obj = this.ajax("cards_mgmt.php", var_string, err_funct, false);
		//alert(ajax_obj.responseText);
		
		try {
			var board_state = JSON.parse(ajax_obj.responseText);
		} catch (e) {
			console.log("Parsing error:", e);
		}
		//alert(out_str);
		return board_state;
	}	//Sets "flipped" to the new flip_val
	
	//Responsible for carrying out AJAX requests
	//async: true or false for asynchronous requests. non-async requests return an AJAX obj
	this.ajax = function(file, var_string, funct, async){
		//alert('Ajax accessed');
		if(window.XMLHttpRequest){
			var ajax_obj =  new XMLHttpRequest();
		}else{
			var ajax_obj = new ActiveXObject("Microsoft.XMLHTTP");
		}
		
		ajax_obj.open('POST', this.web_root + file, async);
		ajax_obj.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
		
		//alert(var_string);
		ajax_obj.send(var_string);
		
		if (async){
			//alert("Registered async");
			ajax_obj.onreadystatechange = function(){
				if(ajax_obj.readyState == 4 && ajax_obj.status == 200){
					funct(ajax_obj);
					//return ajax_obj;
					//return obj;
				
				}else{
					//alert('Ready State: ' + ajax_obj.readyState + " Status: " + ajax_obj.status);
				}
			}
		} else {
			return ajax_obj;
		}
	}
	
	//Constructor
	
}