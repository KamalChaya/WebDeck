console.log("attached player class.");

//player_class
/* Hand Conditions: When a card is in your hand
 * 	1. It is not transmitting its position
 *	2. It is initially unlocked and unselected
 *	3. When replaced on the table, it is also unlocked and unselected.
 */
function mk_player()//
{
	this.player_id;
	this.username = "Joe";	//Default
	this.ishost;			//Defines host capabilities.
	this.hand = new Array();	//Card ids in the hand. value=undefined implies the card was once in hand.
	this.next_hand_pos_x = 50;	//The x_position of a newly added card in hand.
	this.reinst_y = 350;
	
	//Adds all selected cards to a player's hand
	this.add_sel_hand = function()
	{
		console.log("Adding selected cards to hand.");
		//Stop any sending
		network.stop_send("");
	    
		for(card_idx in select.selected_cards){
			//add to hand array
			hand[card_idx] = card_idx;
		
			//Actually move
			this.add_hand(card_idx);
		}
		
		this.next_hand_pos_x = 50;
		console.log("Printing remaining cards in select:");
		for(card_idx in select.selected_cards){
			console.log(card_idx);
		}
	}
	
	//Moves a card to the player's hand. It is unlocked
	//	and unselected once in the hand.
	//Preconditions: Cards are on table and none are sending.
	this.add_hand = function(card_idx)
	{
		//Remove the div from the table and place in hand, if possible.
		if (network.st_add_hand_db(card_idx) == "0"){
			console.log("Adding ", card_idx, " to hand");
			this.hand[card_idx] = card_idx;
		
			//Deselect cards
			delete select.selected_cards[card_idx];
			select.remove_lock(card_idx);
			card_array[card_idx].set_selected(0);
		
			//Place card in hard:
			card_array[card_idx].move_to_hand();
			card_array[card_idx].set_position(this.next_hand_pos_x, 50);
			this.next_hand_pos_x += 20;
		
		} else {
			console.log("Could not add " + card_idx + " to hand in database.");
		}
	}
	
	//Removes all selected cards in one's hand
	this.rmv_sel_hand = function()
	{
		select.grabbed_card = "";
		for (card_idx in select.selected_cards){
			if (select.selected_cards[card_idx] != undefined){
				console.log("Removing " + card_idx + " from hand.");
				this.rmv_hand(card_idx, this.next_hand_pos_x, this.reinst_y);
				this.next_hand_pos_x += 40;
			}
		}
		
		this.next_hand_pos_x = 50;
	}
    
	//Removes card from one's hand and places
	//	it one the table unlocked and unowned.
	this.rmv_hand = function(card_idx, x_pos, y_pos)
	{
		//Update the database: handles new positions, locked values and in_hand
		if (network.rmv_hand_db(card_idx, x_pos, y_pos) == "0"){
			//Remove the card from the hand
			delete this.hand[card_idx];
			delete select.selected_cards[card_idx];
			
			//Remove the div
			card_array[card_idx].remove_card();
			
			//Put the div back on the table
			card_array[card_idx].reinst_card();
			
			//A little reformatting
			card_array[card_idx].set_selected(0);
			card_array[card_idx].set_position(x_pos, y_pos);
		}
	}

	this.arrange_hand = function()
	{}
	//sorts the cards by suit and by number
}