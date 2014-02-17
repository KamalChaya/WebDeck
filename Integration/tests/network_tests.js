//alert("network tests");

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
		if (document.getElementById("card" + key)){
			indices += " div_exists.\t";
		} else {
			indices += " div_does_not_exist.\t";
		}
		
		if (i % 4 == 0){
			indices += "\n";
		}
		
		i += 1;
	}
	
	alert(indices);
}

function test_grab_2C(){
	alert("Testing grab_card(): moving the two of clubs.");
	//Move the two cards
	card_array['2C'].set_position(250, 250);
	network.grab_card('2C');
	alert("Sending 2C Active, \n\tCheck database position and locked: x=250, y=250, locked=" + network.player_id + "\n\tCheck that card has blue border\n\tCheck that the card is moveable.");
	alert("Turning off send in 10 seconds, do not press the test button until you get the go-ahead");
	alert("Hi Jonathan!");
	setTimeout("network.stop_send('2C'); alert('update removed.');", 10000);
	alert("Hi Jackson!");
}

//Will move the 2 of clubs and send its position to the database
//Try something that has a lock and something that does not.
//Preconditions: card 2c is unlocked.
function test_grab_card()
{
	alert("Testing grab_card(): move two cards (one locked-AH- and the other unlocked-2C-).");
	//Move the two cards
	card_array['2C'].set_position(250, 250);
	card_array['AH'].set_position(300, 250);
	
	//Test the first card
	network.grab_card('2C');
	alert("Sending 2C Active, \n\tCheck database position and locked: x=250, y=250, locked=" + network.player_id + "\n\tCheck that card has blue border\n\tCheck that the card is moveable.");

	document.onkeydown = function(event)
	{
		if(event.keyCode == 13){
			//resume execution
			clearInterval(network.send_update_timer);
			alert("Stopping 2C send. Move the card and ensure that the database is not updating.");
			
			network.grab_card('AH');
			alert("Sending AH Active, \n\tcheck database position, should still be 0,0\n\tCheck that card has no border\n\t Check that the card is immoveable.");
		}
	}
}