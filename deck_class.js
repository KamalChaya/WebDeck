function deck(deck_id,cards)
{
	// constructor

	this.deck_id = deck_id;
	this.face_up = false; // deck is face down to begin with

	this.img_small = "card_backs/Blue_Back_3.svg"; // image for 2 or more cards
	this.img_med = "card_backs/Blue_Back_6.svg"; // image for 3 or more cards
	this.img_large = "card_backs/Blue_Back_9.svg"; // image for 4 or more cards
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

		this.deck_div.id = this.deck_id;
		this.deck_div.classList.add("deck");
		this.deck_div.imgdiv = image;

		image.id = this.imgid;

		if (this.cards.length < 16) {
			image.src = this.img_small;
		} else if (this.cards.length < 31) {
			image.src = this.img_med;
		} else {
			image.src = this.img_large;
		}
	}

	this.remove_deck = function () {
		var deck_div = document.getElementById(this.deck_id);
		if (deck_div && deck_div.parentNode && deck_div.parentNode.removeChild){
			deck_div.parentNode.removeChild(deck_div);
		}
	}

	this.bring_to_top = function()
	{
		$('#' + this.deck_id).css('position', 'absolute');
		this.deck_div.style.zIndex = "" + top_z;
		console.log("top_z" + top_z);
		top_z = top_z + 1;
		console.log("top_z" + top_z);
	}

	this.set_drag = function (draggable){
		if (draggable == 1){
			$('#' + this.deck_id).draggable({containment: '#container'});
		} else {
			$('#' + this.deck_id).draggable("disable");
		}
	}
	this.set_position = function (x_pos, y_pos)
	{

		$('#' + this.deck_id).css('position','absolute');
		$('#' + this.deck_id).css('top', y_pos);
		$('#' + this.deck_id).css('left', x_pos);
	}
}