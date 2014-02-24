console.log("Attached test_selection_class.js");

function test_grab_card()
{
	select.grab_card("KS");
	if(select.grabbed_card == "KS"){
		console.log("Gabbed card is initialized properly");
	}
	if(select.selected_cards["KS"] == "KS"){
		console.log("Card is in selected array");
	} else {
		console.log("Not in selected array");
	}
}

function test_secure_lock()
{
	//case 1 we already own it
	select.grab_card("KS");
	select.secure_lock("KS");
}

function test_double_grab()
{
	console.log("Grabbing KS once");
	select.grab_card("KS");
	console.log("Grabbing KS twice");
	select.grab_card("KS");
}