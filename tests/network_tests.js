//console.log("network tests");

function network_tests()
{
	//Make sure nothing gets in the way of the tests
	clearInterval(network.board_update_timer);
	clearInterval(network.send_update_timer);
	
	//Run tests
	test_network_init();
	test_grab_card();
	
}

//Will display the contents of the card array
//Will ensure that the card divs exist.
function test_network_init()
{
	var indices = "Testing Divs and Card_array index names.\n";
	indices += "Expected format: 'key' -> div_exists\n\n";
	var i = 1;
	for (key in card_array){
		indices += "'" + key + "' ->";
		if (document.getElementById(key)){
			indices += " div_exists.\t";
		} else {
			indices += " div_does_not_exist.\t";
		}
		
		if (i % 4 == 0){
			indices += "\n";
		}
		
		i += 1;
	}
	
	console.log(indices);
}

function test_grab_2C(){
	console.log("Testing grab_card(): moving the two of clubs.");
	//Move the two cards
	card_array['2C'].set_position(250, 250);
	network.grab_card('2C');
	console.log("Sending 2C Active, \n\tCheck database position and locked: x=250, y=250, locked=" + network.player_id + "\n\tCheck that card has blue border\n\tCheck that the card is moveable.");
	console.log("Turning off send in 10 seconds, do not press the test button until you get the go-ahead");
	setTimeout("network.stop_send('2C'); console.log('update removed.');", 10000);
}

//Will move the 2 of clubs and send its position to the database
//Try something that has a lock and something that does not.
//Preconditions: card 2c is unlocked.
function test_grab_card()
{
	console.log("Testing grab_card(): move two cards (one locked-AH- and the other unlocked-2C-).");
	//Move the two cards
	card_array['2C'].set_position(250, 250);
	card_array['AH'].set_position(300, 250);
	
	//Test the first card
	network.grab_card('2C');
	console.log("Sending 2C Active, \n\tCheck database position and locked: x=250, y=250, locked=" + network.player_id + "\n\tCheck that card has blue border\n\tCheck that the card is moveable.");

	document.onkeydown = function(event)
	{
		if(event.keyCode == 13){
			//resume execution
			clearInterval(network.send_update_timer);
			console.log("Stopping 2C send. Move the card and ensure that the database is not updating.");
			
			network.grab_card('AH');
			console.log("Sending AH Active, \n\tcheck database position, should still be 0,0\n\tCheck that card has no border\n\t Check that the card is immoveable.");
		}
	}
}


function test_secure_lock()
{
	console.log("Securing lock for 2H");
	network.secure_lock("2H");
	console.log("Verify that the 2H card has locked = 1 in the database.");

	console.log("Attempting to secure lock on the ace of spades. It has locked=2 in the database");
	var res = network.secure_lock("AS");
	if(res){
		console.log("Return value true. Secured lock. FAILURE.");
	}else{
		console.log("Return value false! Lock not granted. Ensure locked still equals 2 in database.");
	}
}

function test_release_lock()
{
	console.log("Removing lock for 2H");
	network.remove_lock("2H");
	console.log("Ensure that the two of hearts has locked = -1 in the database.");
	
	console.log("Removing lock for the ace of spades, which we don't own");
	var res = network.remove_lock("AS");
	if(res){
		console.log("Released lock. FAILURE");
	}else{
		console.log("Could not release lock as expected. Verify locked = 2 for the ace of spades."); 
	}
	
	console.log("Removing lock for 2H again");
	res = network.remove_lock("2H");
	if(res){
		console.log("Released an already free lock. FAILURE");
	}else {
		console.log("Could not release lock as expected. Ensure that the two of hearts has locked = -1 in the database.");
	}
}