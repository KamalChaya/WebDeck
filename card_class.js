console.log("Attached card_class");
//Function: card()
//Description: This is the constructor for the card object
//Parameters: Id - the alphanumeric characters
//		that correspond to the card's index in the card_array
function card(id)
{
	//Members
	this.id = id;
	this.card_id = id;									//The id of the div that contains this card
	this.front = 'card_fronts/' + id + ".svg";
	this.back = "card_backs/Blue_Back.svg";
	this.image = this.back;
	this.imgid = this.card_id + "_img";
	this.select = 0;

	//Methods
	
	//Function: handle_click()
	//Description: is the central handler for a card
	//		click. Manages activities from flipping the card
	//		(right click) to grabbing the card (left click)
	//Parameters: event - The JS event object for the click.
	//Preconditions: The user has clicked on a card div.
	//Returns: none.
	this.handle_click = function (event)
	{
		if(event.button == 2) {
			//Right click
			card = this.obj;
			
			if (card.image == card.front){
				if((network.flipdb(card.id, 0).result) == 1){
					card.image = card.back;
					this.imgdiv.src = card.back;
				}
			} else {
				if((network.flipdb(card.id, 1).result) == 1){
					card.image = card.front;
					this.imgdiv.src = card.front;
				}
				
			}
			
		} else if (event.button == 0) {
			//left click
			select.grab_card(this.id);
		}
	}
	
	//Function: handle_release()
	//Description: Corrolary to handle_click()
	//		unclicking a card does not change flipping
	//		but does change whether its grabbed.
	//Parameters: event - The JS event object for the release.
	//Preconditions: The card has been previously clicked.
	//Returns: None
	this.handle_release = function (event)
	{
		if(event.button == 2) {
			//Do nothing, the card is flipped.
			
		} else if (event.button == 0) {
			//Release the card
			select.ungrab_card(this.id);
		}
	}
	
	//Function:db_flip_card()
	//Description: If a card's flipped state in the database
	//		changes, network.update_board will need a way to flip the
	//		card without retriggering the event. This is that function.
	//Parameters: flipped - an integer value from Cards->flipped in the 
	//		database. 1 - face up.   0 - face down.
	//Preconditions: The card div exists.
	//Return:None
	this.db_flip_card = function(flipped)
	{
		if (flipped == 1){
			this.image = this.front;
			
		} else {
			this.image = this.back;
			
		}
		
		document.getElementById(this.id + "_img").src = this.image;
	}
	
	//Function: bring_to_top()
	//Description: When a card is manipulated on the 
	//		client's interface, this function brings it to 
	//		the foreground of the page. 
	//Parameters: none, this is called on the div in this
	//		card object.
	//Preconditions: The card is on the page and was just
	//		clicked on.
	//Postconditions: top_z now contains the next highest z_index.
	//Return: none
	this.bring_to_top = function()
	{
		$('#' + this.card_id).css('position', 'absolute');
		this.style.zIndex = "" + top_z;
		

		top_z = top_z + 1;
		console.log("top_z" + top_z);
	}
	
	//Function: set_z_idx()
	//Description: A corolarry to the bring_to_top()
	//		function in the same manner as db_flip_card():
	//		allows the database to set the z_index of the card.
	//Parameters: new_z - The string z index of the card
	//Preconditions: The card div exists on the page.
	//Return: none.
	this.set_z_idx = function(new_z)
	{
		this.card_div.style.zIndex = new_z;
	}
	
	//Function: set_position()
	//Description: Changes the x and y coordinates of
	//		the card.
	//Parameters: x_pos, y_pos - The coordinates (in pixels) of
	//		then card. In string form.
	//Preconditions: The database has sensed a shift in the
	//		force.... I mean card positions.
	//Return:None
	this.set_position = function (x_pos, y_pos)
	{
		$('#' + this.card_id).css('position', 'absolute');
		$('#' + this.card_id).css('top', y_pos);
		$('#' + this.card_id).css('left', x_pos);
	}
	
	//Function: set_drag()
	//Description: Changes the draggability of the card in
	//		question.
	//Parameters: draggable - 1 to make it draggable, 0 to
	//		disable draggability.
	//Preconditions: The card is being created, has recently
	//		been grabbed or has recently been released.
	//Return: None
	this.set_drag = function(draggable)
	{
		var holding_div = this.card_div.parentNode.id
		if (draggable == 1){
			$('#' + this.card_id).draggable({containment: '#' + holding_div});
		} else {
			$('#' + this.card_id).draggable("disable");
		}
	}
	
	//Function: set_selected()
	//Description: Should be called set_vis_selected();
	//		This only changes the border on the card.
	//Parameters: selected - an integer value corresponding to the
	//		owner. 1 - player owns, -1 - other player owns it
	//		0 - ttable owns.
	//Preconditions: This card is now owned by a different
	//		entity: this player, another player, or the table.
	//Return: None
	this.set_selected = function(selected)
	{
		var card = document.getElementById(this.card_id).style;
		if (selected == 1){
			card.border = "2px solid blue";
			
		} else if(selected == 0) {
			card.border = "0px solid black";
			
		} else if(selected == -1){
			card.border = "2px solid red";
		}
	}
	
	//Function: remove_card()
	//Description: Will delete a card div if it can
	//		be deleted.
	//Parameters: None
	//Preconditions: The card is being moved from hand
	//		to table or vice versa.
	//Postconditions: The div is gone and the card's in_hand
	//		value is -1 (non existant).
	//Return: None
	this.remove_card = function()
	{
		var card_div = document.getElementById(this.card_id);
		if (card_div){
			card_div.parentNode.removeChild(card_div);
		};
		
		this.card_div.in_hand = -1;
	}
	
	//Function: reinst_card()
	//Description: Will place a card back on the table.
	//Parameters: None
	//Preconditions: The card is being removed from someone's
	//		hand.
	//Return: None
	this.reinst_card = function()
	{
		cont_div.appendChild(this.card_div);
		
		this.card_div.in_hand = 0;
	}
	
	//Function: move_to_hand()
	//Description: Handles moving the card to the hand div
	//		 and setting its in_hand member.
	//Parameters: None
	//Preconditions: The card was on the table, but is
	//		no longer.
	//Return: None
	this.move_to_hand = function()
	{
		var hand = document.getElementById("hand");
		hand.appendChild(this.card_div);
		
		this.card_div.in_hand = 1;
	}

	//Constructor
	card_array[id] = this;			//This links the id of the card to its position in the card array
	var cont_div = document.getElementById('container');
	this.card_div = document.createElement("div");
	var image = document.createElement("img");

	this.card_div.appendChild(image);
	cont_div.appendChild(this.card_div);

	this.card_div.id = this.card_id;
	this.card_div.obj = this;
	this.card_div.imgdiv = image;
	this.card_div.in_hand = 0;		//-1 for not instantiated, 0 for on board, 1 for in your hand
	this.card_div.classList.add("card2");
	this.card_div.addEventListener("mousedown", card_array[id].bring_to_top, false);
	this.card_div.addEventListener("mouseup", card_array[id].handle_release, false);
	this.card_div.addEventListener("mousedown", card_array[id].handle_click, false);

	image.id = this.imgid;
	image.src = this.image;
	image.alt = this.imgid;
	image.addEventListener("mousedown", card_array[id].set_drag(1), false);


	this.set_position(10, 10);
}

