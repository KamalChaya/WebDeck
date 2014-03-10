//test_player_class
console.log("Attached hand_tests.js");
var test_hand_num = 0;

function test_hand_harness()
{	
	switch(test_hand_num){
		case 0:
			console.log("Removing network update functionality. Complete all tests to reinstantiate board updates.");
			clearInterval(network.board_update_timer);
			test_add_hand();
			break;
		case 1:
			test_add_sel();
			break;
		case 2:
			test_remove_sel();
			break;
		
		case 3:
			test_hand_refresh();
			break;
		
		case 4:
			test_rmv_not_in_hand();
			break;
		
		case 5:
			test_already_in_hand();
			break;
		
		default:
			console.log("Tests Complete. Reinstantiating board update functionality.");
			network.board_update_timer = setInterval(function(){network.begin_board_update()}, network.board_update_interval);
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


//precondition: 5 of spades should not be in player's hand
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


//test remove selected
//Description: Will grab everything in your hand and remove it.
//Preconditions: Cards in your hand are deselected initially.
function test_remove_sel()
{
	for (card_idx in player.hand){
		if (hand[card_idx]){
			select.grab_card(card_idx);
			select.ungrab_card(card_idx);
		}
	}
	
	console.log("Moving all cards in hand to the board.");
	player.rmv_sel_hand();
	console.log("Ensure that all cards in the hand were put just above the hand.");
	console.log("Verify that all cards have left the player's hand.");
	console.log("Verify that said cards appear on another player's screen.");
	console.log("Verify that the cards are unlocked in the database.");
}



//Adding a card that is already in your hand
//Preconditions: No cards are in one's hand. Nobody
//	is holding the king of spades.
function test_already_in_hand()
{
	//Remove everything
	console.log("Start up another interface and ensure the interfaces are synced.");
	select.release_locks();
	
	//Grab king of spades
	select.grab_card("KS");
	card_array['KS'].set_position(200,200);
	network._send_pos("KS");
	select.ungrab_card("KS");
	
	//Add to hand
	console.log("Adding King of spades to hand");
	player.add_sel_hand();
	
	//Select and add the card again
	console.log("Adding King of Spades to hand again.");
	select.grab_card("KS");
	player.add_sel_hand();
	
	console.log("Verify that the card is still in the user's hand and not on the table of any other interface.");
	console.log("Verify that the card is unlocked in the database (locked = -1).");
	console.log("Verify that the card is still owned by user ", player.player_id, " in the database.");
	console.log("Visually verify that there is no border around the card and that it is selectable.");
}

//refeshing the page.
//Preconditions: No cards are selected.
function test_hand_refresh()
{
	console.log("Testing page refreshing with respect to the hand.");
	
	//Grab king of spades
	select.grab_card("KS");
	card_array['KS'].set_position(200,200);
	network._send_pos("KS");
	select.ungrab_card("KS");
	
	console.log("Adding king of spades to hand.");
	player.add_sel_hand();
	
	//Refresh the page.
	window.location.reload();
	
	//Verify that the king of spades is still in your hand
	console.log("Verify that the King of Spades appears in your hand.");
	console.log("Please remove the king of spades from your hand for the next test.");
}

//Try to remove a card that is not in your hand
//Preconditions: The King of Spades is not in your hand,
//	And you have no cards selected.
function test_rmv_not_in_hand()
{
	console.log("Selecting King of Spades");
	select.grab_card("KS");
	
	console.log("Removing selected cards from hand.");
	player.rmv_sel_hand();
	
	console.log("Verify that the King of Spades is still on the table and is still selected.");
	console.log("Verify in the database that the King of Spades is still locked to ", player.player_id, " and that it has an in_hand of 0");
}