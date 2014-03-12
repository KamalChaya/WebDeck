
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
	//this.last_update;					//Seconds since the EPOCH that we last updated =)	
	this.send_update_interval = 300;		//milliseconds between updating a card.
	this.send_update_timer;			//A reference to the send timer (we will need to remove it)
	//Member functions
	//Responsible for getting the 52 cards from the server, creating them
		//and making them draggable.
	this.init_board = function()
	{
		//alert("Initializing board through network class");
		
		this.change_game(localStorage["game_id"]);
		localStorage.removeItem("game_id");

		var var_string = 'op=3&game_id=' + this.game_id;
		var ajax_obj = this.ajax('cards_mgmt.php', var_string, err_funct, false);
		try {
			var new_game = JSON.parse(ajax_obj.responseText);
		} catch (e) {
			console.log("Parsing error:", e);
		}

		this.timeout_games();

		var username = localStorage["wd_username"];
		var namequery = 'op=8&username=' + username;
		var userid = this.ajax('cards_mgmt.php', namequery, err_funct, false);
		userid = JSON.parse(userid.responseText);

		if(!jQuery.isEmptyObject(userid)) {
			player.player_id = userid[0].id;
			player.username = username;
			console.log("Found user " + player.username + " with id " + player.player_id);
		} else {
			if(confirm("Account not found. Would you like an account to be created for you?")) {
				var id_query = 'op=10';
				var max_id = this.ajax('cards_mgmt.php', id_query, err_funct, false);
				max_id = JSON.parse(max_id.responseText);

				max_id = parseInt(max_id[0].id);
				max_id = max_id + 1;
				
				id_query = 'op=11&username=' + username + "&uid=" + max_id;

				this.ajax('cards_mgmt.php', id_query, err_funct, false);
				console.log("Added new username " + username + " with id " + max_id);
			} else {
				alert("Okay. Going back to the lobby.");
				document.location = 'lobby.html';
			}
		}

		localStorage.removeItem("wd_username");
		
		//Make the cards
		var cur_card;
		for(card_idx in new_game.result){
			cur_card = new_game.result[card_idx];
			var new_card = new card(cur_card.cid);

			network.set_card_attr(cur_card);
		}

		//board_update_timer = setInterval("network.begin_board_update()", this.board_update_interval);
		board_update_timer = setInterval(function(){network.begin_board_update()}, this.board_update_interval);
	}

	this.timeout_games = function()
	{
		var var_string = 'op=15';
		var ajax_obj = this.ajax('cards_mgmt.php', var_string, err_funct, false);
		var return_text = JSON.parse(ajax_obj.responseText);
		console.log(return_text);

		for(i in return_text) {
			var_string = 'op=16&game_id=' + return_text[i].game_id;
			ajax_obj = this.ajax('cards_mgmt.php', var_string, err_funct, false);
		}
	}
	
	this.reset_cards = function()
	{
		var var_string = 'op=19&game_id=' + this.game_id;
		var ajax_obj = this.ajax('cards_mgmt.php', var_string, err_funct, false);
	}
	
	this.begin_board_update = function()
	{
		//console.log("last_update preceeding update: " + last_update);
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
		//console.log("last_update following update: " + last_update);
		var added_card = 0;

		//console.log(board_state.result);

		//Set positions, flipped and locks.
		//Handle cards in other people's hands
		for (card_idx in board_state.result) {
			var cur_card = board_state.result[card_idx];
			
			network.set_card_attr(cur_card);
		}
	}
	
	//Will set all visual and functional components of a card including:
	//border, position, z_index, "inhandedness", flip value
	this.set_card_attr = function(cur_card)
	{
		if (cur_card.in_hand == player.player_id) {
			if (card_array[cur_card.cid].card_div.in_hand != 1){
				//The card is not in hand, but it should be. For refreshing
				card_array[cur_card.cid].move_to_hand();
				card_array[cur_card.cid].set_position(player.next_hand_pos_x, 50);
				player.next_hand_pos_x += 30;
			}
			console.log("Found ", cur_card.cid, " in hand. cur_card.in_hand: ", cur_card.in_hand);
			
		} else if(cur_card.in_hand == 0){
			if ((+card_array[cur_card.cid].card_div.in_hand) == -1){
				card_array[cur_card.cid].reinst_card();
			}
			
			if (select.grabbed_card != cur_card.cid) {
				card_array[cur_card.cid].set_position(cur_card.x_pos, cur_card.y_pos);
				card_array[cur_card.cid].set_z_idx(cur_card.z_pos);
				if (cur_card.z_pos > top_z){ 
					top_z = (+cur_card.z_pos) + 1;
				}
				
				card_array[cur_card.cid].db_flip_card((+cur_card.flipped));
				if ((+cur_card.locked) == -1) {
					card_array[cur_card.cid].set_selected(0);
					
				} else if ((+cur_card.locked) != player.player_id) {
					card_array[cur_card.cid].set_selected(-1);
					
				}
			} else {
				//alert("skipping card update: " + grabbed_card);
			}
		} else {
			card_array[cur_card.cid].remove_card();
		}
	}
	
	this.change_game = function(new_game)
	{
		if(typeof new_game != 'undefined' && new_game != "") {
			this.game_id = new_game;
		}
		var game_query = 'op=13&game_id=' + this.game_id;
		var num_cards = this.ajax('cards_mgmt.php', game_query, err_funct, false);
		num_cards = JSON.parse(num_cards.responseText);
		num_cards = num_cards[0].num_cards;
		//console.log(num_cards);

		if (num_cards == 52){
			//console.log("have 52 cards");
		} else {
			var desc = prompt("No game session with that ID found. Creating a new session. Please enter a description: ","My fun game!");

			if (desc != null) {
				var game_create = 'op=17&game_id=' + this.game_id + '&host=' + localStorage["wd_username"] + '&desc=' + desc;
				var return_val = this.ajax('cards_mgmt.php', game_create, err_funct, false);
				console.log(return_val);
			}
			else {
				alert("A description is necessary. Going back to the lobby...");
				document.location = 'lobby.html';
			}

			var this_game = 'op=14&game_id=' + this.game_id;
			var make_cards = this.ajax('cards_mgmt.php', this_game, err_funct, false);
			console.log(make_cards);

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
		var z_pos = card.style.zIndex;

		//AJAX
		var var_string = "op=1&game_id=" + this.game_id + "&cid=" + card_idx + "&pid=" + player.player_id + "&x_pos=" + x_pos + "&y_pos=" + y_pos + "&z_pos=" + z_pos;
		var ajax_obj = this.ajax("cards_mgmt.php", var_string, empty_funct, true);
		//console.log(ajax_obj.responseText);
	}
	
	//Stop transmitting the current position of the card.
	this.stop_send = function(card_idx)
	{
		clearInterval(this.send_update_timer);
	}
	
	this.flipdb = function(card_idx, flip_val)
	{
		var var_string = "op=6&pid="+ player.player_id +"&card_id=" + card_idx + "&game_id=" + this.game_id + "&flipped=" + flip_val;
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
	
	
	this.st_add_hand_db = function(card_idx)
	{
		var var_string = 'op=9&game_id=' + this.game_id + '&card_id=' + card_idx + "&player_id=" + player.player_id;
		console.log(var_string);
		var ajax_obj = network.ajax('cards_mgmt.php', var_string, this.fin_add_hand_db, false);
	
		try {
			var ret_val = JSON.parse(ajax_obj.responseText);
		} catch (e) {
			console.log("Parsing error:", e);
		}
		
		console.log("fin_add_hand_db result: ", ret_val.result);
		return ret_val.result;
	}

	//Changes the in_hand field in the database to the global
	//	in_hand value (0), meaning it's on the table. Also 
	//	Sets the x position of the card accordingly, releases locks
	//	and updates the last_update field.
	this.rmv_hand_db = function(card_idx, x_pos, y_pos)
	{
		var var_string = 'op=12&game_id=' + this.game_id + '&card_id=' + card_idx + "&player_id=" + player.player_id + "&x_pos=" + x_pos + "&y_pos=" + y_pos;
		console.log(var_string);
		var ajax_obj = network.ajax('cards_mgmt.php', var_string, this.fin_add_hand_db, false);

		try {
			var ret_val = JSON.parse(ajax_obj.responseText);
		} catch (e) {
			console.log("Parsing error:", e);
		}
		
		console.log("rmv_hand_db result: ", ret_val.result);
		return ret_val.result;
	}
	
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