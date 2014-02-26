function card_stack(stack_id,cards)
{
	this.id = stack_id;
	this.face_up = false; // deck is face down to begin with
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
}