//Player Class
console.log("attached player class.");

/* Hand Conditions: When a card is in your hand
 * 	1. It is not transmitting its position at any time
 *	2. It is initially unlocked and unselected
 *	3. When replaced on the table, it is also unlocked and unselected.
 */
function mk_player()
{
	this.player_id;
	this.username = "Joe";		//Default, overwritten in network class
	this.hand = new Array();	//Card ids in the hand. value=undefined implies the card was once in hand.
	this.next_hand_pos_x = 50;	//The to-be x_position of a newly added card in hand.
	this.reinst_y = 350;		//The to-be y-position of a card when placed on the table
	
	//Function: add_sel_hand()
	//Description: Adds all selected cards to a player's hand
	//	See selection_class.js for a definiton of "selected"
	//Parms: None
	//Preconditions: None really, the player may have any number
	//	of cards selected including 0
	//Returns: None
	this.add_sel_hand = function()
	{
		console.log("Adding selected cards to hand.");
		//Stop any sending
		network.stop_send("");
	    
		for(card_idx in select.selected_cards){
			if (select.selected_cards[card_idx]){
				//add to hand array
				hand[card_idx] = card_idx;
			
				//Actually move
				this.add_hand(card_idx);
			}
		}
		
		this.next_hand_pos_x = 50;
		console.log("Printing remaining cards in select:");
		for(card_idx in select.selected_cards){
			console.log(card_idx);
		}
	}
	
	//Function: add_hand()
	//Description: Moves a card to the player's hand. It is unlocked
	//	and unselected once in the hand.
	//Params: card_idx - The string index of a card e.g. "KS", "5C"
	//Preconditions: Cards are on table and none are sending.
	//Returns: Nothing
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
	
	//Function: rmv_sel_hand()
	//Description: Removes all selected cards in one's hand
	//Params: None
	//Preconditions: None. The user may have selected any number of
	//	cards from either their hand or the table. It will skip over cards
	//	on the table.
	//Returns: None
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
    
	//Function: rmv_hand()
	//Decsription: Removes card from one's hand and places
	//	it one the table unlocked and unowned.
	//Params: 	card_idx - The string index of a card e.g. "KS".
	//		x_pos - The x position to place the card at on the table.
	//		y_pos - The y position to place the card at on the table.
	//Preconditions: The card is in the user's hand
	//Returns: none
	this.rmv_hand = function(card_idx, x_pos, y_pos)
	{
		//Update the database: handles new positions, locked values and in_hand
		if (network.rmv_hand_db(card_idx, x_pos, y_pos) == "0"){
			//Remove the card from the hand
			delete this.hand[card_idx];
			delete select.selected_cards[card_idx];
			
			//Remove the div
			card_array[card_idx].remove_card();
		}
	}
}