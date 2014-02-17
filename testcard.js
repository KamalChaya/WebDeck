function test_all_card() {
    db_flip_card_test();
    test_set_position();
    test_set_drag();
    test_set_selected();
}

function db_flip_card_test()
{
    card_array["5S"].set_position(200,200);
    //set flip to 1, then waitt 3 secs and set it to 0
    db_flip_1();
    setTimeout(db_flip_0, 3000);
}

function db_flip_1() {
    alert("verify that 5 of spades flips face up");
    card_array["5S"].db_flip_card(1);
}

function db_flip_0() {
    alert("verify taht five of spades flips face down");
    card_array["5S"].db_flip_card(0);
}

function test_set_position() {
    var x;
    var y;
    card_array["5S"].set_position(200,200);

    x = document.getElementById("card5S").offsetLeft;
    y = document.getElementById("card5S").offsetTop;

    if (x == 200 && y == 200) 
    {
	alert("setpos() test passed");
    } 
}


function test_set_drag() {
    //move card out
    card_array["5S"].set_position(200,200);

    //test draggable values of 1 and 0 (0 tested 3 secs after 1)
    test_set_drag_1();
    setTimeout(test_set_drag_0, 10000);
}

function test_set_drag_1() {
    alert("verify that the five of spades card is draggable");
    card_array["5S"].set_drag(1);
}

function test_set_drag_0() {
    alert("verify that the five of spades card is not draggable"); 
    card_array["5S"].set_drag(0);
}

function test_set_selected() {
    //move card out
    card_array["5S"].set_position(200,200);
    test_set_selected_1();
    setTimeout(test_set_selected_0, 10000);
}

function test_set_selected_1() {
    alert("verify that there is a blue border on the five of spades card");
    card_array["5S"].set_selected(1);
}

function test_set_selected_0() {
    alert("verify that there is no border on the five of spades card");
    card_array["5S"].set_selected(0);
}
