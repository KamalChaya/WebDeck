function player(id, name, ishost)
{
	this.id = id;
	this.name = name;
	this.ishost = ishost;
	this.hand = new Array();

	this.select_card = function(){}
	//Once a card is selected it is draggable and flippable.
	this.take_card = function(){}
	//places card in hand.
	this.place_card = function(){}
	//puts card from hand on table.
}