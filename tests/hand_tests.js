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

/*
test cases:
test add
test remove
*/


//pre condition: 5 of spades should not be in player's hand
/*
Note: the indexOf function does not work in IE8, this shouldn't be too much 
of an issue as we are only using this to test
*/
function test_add_hand() {


	player.add_hand("5S");

	if (player.hand["5S"]) {
		console.log("PASS: 5 of spades was successfully added to the player's hand array");
		
	}
	
	else {
		console.log("FAIL: 5 of spades wasnt successfully added to the player's hand");
	}
	
	console.log("Verify that in the database that the in_hand value for 5 of spades is equal to the player's ID: " + player.player_id);
	console.log("Verify that for the five of spades, locked = -1");
	
	//Verify that 5 of spades is not a selected card
	if (select.selected_cards.indexOf("5S") == -1) {
		console.log("PASS: the five of spades was successfully deselected");
	}
	
	else {
		console.log("FAIL: the five of spades was not successfully deselected");
	}
	
	console.log("Verify that the five of spades appears in the hand area, and that it has no border.");
}



//test rmv hand
