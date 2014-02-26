function deck(stack_id,cards)
{
	this.id = stack_id;
	this.face_up = false; // deck is face down to begin with
	this.img2 = "card_backs/Blue_Back_2";
	this.img3 = "card_backs/Blue_Back_3";
	this.img4 = "card_backs/Blue_Back_4";
	this.image = this.img4;
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

	var cont_div = document.getElementById('container');
	var deck_div = "<div id = '" + this.card_id + "' class = 'card2 ' onmousedown = 'card_array[" +
				'"' + id + '"' + "].bring_to_top();'  onmouseup = 'card_array[" + '"' + id + '"' +
				"].handle_release(event);'>";
	deck_div += "<image id = '" + this.imgid + "' src='" + this.image +"'  onmousedown = 'card_array[" +
				'"'+ id + '"' + "].handle_click(event);' alt='"+this.card_id+"'></image>";
	deck_div += "</div>";
	//alert(card_div);
	cont_div.innerHTML += deck_div;
	//alert(cont_div.innerHTML);
	//card_array.push(this);
	card_array[id] = this;	//This links the id of the card to its position in the card array
	//alert(card_array[id].id);
	this.set_position(10, 10);
}