console.log("attached player class.");

//player_class
function mk_player()//
{
    this.player_id;
    this.username = "Joe";
    this.ishost;
    this.hand = new Array();
	this.next_hand_pos_x = 50;

    /*this.add_all = function()
    {
        for(card_idx in select.selected_cards){
            //add to hand array
            hand[card_idx] = card_idx;

            //Actually move
            this.addhand(card_idx);
        }
    }*/
	
    this.add_sel_hand = function()
    {
        console.log("Adding selected cards to hand.");
	for(card_idx in select.selected_cards){
            //add to hand array
            hand[card_idx] = card_idx;

            //Actually move
            this.add_hand(card_idx);
        }
    }

    this.add_hand = function(card_idx)
    {
        //Remove the div from the table and place in hand, if possible.
	if (network.st_add_hand_db(card_idx) == "0"){
		console.log("Adding ", card_idx, " to hand");
		this.hand[card_idx] = card_idx;
		//Update card's in_hand in database
		//Deselect cards
		select.selected_cards.splice(card_idx, 1);
		select.remove_lock(card_idx);
	}
    }
    //places card in hand.
    this.rmv_hand = function()
    {}
    //puts card from hand on table.

    this.arrange_hand = function()
    {}
    //sorts the cards by suit and by number
}