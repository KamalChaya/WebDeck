//Function: card()
//Description: This is the constructor for the card object
//Parameters: Letter: the alphanumeric character to display on the card
//		Num: the numeric value of the card


function card(fname, id)
{
	//Members
	this.id = id;
	this.card_id = "card" + this.id;
	this.front = 'card_fronts/' + fname;
	this.back = "card_backs/blue_back.svg";
	this.image = this.back;
	this.imgid = this.card_id + "_img";
	this.select = 0;

	//Methods
	this.flip_card = function (event)
	{
		if(event.button == 2) {
			if (this.image == this.front){
				this.image = this.back;
			} else {
				this.image = this.front;
			}
			document.getElementById("card" + this.id + "_img").src = this.image;
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

	//Constructor
	var cont_div = document.getElementById('container');
	var card_div = "<div id = '" + this.card_id + "' onmousedown = 'card_array[" + id + "].flip_card(event); card_array[" + id + "].bring_to_top();'>";
	card_div += "<image id = '" + this.imgid + "' src='" + this.image +"' alt='' height=100>";
	card_div += "</div>";
	cont_div.innerHTML += card_div;
	card_array.push(this);
	this.set_position(10, 10);
}

