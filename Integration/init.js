var card_array = new Array();
var card_map = new Array();
var network = new mk_network();
//alert(network);
var top_z = 70;
var customDelim = '~';

// Regular Cards
for(var i = 2; i < 11; i++){
	card_map[i] = i;
}

//Function: init()
//Description: Makes 52 card objects
function init(){
	suit_map = new Array();
	suit_map [0] = 'C';
	suit_map [1] = 'D';
	suit_map [2] = 'H';
	suit_map [3] = 'S';
	// Face cards
	card_map [1] = 'A';
	card_map [11] = 'J';
	card_map [12] = 'Q';
	card_map [13] = 'K';
	
	network.init_board();

	setInterval('chat.update()', 1000);
	
	/*for(var suit = 0; suit < 4; suit++) {
		for(var value = 1; value < 14; value++) {
			//make_card(card_map[value] + suit_map[suit] + '.svg');
			fname = card_map[value] + suit_map[suit] + '.svg';
			var new_card = new card(fname, card_array.length);
		}
	}
	for (var i = 0; i < card_array.length; i++){

		$('#' + 'card' + i).css('position', 'absolute');
		$('#' + 'card' + i).css('z-index', 0);

		$('#card' + i).draggable({containment: '#container'});
		// $('#card' + i).mousedown(function(event, i) {
		// 	card_array[i].bring_to_top();
		// });
	}*/
}