function deck(stack_id,cards)
{
	// constructor

	this.id = stack_id;
	this.face_up = false; // deck is face down to begin with

	this.img2 = "card_backs/Blue_Back_2.svg"; // image for 2 or more cards
	this.img3 = "card_backs/Blue_Back_3.svg"; // image for 3 or more cards
	this.img4 = "card_backs/Blue_Back_4.svg"; // image for 4 or more cards
	//var cont_div = document.getElementById('container');


	this.cards = new Array();
	if (typeof cards != 'undefined') {
		this.cards = cards.slice(0);
	}

	//methods

	//Shuffle
	// Randomizes the order of card objects
	this.shuffle = function() {
		var temp_arr = this.cards.slice(0);
		while(1) {
			this.randomize();
			for (var i in temp_arr) {
				if (temp_arr[i] != this.cards[i]) {
					return;
				}
			}
		}
	}

	this.randomize = function () {
		var current_idx = this.cards.length
			, temp
			, rand_idx;

		while (current_idx !== 0) {
			rand_idx = Math.floor(Math.random() * current_idx);
			current_idx -= 1;

			temp = this.cards[current_idx];
			this.cards[current_idx] = this.cards[rand_idx];
			this.cards[rand_idx] = temp;
		}
	}

	this.add_card = function(card_id, to_top){
		//this.add_to_bottom(card_id);
		if (to_top) { //To top case
			if (this.face_up) {
				this.cards.unshift(card_id);
			} else {
				this.cards.push(card_id);
			}
		} else {	//Default case
			if (this.face_up) {
				this.cards.push(card_id);
			} else {
				this.cards.unshift(card_id);
			}
		}
	}
	
	this.add_to_bottom = function(card_id){
		this.cards.unshift(card_id);

	}
	this.draw_card = function(){
		if (this.face_up){
			return this.cards.shift();
		} else {
			return this.cards.pop();
		}
	}

	this.flip_deck = function flip_deck(){
		this.face_up = !this.face_up;
	}
	this.make_div = function make_div(x,y){
		var cont_div = document.getElementById("container");
		this.deck_div = document.createElement("div");
		var image = document.createElement("img");
		this.deck_div.appendChild(image);
		cont_div.appendChild(this.deck_div);

		this.deck_div.id = this.id;
		this.deck_div.classList.add("deck");
		this.deck_div.imgdiv = image;

		image.id = this.imgid;

		switch (this.cards.length) {
		case 2:
			image.src = this.img2;
			break;
		case 3:
			image.src = this.img3;
			break;
		default:
			image.src = this.img4;
			break;
		}
	}

	this.set_position = function (x_pos, y_pos)
	{

		$('#' + this.id).css('position','absolute');
		$('#' + this.id).css('top', y_pos);
		$('#' + this.id).css('left', x_pos);
	}

}