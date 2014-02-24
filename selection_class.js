
function mk_selection()
{
	this.grabbed_card;
	this.selected_cards = new Array();

	this.grab_card = function(card_idx)
	{
		var got_lock = this.secure_lock(card_idx);
		console.log("Got lock returned: " + got_lock + " in grab_card().");
		if (got_lock == 1){
			//The user is permitted to move it
			card_array[card_idx].set_selected(1);
			
			//Ignore this card's updates
			this.grabbed_card = card_idx;
			this.selected_cards[card_idx] = card_idx;

			card_array[card_idx].set_drag(1);

			//Set the timer interval
			network.send_update_timer = setInterval("network._send_pos(" + '"' + card_idx + '"' +");", network.send_update_interval);
		} else {
			//Ensure the user cannot move it
			//card_array[card_idx].set_drag(0);
		}
		
	}

	//Will remove the user's lock on the currently selected card
	//Preconditions: This user must have a lock on a certain card.
	this.remove_lock = function(card_idx)
	{
		var var_string =  "op=5&player_id=" + player_id + "&card_id=" + card_idx + "&game_id=" + network.game_id;
		var ajax_obj = network.ajax("cards_mgmt.php", var_string, err_funct, false);
		var ajax_obj = JSON.parse(ajax_obj.responseText);
		
		if ((+ajax_obj) == 0){
			console.log("We have lock release failures!");
		}else{
			this.grabbed_card = "";
			this.selected_cards.splice(card_idx, 1);
		}
	}

	/*Removes all of the client's locks in the database, database sends back the card
	ids of all cards selected. Then removes all of the selection borders.*/
	this.release_all_locks = function()
	{
		var var_string = 'op=7&game_id=' + network.game_id + "&player_id=" + player_id;
		var result = network.ajax('cards_mgmt.php', var_string, err_funct, false);
		
		var cards = JSON.parse(result.responseText);
		for(card_idx in cards){
			card_array[cards[card_idx].cid].set_selected(0);
			this.selected_cards.splice(cards[card_idx].cid, 1);
		}
	}

	/*Requests the server to place a lock. Returns whether it was a successful lock or not.
	A 1 indicates success.*/
	this.secure_lock = function (card_idx)
	{
		var var_string = "op=4&player_id=" + player_id + "&card_id=" + card_idx + "&game_id=" + network.game_id;
		
		var ajax_obj = network.ajax("cards_mgmt.php", var_string, err_funct, false);
		var ajax_obj = JSON.parse(ajax_obj.responseText);
		return (+ajax_obj);
	}
}