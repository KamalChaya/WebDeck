console.log("attached player class.");

//player_class
function mk_player()//
{
    this.player_id;
    this.username = "Joe";
    this.ishost;
    this.hand = new Array();
	this.next_hand_pos_x = 50;

    this.add_all = function()
    {
        for(card_idx in select.selected_cards){
            //add to hand array
            hand[card_idx] = card_idx;

            //Actually move
            this.addhand(card_idx);
        }
    }

    this.addhand = function(card_idx)
    {
        //Remove the div from the table and place in hand
        //Update card's in_hand in database
        //Deselect cards
    }
    //places card in hand.
    this.rmvhand = function(){}
    //puts card from hand on table.

    this.arrangehand = function(){}
    //sorts the cards by suit and by number
}