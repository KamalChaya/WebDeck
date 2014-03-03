console.log("Attached test_selection_class.js");
var test_select_num = 0;

function test_select_harness()
{
	switch(test_select_num){
		case 0:
			test_grab_card();
			break;
		
		case 1:
			test_secure_lock();
			break;
		
	}
	
	test_select_num++;
}

function test_grab_card()
{
	select.grab_card("KS");
	if(select.grabbed_card == "KS"){
		console.log("Grabbed card is initialized properly. PASS");
	}
	if(select.selected_cards["KS"] == "KS"){
		console.log("Card is in selected array. PASS");
	} else {
		console.log("Not in selected array. FAIL");
	}
	
	console.log("Verify that a blue border is around the card and that _send_pos is transmitting.");
}

function test_secure_lock()
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
	
	//case 2: somebody else owns it
	console.log("This test assumes that the Ace of Diamonds is owned by someone other than the user.");
	ret = select.secure_lock("AD");
	if (ret == 0){
		console.log("Database verifies that someone else owns the Ace of Diamonds. PASS");
	} else {
		console.log("Managed to move the ace of diamonds. FAIL!");
	}
	
	//case 3: nobody owns it
	console.log("This test assumes that nobody owns the Queen of Hearts.");
	ret = select.secure_lock("QH");
	if (ret == 1){
		console.log("Database granted us the lock. PASS.");
	} else {
		console.log("Database did not grant us lock. FAIL.");
	}
}
