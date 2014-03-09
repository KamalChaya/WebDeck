console.log("Included lobby_tests.js");
//This function is a placeholder for the funct argument
//	of a synchronous ajax call. If you see it, you did something wrong.
function err_funct(ajax_obj)
{
	alert("This function should only be specified for a synchronous AJAX request! check your function call!");
}

//This function is simply a placeholder when the responseText of
//	an ajax call does not matter.
function empty_funct(ajax_obj)
{
	//Does nothing, just a placeholder.
}

function username_tests()
{
	username_add_test();
}

function username_add_test()
{
	var test_user = make_id();
	console.log("Attempting to add new username, " + test_user);

	var id_query = 'op=10';
	var max_id = ajax('cards_mgmt.php', id_query, err_funct, false);
	max_id = JSON.parse(max_id.responseText);

	max_id = parseInt(max_id[0].id);

	console.log("Current max id: " + max_id);

	var namequery = 'op=8&username=' + test_user;
	var userid = ajax('cards_mgmt.php', namequery, err_funct, false);
	userid = JSON.parse(userid.responseText);

	if(confirm("Account not found. Would you like an account to be created for you?")) {
			id_query = 'op=10';
			max_id = ajax('cards_mgmt.php', id_query, err_funct, false);
			max_id = JSON.parse(max_id.responseText);

			max_id = parseInt(max_id[0].id);
			max_id = max_id + 1;
			
			id_query = 'op=11&username=' + test_user + "&uid=" + max_id;

			this.ajax('cards_mgmt.php', id_query, err_funct, false);
			console.log("Added new username " + test_user + " with id " + max_id);
	} else {
		alert("Okay. Going back to the lobby.");
		document.location = 'lobby.html';
	}

	id_query = 'op=10';
	max_id = ajax('cards_mgmt.php', id_query, err_funct, false);
	max_id = JSON.parse(max_id.responseText);

	max_id = parseInt(max_id[0].id);

	console.log("Current max id: " + max_id);

	username_exist_test(test_user);
}

function username_exist_test(username)
{
	console.log("Searching for user " + username);

	var namequery = 'op=8&username=' + username;
	var userid = ajax('cards_mgmt.php', namequery, err_funct, false);
	userid = JSON.parse(userid.responseText);

	if(!jQuery.isEmptyObject(userid)) {
		var player_id = userid[0].id;
		var username = username;
		console.log("Found user " + username + " with id " + player_id);
	}
}

function make_id()
{
	var return_id = "";
	var characters = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";

	for(var i = 0; i < 5; i++) {
		return_id += characters.charAt(Math.floor(Math.random() * characters.length));
	}

	return return_id;
}

function game_tests()
{
	game_add_test();
}

function game_add_test()
{
	var num_games  = 'op=15';
	num_games = ajax('cards_mgmt.php', num_games, err_funct, false);
	num_games = JSON.parse(num_games.responseText);
	num_games = num_games.length;
	console.log("Total number of games: " + num_games);

	var new_game = num_games + 1;

	var this_game = 'op=14&game_id=' + new_game;
	var make_cards = ajax('cards_mgmt.php', this_game, err_funct, false);
	
	console.log("Created new game with game_id " + new_game);
	
	num_games = 'op=15';
	num_games = ajax('cards_mgmt.php', num_games, err_funct, false);
	num_games = JSON.parse(num_games.responseText);
	num_games = num_games.length;
	console.log("Total number of games: " + num_games);

	game_exist_test(new_game);
}

function game_exist_test(game_id)
{
	var game_query = 'op=13&game_id=' + game_id;
	var num_cards = ajax('cards_mgmt.php', game_query, err_funct, false);
	num_cards = JSON.parse(num_cards.responseText);
	num_cards = num_cards[0].num_cards;

	if (num_cards == 52){
		console.log("52 cards found for game " + game_id);	
	}
}

//Responsible for carrying out AJAX requests
//async: true or false for asynchronous requests. non-async requests return an AJAX obj
function ajax(file, var_string, funct, async)
{
	//alert('Ajax accessed');
	var locations = document.URL.split("/");
	var web_root = document.URL.replace(locations[locations.length - 1], "");
	
	if(window.XMLHttpRequest){
		var ajax_obj =  new XMLHttpRequest();
	}else{
		var ajax_obj = new ActiveXObject("Microsoft.XMLHTTP");
	}
	
	ajax_obj.open('POST', web_root + file, async);
	ajax_obj.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
	
	//alert(var_string);
	ajax_obj.send(var_string);
	
	if (async){
		//alert("Registered async");
		ajax_obj.onreadystatechange = function(){
			if(ajax_obj.readyState == 4 && ajax_obj.status == 200){
				funct(ajax_obj);
				//return ajax_obj;
				//return obj;
			
			}else{
				//alert('Ready State: ' + ajax_obj.readyState + " Status: " + ajax_obj.status);
			}
		}
	} else {
		return ajax_obj;
	}
}