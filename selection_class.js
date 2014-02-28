console.log("Included: selection_class.js");

function mk_selection()
{
	this.grabbed_card;
	this.selected_cards = new Array();

	/*If not already selected, gets lock for the card, 
	**changes the border, adds to grabbed and selected_cards
	**makes draggable, and changes setInterval to send changes
	**to the server.
	*/
	this.grab_card = function(card_idx)
	{
		var got_lock = this.secure_lock(card_idx);
		console.log("Got lock returned: " + got_lock + " in grab_card().");
		if (got_lock == 1){
			//The user is permitted to move it
			console.log("trying to border card");
			card_array[card_idx].set_selected(1);
			card_array[card_idx].select

			//Ignore this card's updates
			this.grabbed_card = card_idx;
			this.selected_cards[card_idx] = card_idx;

			card_array[card_idx].set_drag(1);

			//Set the timer interval
			network.send_update_timer = setInterval("network._send_pos(" + '"' + card_idx + '"' +");", network.send_update_interval);
		} else if (got_lock == 2) {
			this.grabbed_card = card_idx;
			network.send_update_timer = setInterval("network._send_pos(" + '"' + card_idx + '"' +");", network.send_update_interval);

			console.log("Already selected");
		} else {
			console.log("Someone else has it selected");
			//Ensure the user cannot move it
			//card_array[card_idx].set_drag(0);
		}
		
	}

	//Will remove the user's lock on the currently selected card
	//Preconditions: This user must have a lock on a certain card.
	this.remove_lock = function(card_idx)
	{
		var var_string =  "op=5&player_id=" + player.player_id + "&card_id=" + card_idx + "&game_id=" + this.game_id;
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
			this.selected_cards.splice(card_idx, 1);
		}
	}


	this.release_locks = function()
	{
		var var_string = 'op=7&game_id=' + network.game_id + "&player_id=" + player.player_id;
		var ajax_obj = network.ajax('cards_mgmt.php', var_string, err_funct, false);
		console.log(ajax_obj.responseText)
		try {
			var cards = JSON.parse(ajax_obj.responseText);
		} catch (e) {
			console.log("Parsing error:", e);
		}

		for(card_idx in cards.result){
			cur_card = cards.result[card_idx];
			card_array[cur_card.cid].set_selected(0);
			this.selected_cards.splice(cur_card.cid, 1);

		}
	}

	/*Requests the server to place a lock. Returns whether it was a successful lock or not.
	A 1 indicates success.*/
	this.secure_lock = function (card_idx)
	{
		var var_string = "op=4&player_id=" + player.player_id + "&card_id=" + card_idx + "&game_id=" + network.game_id;
		
		var ajax_obj = network.ajax("cards_mgmt.php", var_string, err_funct, false);
		//var ajax_obj = JSON.parse(ajax_obj.responseText);
		try {
			var board_state = JSON.parse(ajax_obj.responseText);
		} catch (e) {
			console.log("Parsing error:", '"', e, '"');
		}
		
		return (board_state.result);
		//return (+ajax_obj);
	}
}