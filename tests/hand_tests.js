//test_player_class

function test_add_all()
{
    //Ensure cards are now in the hand array
    var failed = 0;
    for (card_idx in select.selected_cards){
        if(!player.hand[card_idx]){
            failed = 1;
            console.log(card_idx, "not in hand array");
            break;
        }
    }
    if (!failed){
        console.log("All cards in hand array");
    }

   
}