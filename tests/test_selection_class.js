console.log("Attached test_selection_class.js");
var test_select_num = 0;

function test_select_harness()
{
	switch(test_select_num){
		case 0:
			select.grab_card("KS");
			card_array['KS'].set_position(200,280);
			network._send_pos("KS");
			network.flipdb('KS', 1);
			select.ungrab_card("KS");	
			select.release_locks();		
			console.log("Ensure that nobody has the King of Spades selected. Press 'Test Select' again");			
			break;
			
		case 1:			
			test_grab_card();
			console.log("Do not tamper with the King of Spades.");
			break;
		
		case 2:
			test_ungrab();
			console.log("Do not tamper with the King of Spades.");
			break;
			
		case 3:
			test_secure_lock1();
			console.log("In the database game_id=", network.game_id, ", change the Ace of Diamonds to be locked by someone other than this player: ", player.player_id);
			break;
			
		case 4:
			test_secure_lock2();
			select.grab_card("QH");
			card_array['QH'].set_position(280,280);
			network._send_pos("QH");
			network.flipdb('QH', 1);
			select.ungrab_card("QH");	
			select.release_locks();				
			console.log("Ensure that the Queen of Hearts is unlocked in the database.");
			break;
		
		case 5:
			test_secure_lock3();
			break;
			
		case 6:
			console.log("Selecting the Queen of Hearts and the King of Spades. Press 'Test Select' when ready.");	
			select.grab_card['QH'];
			select.ungrab_card['QH'];
			select.grab_card['KS'];
			select.ungrab_card['KS'];
			break;
			
		case 7:
			test_release_locks();
			break;
		
	}
	
	test_select_num++;
}

function test_grab_card()
{
	select.grab_card("KS");
	if(select.grabbed_card == "KS"){
		console.log("Grabbed_card in selection class is initialized properly. PASS");
	}
	
	if(select.selected_cards["KS"] == "KS"){
		console.log("Card is in selected array. PASS");
		
	} else {
		console.log("Not in selected array. FAIL");
	}
	
	console.log("Verify that a blue border is around the card.");
	console.log("Verify that the King of Spades is locked to" , player.player_id, " in the database");
}

function test_ungrab()
{
	console.log("Ungrabbing the King of Spades.");
	
	select.ungrab_card("KS");
	
	if (select.grabbed_card == "KS"){
		console.log("FAIL: The King of Spades is still the registered card.");
	} else {
		console.log("PASS: The King of Spades is no longer the card in grabbed_card");
	}
}

function test_secure_lock1()
{		
	//case 1: we already own it
	console.log("Trying to obtain a lock that we already own for the King of Spades.");
	select.grab_card("KS");
	var ret = select.secure_lock("KS");
	if (ret == 2){
		console.log("Database verified our ownership. PASS.");
	} else {
		console.log("Database did not verify our ownership. FAIL");
	}
	
	select.ungrab_card("KS");
}

function test_secure_lock2()
{
	//case 2: somebody else owns it
	console.log("This test assumes that the Ace of Diamonds is owned by someone other than the user.");
	ret = select.secure_lock("AD");
	if (ret == 0){
		console.log("Database verifies that someone else owns the Ace of Diamonds. PASS");
	} else {
		console.log("Managed to move the ace of diamonds. FAIL!");
	}
}

function test_secure_lock3()
{
	//case 3: nobody owns it
	console.log("This test assumes that nobody owns the Queen of Hearts.");
	ret = select.secure_lock("QH");
	if (ret == 1){
		console.log("Database granted us the lock. PASS.");
	} else {
		console.log("Database did not grant us lock. FAIL.");
	}
}

function test_release_locks()
{	
	console.log("Deselecting all cards.");
	select.release_locks();
	
	console.log("Verify that the Queen of Hearts and the King of Spades have no border.");
	console.log("Verify that both cards have locked = -1 in the database. game_id: ", network.game_id);
}
