//test_player_class
//All of these tests, like all others, print their expectations to the console.

console.log("Attached hand_tests.js");
var test_hand_num = 0;

function test_hand_harness()
{	
	switch(test_hand_num % 6){
		case 0: 
			select.grab_card("5S");
			network.flipdb('5S', 1);
			card_array['5S'].set_position(200,200);
			network._send_pos("5S");
			select.ungrab_card("5S");
			select.release_locks();
			console.log("Verify that the five of spades is on the table and deselected.");
			console.log("Open another instance of the UI and place it where it's visible.");
			break;
					
		case 1:
			test_add_hand();
			break;
			
		case 2:
			test_rmv_hand();
			console.log("Select an arbitrary set of cards and press the 'Test Hand' button again.");			
			break;
			
		case 3:
			test_add_sel();
			console.log("Please select an arbitrary number of cards in your hand for removal and press 'Test Hand'.");
			break;
			
		case 4:
			test_remove_sel();
			break;
		
		case 5:
			test_rmv_not_in_hand();
			break;
		
		case 6:
			test_already_in_hand();
			console.log("The next test will refresh the page to ensure cards remain in hands. Be prepared.");
			break;
			
		case 7:
			test_hand_refresh();
			break;
		
	}
	
	test_hand_num++;
}

function test_add_hand() 
{
	select.grab_card("5S");
	select.ungrab_card("5S");
	player.add_hand("5S");

	if (player.hand["5S"]) {
		console.log("PASS: 5 of spades was successfully added to the player's hand array");
		
	} else {
		console.log("FAIL: 5 of spades was not successfully added to the player's hand array");
	}
	
	console.log("Verify that in the database that the in_hand value for 5 of spades is equal to the player's ID: " + player.player_id);
	console.log("Verify that for the five of spades locked = -1");
	
	//Verify that 5 of spades is not a selected card
	if (select.selected_cards.indexOf("5S") == -1) {
		console.log("PASS: the five of spades was successfully deselected in the selection class");
	}
	
	else {
		console.log("FAIL: the five of spades was not successfully deselected in the selection class");
	}
	
	console.log("Verify that the five of spades appears in the hand area, and that it has no border.");
	console.log("Verify that the five of spades no longer shows on the second interface.");
}

function test_rmv_hand()
{
	select.grab_card("5S");
	select.ungrab_card("5S");
	player.rmv_hand("5S");
	
	if (player.hand["5S"]){
		console.log("Fail: The card was not removed from the player's hand array.");
	} else {
		console.log("Pass: The card was remove from the player's hand array.");
	}
	
	if (select.selected_cards["5S"]){
		console.log("Fail: Did not remove card from selected_cards array in select object.");
	} else {
		console.log("Pass: the card is no longer considered selected by the selection object.");
	}
	
	console.log("Verify that the five of spades appears on the table (both screens) with no border");
}


function test_add_sel()
{
	player.add_sel_hand();
	
	console.log("Visually verify that the cards are now in your hand and do not appear on the second screen.");
	console.log("Verify that the cards are deselected.");
}

//test remove selected
//Description: Will grab everything in your hand and remove it.
//Preconditions: Cards in your hand are deselected initially.
function test_remove_sel()
{
	player.rmv_sel_hand();
	console.log("Ensure that all selected cards in the hand were put just above the hand div.");
	console.log("Verify that said cards appear on another player's screen.");
	console.log("Verify that the cards are unlocked and in_hand = 0 in the database.");
}



//Adding a card that is already in your hand
//Preconditions: No cards are in one's hand. Nobody
//	is holding the king of spades.
function test_already_in_hand()
{
	//Remove everything
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
	select.ungrab_card("KS");
	
	console.log("Removing selected cards from hand.");
	player.rmv_sel_hand();
	
	console.log("Verify that the King of Spades is still on the table and is still selected.");
	console.log("Verify in the database that the King of Spades is still locked to ", player.player_id, " and that it has an in_hand of 0");
}