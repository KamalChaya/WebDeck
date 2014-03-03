console.log("Attached test_card.js");
var test_card_num = 0;

function test_all_card() {
	clearInterval(network.board_update_timer);
	clearInterval(network.send_update_timer);
	
	switch(test_card_num){
	case 0:
		test_set_position();
		break;
		
	case 1:
		db_flip_1();
		break;
		
	case 2:
		db_flip_0();
		break;
	case 3:
		test_set_position();
		break;
		
	case 4:
		test_set_drag();
		break;
		
	case 5:
		test_set_selected();
		break;
		
	case 6:
		test_network_init();
		break;
		
	//case 7:
		//test_grab_2C();
		//break;
	//case 7:
	//	test_grab_AH();
	//	break;
		
	case 7: 
		test_remove_card();
		break;
		
	case 8:
		test_reinst_card();
		break;
	}
	
	test_card_num += 1;
	
}

function db_flip_card_test()
{
    card_array["5S"].set_position(200,200);
    //set flip to 1, then waitt 3 secs and set it to 0
    db_flip_1();
    setTimeout(db_flip_0, 3000);
}

function db_flip_1() 
{
    console.log("verify that 5 of spades flips face up");
    card_array["5S"].db_flip_card(1);
}

function db_flip_0() 
{
    console.log("verify that five of spades flips face down");
    card_array["5S"].db_flip_card(0);
}

function test_set_position() 
{
    var x;
    var y;
    card_array["5S"].set_position(200,200);

    x = document.getElementById("5S").offsetLeft;
    y = document.getElementById("5S").offsetTop;

    if (x == 200 && y == 200) 
    {
	console.log("setpos() test passed: five of spades has moved to (200,200)");
    } 
}


function test_set_drag() 
{
    //move card out
    card_array["5S"].set_position(200,200);

    //test draggable values of 1 and 0 (0 tested 3 secs after 1)
    test_set_drag_1();
    setTimeout(test_set_drag_0, 10000);
}

function test_set_drag_1() 
{
    console.log("verify that the five of spades card is draggable");
    card_array["5S"].set_drag(1);
}

function test_set_drag_0() 
{
    console.log("verify that the five of spades card is not draggable"); 
    card_array["5S"].set_drag(0);
}

function test_set_selected() 
{
    //move card out
    card_array["5S"].set_position(200,200);
    test_set_selected_1();
    setTimeout(test_set_selected_0, 10000);
}

function test_set_selected_1() 
{
    console.log("verify that there is a blue border on the five of spades card");
    card_array["5S"].set_selected(1);
}

function test_set_selected_0() 
{
    console.log("verify that there is no border on the five of spades card");
    card_array["5S"].set_selected(0);
}

function test_remove_card()
{
	var div = document.getElementById("5S");
	if (!div){
		console.log("Please create the five of spades, it is not on the table");
		return;
	}
	div.obj.set_z_idx(1000);
	console.log("Ensure that the five of spades is onthe top of the page.")
	console.log("Removing the five of spades.");
	
	div = document.getElementById("5S");
	div.obj.remove_card();
	
	if(document.getElementById("5S")){
		console.log("Detected five of spades. Test failed.");
	} else {
		console.log("Detected that five of spades is not on table. PASS.");
	}
	console.log("Verify visually that the five of spades is gone from the table.");
	
}


function test_reinst_card()
{
	var div = document.getElementById("5S");
	if (div){
		console.log("Please delete the five of spades, it is on the table");
		return;
	}
	
	card_array['5S'].reinst_card();
	
	if (document.getElementById("5S")){
		console.log("Detected that the five of spades was reinstated! Pass.");
	} else {
		console.log("Could not find the five of spacdes again. FAIL");
	}
}