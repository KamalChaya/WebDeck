//test_player_class
console.log("Attached hand_tests.js");
var test_hand_num = 0;

function test_hand_harness()
{
	switch(test_hand_num){
		case 0:
			test_add_hand();
			break;
		case 1:
			test_add_sel();
			break;
	}
	
	test_hand_num++;
}

function test_add_sel()
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
function test_add_hand() 
{
	select.grab_card("5S");
	player.add_hand("5S");

	if (player.hand["5S"]) {
		console.log("PASS: 5 of spades was successfully added to the player's hand array");
		
	} else {
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
	
	console.log("To Do: Verify that the five of spades appears in the hand area, and that it has no border.");
}



//test rmv hand


//test remove selected
//Description: Will grab everything in your hand and remove it.
//Preconditions: Cards in your hand are deselected initially.
function test_remove_sel()
{
	for (card_idx in player.hand){
		select.grab_card(card_idx);
		select.ungrab_card(card_idx);
	}
	
	console.log("Moving all cards in hand to the board.");
	player.rmv_sel();
	console.log("Ensure that all cards in the hand were put just above the hand.");
	console.log("Verify that all cards have left the player's hand.");
	console.log("Verify that said cards appear on another player's screen.");
	console.log("Verify that the cards are unlocked in the database.");
}



//Adding a card that i already in your hand

//rerfeshing the page.