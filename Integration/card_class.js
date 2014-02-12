//Function: card()
//Description: This is the constructor for the card object
//Parameters: Letter: the alphanumeric character to display on the card
//		Num: the numeric value of the card


function card(fname, id)
{
	//Members
	this.id = id;
	this.card_id = "card" + this.id;		//The id of the div that contains this card
	this.front = 'card_fronts/' + fname;
	this.back = "card_backs/Blue_Back.svg";
	this.image = this.back;
	this.imgid = this.card_id + "_img";
	this.select = 0;					//The id of the user that has this card selected. -1 is no owner

	//Methods
	//??Why do we use "card" + this.id, why not use this.card_id?
	//?? Look up jquery event.which. It normalizes event.button between browsers, but requires
	//	new JS library
	//It's easier to just manage all the clicking events here.
	//	Right click: event.button == 2: Flip Card
	//	Left click: event.button == 1: Select and begin transmission if possible.
	this.handle_click = function (event)
	{
		if(event.button == 2) {
			//Right click
			if (this.image == this.front){
				if((+network.flipdb(this.id, 0)) == 1){
					this.image = this.back;
				}
			} else {
				if((+network.flipdb(this.id, 1)) == 1){
					this.image = this.front;
				}
				
			}
			document.getElementById("card" + this.id + "_img").src = this.image;
			
		} else if (event.button == 0) {
			//left click
			network.send_card_pos(this.id);
			
		}
	}
	
	this.handle_release = function (event)
	{
		if(event.button == 2) {
			//Do nothing, the card is flipped.
		} else if (event.button == 0) {
			//Release the card
			network.stop_send(this.id);
		}
	}
	
	//We want an auto-flipping mechanism for database response. This is it
	//	flipped = 1 ---> show the front of the card.
	this.db_flip_card = function(flipped)
	{
		if (flipped == 1){
			this.image = this.front;
			//flipdb(0)
		} else {
			this.image = this.back;
			//flipdb(1)
		}
		document.getElementById("card" + this.id + "_img").src = this.image;
	}
	
	this.select_card = function()
	{
		if (this.select == -1){
			//User can select this card
			var got_lock = network.get_lock(card_id);
			if(got_lock == 1){
				//We got the lock, highlight the card
			} else{
				//No lock, don't highlight the card.
			}
		} else {
			//Do nothing.
		}
	}
	
	this.bring_to_top = function() 
	{
		$('#' + this.card_id).css('position', 'absolute');
		$('#' + this.card_id).css('z-index', top_z);
		top_z = top_z + 1;
	}

	this.set_position = function (x_pos, y_pos)
	{
		$('#' + this.card_id).css('position', 'absolute');
		$('#' + this.card_id).css('top', x_pos);
		$('#' + this.card_id).css('left', y_pos);
	}
	
	//draggable: 1 to make the card draggable, 0 to make it not draggable
	this.set_drag = function(draggable)
	{
		if (draggable == 1){
			$('#' + this.card_id).draggable({containment: '#container'});
		} else {
			$('#' + this.card_id).draggable("disable");
		}
	}
	
	//If selected, a black border is drawn around the card
	//	If another player selected it, it gets a red border.
	this.set_selected = function(selected)
	{
		if (selected == 1){
			document.getElementById(this.card_id).style.border = "2px solid blue";
		} else if(selected == 0) {
			document.getElementById(this.card_id).style.border = "0px solid black";
		} else if(selected == -1){
			//alert("Here");
			document.getElementById(this.card_id).style.border = "2px solid red";
		}
	}

	//Constructor
	//alert("Constructor called: fname " + fname + " id: " + id);
	var cont_div = document.getElementById('container');
	var card_div = "<div id = '" + this.card_id + "' class = 'card2 ' onmousedown = 'card_array[" +'"'+ id + '"' + "].handle_click(event); card_array[" + '"' + id + '"' + "].bring_to_top();' onmouseup = 'card_array[" + '"' + id + '"' + "].handle_release(event);'>";
	card_div += "<image id = '" + this.imgid + "' src='" + this.image +"' alt=''>";
	card_div += "</div>";
	//alert(card_div);
	cont_div.innerHTML += card_div;
	//card_array.push(this);
	card_array[id] = this;	//This links the id of the card to its position in the card array
	//alert(card_array[id].id);
	this.set_position(10, 10);
}

