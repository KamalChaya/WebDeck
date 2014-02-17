
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
	this.web_root = 'http://web.engr.oregonstate.edu/~changjo/';
	this.game_id = 4;
	this.board_update_interval = 300;	//milliseconds between updates
	this.board_update_timer; 			//A reference to the update timer (incase we need to remove it)
	this.last_update;				//Seconds since the EPOCH that we last updated =)	
	this.send_update_interval = 200;		//milliseconds between updating a card.
	this.send_update_timer;			//A reference to the send timer (we will need to remove it)
	this.selected_card = "";			//This variable disable updating the currently selected card. See finish_board_update()
	this.player_id = 1;	//TEMP!! Make a player class for this.
	this.test = 0;
	//Member functions
	//Responsible for getting the 52 cards from the server, creating them
		//and making them draggable.
	this.init_board = function()
	{
		//alert("Initializing board through network class");
		var var_string = 'op=3&game_id=' + this.game_id;
		var ajax_obj = this.ajax('cards_mgmt.php', var_string, this.finish_board_update, false);
		var new_game = JSON.parse(ajax_obj.responseText);

		for(key in new_game.Cards){
			var fname = new_game.Cards[key].cid + '.svg';
			var new_card = new card(fname, new_game.Cards[key].cid);
		}
		
		//Make the cards draggable
		for(key in card_array){
			card_array[key].set_drag(1);
		}
		
		board_update_timer = setInterval(function(){network.begin_board_update()}, this.board_update_interval);
	}
	
	
	this.begin_board_update = function()
	{
		//alert("Updating Board: " + last_update);
		var var_string = 'op=2&game_id=' + this.game_id + "&lastu=" + last_update;
		this.ajax('cards_mgmt.php', var_string, this.finish_board_update, true);
	}
	
	//Get x,y positions and flip value
	this.finish_board_update = function(ajax_obj)
	{
		var new_game = JSON.parse(ajax_obj.responseText);
		last_update = new_game.time;
		var added_card = 0;
		for(key in new_game.query){
			var cur_key = new_game.query[key];
			if (typeof card_array[cur_key.cid] == "undefined") {

				var fname = cur_key.cid + '.svg';
				var new_card = new card(fname, cur_key.cid);

				added_card = 1;
			}
		}
		
		//Make the cards draggable again
		if (added_card == 1){
			for(key in card_array){
				card_array[key].set_drag(1);
			}
		}
		
		//Set positions, flipped and locks.
		//TODO!! Perhaps remove the entry from the JSON or table instead of doing check
		//TODO!! The thing still updates the selected card, even though I told it not to...
		for(key in new_game.query){
			var cur_key = new_game.query[key];
			if (selected_card != cur_key.cid) {
				var card_div = document.getElementById('card' + cur_key.cid);
				card_div.style.left = cur_key.x_pos + 'px';
				card_div.style.top = cur_key.y_pos + 'px';
				
				card_array[cur_key.cid].db_flip_card((+cur_key.flipped));
				if((+cur_key.locked) == -1){
					card_array[cur_key.cid].set_selected(0);
					
				} else if((+cur_key.locked) != this.player_id){
					card_array[cur_key.cid].set_selected(-1);
				}
				
			} else {
				//alert("Skipping card update");
			}
		}
	}
	
	//Interface for changing a card's position. Started on mousedown
	//card_id: The index in the card array of the card in question
	this.trans_card_pos = function(card_idx)
	{
		
		var got_lock = this.secure_lock(card_idx);
		if (got_lock == 1){
			//The user is permitted to move it
			card_array[card_idx].set_selected(1);
			
			//Ignore this card's updates
			selected_card = card_idx;

			//Set the timer interval
			this.send_update_timer = setInterval("network._trans_pos(" + '"' + card_idx + '"' +");", this.send_update_interval);
			
		} else {
			//Ensure the user cannot move it
			//card_array[card_idx].set_drag(0);
			//card_array[card_idx].set_drag(0);
		}
		
	}
	
	//This small internal function will handle getting
	//	and sending card positions.
	this._trans_pos = function(card_idx)
	{
		var card = document.getElementById(card_array[card_idx].card_id);
		var x_pos = card.offsetLeft;
		var y_pos = card.offsetTop;
		
		//AJAX
		var var_string = "op=1&game_id=" + this.game_id + "&cid=" + card_idx + "&pid=" + this.player_id + "&x_pos=" + x_pos + "&y_pos=" + y_pos;
		this.ajax("cards_mgmt.php", var_string, empty_funct, true);
	}
	
	//Stop transmitting the current position of the card.
	this.stop_trans = function(card_idx)
	{
		if(card_idx != selected_card){
			alert("A user was able to change their selected card without letting go of the first card. We got problems.");
		}
		
		//Remove the selection and lock
		//alert("Stopping the selection of " + selected_card);
		card_array[selected_card].set_selected(0);
		this.remove_lock(selected_card);
		
		clearInterval(this.send_update_timer);
		
		selected_card = "";
	}
	
	//Needs a playerID to check for a lock
	this.set_card_pos = function(card_id)
	{
		
	}//set the x,y position
	
	this.secure_lock = function (card_idx)
	{
		var var_string = "op=4&player_id=" + this.player_id + "&card_id=" + card_idx + "&game_id=" + this.game_id;
		
		var ajax_obj = this.ajax("cards_mgmt.php", var_string, err_funct, false);
		var ajax_obj = JSON.parse(ajax_obj.responseText);
		
		return (+ajax_obj);	//temp: will return database response soon
	}//Asks the database for a selection lock. Returns 1 if successful
	
	//Will remove the user's lock on the currently selected card
	//Preconditions: This user must have a lock on a certain card.
	this.remove_lock = function(card_idx)
	{
		var var_string =  "op=5&player_id=" + this.player_id + "&card_id=" + card_idx + "&game_id=" + this.game_id;
		var ajax_obj = this.ajax("cards_mgmt.php", var_string, err_funct, false);
		//alert(ajax_obj.responseText);
		var ajax_obj = JSON.parse(ajax_obj.responseText);
		
		if ((+ajax_obj) == 0){
			alert("We have lock release failures!");
		}
	}
	
	this.flipdb = function(card_idx, flip_val)
	{
		var var_string = "op=6&card_id=" + card_idx + "&game_id=" + this.game_id + "&flipped=" + flip_val;
		//alert(var_string);
		var ajax_obj = this.ajax("cards_mgmt.php", var_string, err_funct, false);
		//alert(ajax_obj.responseText);
		
		var out_str = JSON.parse(ajax_obj.responseText);
		return out_str;
	}	//Sets "flipped" to the new flip_val
	
	//Responsible for carrying out AJAX requests
	//async: true or false for asynchronous requests. non-async requests return an AJAX obj
	this.ajax = function(file, var_string, funct, async){
		if(window.XMLHttpRequest){
			var ajax_obj =  new XMLHttpRequest();
		}else{
			var ajax_obj = new ActiveXObject("Microsoft.XMLHTTP");
		}
		
		ajax_obj.open('POST', this.web_root + file, async);
		ajax_obj.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
		
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
