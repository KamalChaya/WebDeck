console.log("Attached test_card.js");
var test_card_num = 0;

function test_all_card() {
	clearInterval(network.board_update_timer);
	clearInterval(network.send_update_timer);
	
	switch(test_card_num){
	case 0:
		test_network_init();
		break;

	case 1:
		select.grab_card("5H");
		test_set_position();
		select.ungrab_card("5H");
		select.release_locks();
		break;
		
	case 2:
		db_flip_1();
		break;
		
	case 3:
		db_flip_0();
		break;

	case 4: 
		test_remove_card();
		break;
		
	case 5:
		test_reinst_card();
		break;
	}
	
	test_card_num += 1;
	
}

//Will display the contents of the card array
//Will ensure that the card divs exist.
function test_network_init()
{
	console.log("Card Test 0: Testing Divs and Card_array index names.")
	var indices = "Expected format: 'key' -> div_exists\n\n";
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

function test_set_position() 
{
	console.log("Card Test 1: Testing set position.");
    var x;
    var y;
    card_array["5H"].set_position(400,100);
    network._send_pos("5H");

    x = document.getElementById("5H").offsetLeft;
    y = document.getElementById("5H").offsetTop;

    if (x == 400 && y == 100) 
    {
	console.log("Card Test 1: setpos() test passed: Five of Hearts has moved to (400,100)");
	console.log("Card Test 1: A card should have moved from the deck to the table.");
    } 
}

function db_flip_1() 
{
    console.log("Card Test 2: Flipping a card face up.");
    console.log("Card Test 2: Manually flip the card in another tab.");
    console.log("Card Test 2: The Five of Hearts should be face up.");
}

function db_flip_0() 
{
	console.log("Card Test 3: Flipping a card face down.");
	console.log("Card Test 3: Manually flip the card in another tab.")	
    console.log("Card Test 3: The Five of Hearts should be facedown again.");
}

function test_remove_card()
{
	console.log("Card Test 4: Removing the Five of Hearts from the table.");
	var div = document.getElementById("5H");
	if (!div){
		console.log("Please create the five of spades, it is not on the table");
		return;
	}
	console.log("Card Test 4: Ensuring the Five of Hearts is visible...");
	div.obj.set_z_idx(1000);

	console.log("Card Test 4: Removing the Five of Hearts.");
	div = document.getElementById("5H");
	div.obj.remove_card();
	
	if(document.getElementById("5H")){
		console.log("Card Test 4: FAILURE - Detected five of spades.");
	} else {
		console.log("Card Test 4: SUCCESS - Detected that five of spades is not on table.");
	}
	console.log("Card Test 4: Verify visually that the five of spades is gone from the table.");
	
}


function test_reinst_card()
{
	console.log("Card Test 5: Putting the card back on the table.");
	var div = document.getElementById("5H");
	if (div){
		console.log("Please delete the five of spades, it is on the table");
		return;
	}
	
	card_array['5H'].reinst_card();
	
	if (document.getElementById("5H")){
		console.log("Card Test 5: SUCCESS - Detected that the five of spades was reinstated!");
	} else {
		console.log("Card Test 5: FAILURE - Could not find the five of spacdes again.");
	}
}