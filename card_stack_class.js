function card_stack(stack_id,cards)
{
	this.id = stack_id;
	this.cards = cards;
	if (typeof this.cards == 'undefined'){
		this.cards = new Array();
	}
	//methods

	//Shuffle
	// Randomizes the order of card objects
	this.shuffle = function (){
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

	this.add_card = function(card_id){
		this.add_to_bottom(card_id);
	}
	
	this.add_to_bottom = function(card_id){
		this.cards.unshift(card_id);

	}
	this.draw_card = function(){
		return this.cards.pop();
	}
}