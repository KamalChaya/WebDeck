//Function: card()
//Description: This is the constructor for the card object
//Parameters: Letter: the alphanumeric character to display on the card
//		Num: the numeric value of the card


function card(fname, id)
{
	//Members
	this.id = id;
	this.card_id = id;		//The id of the div that contains this card
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
			console.log("this is image:" + this.imgdiv.src);
			card = this.obj;
			//card = card_array[this.id];
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
			//document.getElementById(this.id + "_img").src = this.image;
			
		} else if (event.button == 0) {
			//left click
			console.log("Handling left click on card:");
			select.grab_card(this.id);
		}
	}
	
	this.handle_release = function (event)
	{
		if(event.button == 2) {
			//Do nothing, the card is flipped.
		} else if (event.button == 0) {
			//Release the card
			console.log("Released card");
			select.ungrab_card(this.id);
			//network.stop_send(this.id);
			//card_array[select.grabbed_card].set_drag(0);
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
		document.getElementById(this.id + "_img").src = this.image;
	}
	
	this.select_card = function() // Deprecated?
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
		//$('#' + this.card_id).css('z-index', top_z);
		this.style.zIndex = "" + top_z;
		console.log("top_z" + top_z);
		top_z = top_z + 1;
		console.log("top_z" + top_z);
	}
	
	//Since bring_to_top relies on a click to set 'this'
	//	we need a programmably-called z-index setter.
	this.set_z_idx = function(new_z)
	{
		this.card_div.style.zIndex = new_z;
	}

	this.set_position = function (x_pos, y_pos)
	{
		$('#' + this.card_id).css('position', 'absolute');
		$('#' + this.card_id).css('top', y_pos);
		$('#' + this.card_id).css('left', x_pos);
	}
	
	//draggable: 1 to make the card draggable, 0 to make it not draggable
	this.set_drag = function(draggable)
	{
		//console.log("set_drag: " + draggable);
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
		var card = document.getElementById(this.card_id).style;
		if (selected == 1){
			console.log("Setting blue border");
			card.border = "2px solid blue";
		} else if(selected == 0) {
			card.border = "0px solid black";
		} else if(selected == -1){
			//alert("Here");
			card.border = "2px solid red";
		}
	}
	
	
	//Remove the card from the table if it exists
	this.remove_card = function()
	{
		//check if it's on the table and remove it.
		var cardDiv = document.getElementById(this.card_id);
		if (cardDiv && cardDiv.parentNode && cardDiv.parentNode.removeChild){
			cardDiv.parentNode.removeChild(cardDiv);
		};
	}
	
	this.reinst_card = function()
	{
		cont_div.appendChild(this.card_div);
	}

	//Constructor Revised!
	card_array[id] = this;	//This links the id of the card to its position in the card array
	var cont_div = document.getElementById('container');
	this.card_div = document.createElement("div");
	var image = document.createElement("img");
	this.card_div.appendChild(image);
	cont_div.appendChild(this.card_div);

	this.card_div.id = this.card_id;
	this.card_div.classList.add("card2");
	this.card_div.addEventListener("mousedown", card_array[id].bring_to_top, false);
	this.card_div.addEventListener("mouseup", card_array[id].handle_release, false);
	this.card_div.addEventListener("mousedown", card_array[id].handle_click, false);
	this.card_div.obj = this;
	this.card_div.imgdiv = image;

	image.id = this.imgid;


	image.src = this.image;
	image.alt = this.imgid;
	image.addEventListener("mousedown", card_array[id].set_drag(1), false);

	//Constructor
	//alert("Constructor called: fname " + fname + " id: " + id);
	//NOTICE: the handle for a mouse click is associated with the image! This allows for seamless dragability!
	/*var cont_div = document.getElementById('container');
	var card_div = "<div id = '" + this.card_id + "' class = 'card2 ' onmousedown = 'card_array[" + '"' + id + '"' + "].bring_to_top();'  onmouseup = 'card_array[" + '"' + id + '"' + "].handle_release(event);'>";
	card_div += "<image id = '" + this.imgid + "' src='" + this.image +"'  onmousedown = 'card_array[" +'"'+ id + '"' + "].handle_click(event);' alt='"+this.card_id+"'></image>";
	card_div += "</div>";
	//alert(card_div);
	cont_div.innerHTML += card_div;
	//alert(cont_div.innerHTML);
	*/
	//card_array.push(this);

	//alert(card_array[id].id);
	this.set_position(10, 10);
}

