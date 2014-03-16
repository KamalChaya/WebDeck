console.log("Included: selection_class.js");

/*****
//Selection Definition: A card is considered selected by the appearance
//	of a border around it (blue for the selector and red for other players)
//	and a locked value of the owner's player.player_id in the db.
//
//Grabbed Definition: A card is considered grabbed when it is both selected
//	and draggable. This card is currently being clicked on by the user and
//	should follow the mouse.
*****/

function mk_selection()
{
	this.grabbed_card;
	this.selected_cards = new Array();

	//Function: grab_card()
	//Description: If not already selected, gets lock for the card, 
	//	changes the border, adds to grabbed and selected_cards
	//	makes draggable, and changes setInterval to send changes
	//	to the server.
	//Params: card_idx - Again, the string index of the card in the card array
	//Preconditions: None, the game handles another user with the locked card.
	//Return: None
	this.grab_card = function(card_idx)
	{
		network.stop_send("");
		var got_lock = this.secure_lock(card_idx);
		//console.log("Got lock returned: " + got_lock + " in grab_card().");
		if (got_lock == 1){
			//The user is permitted to move it
			card_array[card_idx].set_selected(1);
			card_array[card_idx].select

			//Ignore this card's updates
			this.grabbed_card = card_idx;
			this.selected_cards[card_idx] = card_idx;

			card_array[card_idx].set_drag(1);

			//Set the timer interval
			if (!card_array[card_idx].card_div.in_hand){
				network.send_update_timer = setInterval("network._send_pos(" + '"' + card_idx + '"' +");", network.send_update_interval);
			}
		} else if (got_lock == 2) {
			card_array[card_idx].set_drag(1);
			this.grabbed_card = card_idx;
			
			if (!card_array[card_idx].card_div.in_hand){
				network.send_update_timer = setInterval("network._send_pos(" + '"' + card_idx + '"' +");", network.send_update_interval);
			}
			
			console.log("Already selected");
		} else {
			//Ensure the user cannot move it
			card_array[card_idx].set_drag(0);
		}
		
	}
	
	//Function: ungrab_card()
	//Description: Changes a card's state from grabbed to
	//	only selected. i.e. removes the dragging and db
	//	updating
	//Parameters: card_idx - the string index of the card in the
	//	global card array.
	//Postconditions: The card is no longer considered grabbed
	//	and is not transmitting its position.
	//Return: None
	this.ungrab_card = function(card_idx)
	{
		network.stop_send(this.id);
		this.grabbed_card = "";
	}
	
	//Function: secure_lock()
	//Description: Requests the server to place a lock.
	//	informs the caller whether the lock was successful.
	//Parameters: card_idx - the card to be locked.
	//	Global values also need to be set including network's
	// game_id and the player's player_id.
	//Return: whether the lock was obtained.
	//	A 1 indicates success. 2 indicates a player already
	//	had the lock. 0 indicates failure to obtain lock.
	this.secure_lock = function (card_idx)
	{
		var var_string = "op=4&player_id=" + player.player_id + "&card_id=" + card_idx + "&game_id=" + network.game_id;
		
		var ajax_obj = network.ajax("cards_mgmt.php", var_string, err_funct, false);
		try {
			var board_state = JSON.parse(ajax_obj.responseText);
		} catch (e) {
			console.log("Parsing error:", '"', e, '"');
		}
		
		return (board_state.result);
	}
	
	//Function: remove_lock()
	//Description: Will remove the user's lock on the 
	//	currently selected card.
	//Preconditions: This user must have a lock on this card.
	//Return: None.
	this.remove_lock = function(card_idx)
	{
		var var_string =  "op=5&player_id=" + player.player_id + "&card_id=" + card_idx + "&game_id=" + network.game_id;
		var ajax_obj = network.ajax("cards_mgmt.php", var_string, err_funct, false);
		
		try {
			var board_state = JSON.parse(ajax_obj.responseText);
		} catch (e) {
			console.log("Parsing error:", e);
		}
		
		if ((board_state.result) == 0){
			console.log("We have lock release failures!");
		} else {
			this.grabbed_card = "";
			delete this.selected_cards[card_idx];
		}
	}

	//Function: release_locks()
	//Description: Will free all locks on selected cards
	//	this implies that the cards are no longer selected.
	//Parameters: None
	//Preconditions: Called from global onclick event in init.js
	//Postconditions: All locks this player owns have been
	//	released.
	this.release_locks = function()
	{
		var var_string = 'op=7&game_id=' + network.game_id + "&player_id=" + player.player_id;
		var ajax_obj = network.ajax('cards_mgmt.php', var_string, err_funct, false);
		
		try {
			var cards = JSON.parse(ajax_obj.responseText);
		} catch (e) {
			console.log("Parsing error:", e);
		}


		for(card_idx in cards.result){
			cur_card = cards.result[card_idx];
			card_array[cur_card.cid].set_selected(0);
			delete this.selected_cards[cur_card.cid];
		}
	}
}