<!DOCTYPE html>
	<head>
	<meta http-equiv="Content-Type" content="text/html;charset=utf-8" >
		<title>
			AJAX Demo
		</title>
		
		<link rel = 'stylesheet' type = 'text/css' href = 'spike.css'>
		
		<script type = 'text/javascript' src = 'http://ajax.googleapis.com/ajax/libs/jquery/1.5.0/jquery.min.js'></script>
		<script type = "text/javascript" src="http://ajax.googleapis.com/ajax/libs/jqueryui/1.8.9/jquery-ui.min.js"></script>
		<script type = "text/javascript" src = "js_table_decoder.js"></script>
		<script type = "text/javascript" >
			//Important Globals
			var card_array = new Array();
			var card_map = new Array();
			var interval_array = new Array();
			
			var owner_id = 0; //Hardcoded for now, but not later.
			var game_id = 0;
			var has_lock = 0;
			var cur_card = -1; //-1 means you don't have a card.
			
			var customDelim = '~';
			
			var web_root = 'http://people.oregonstate.edu/~cartejac/CS361/';
			
			//Function pointers
			var alert_response = function(ajax_obj){
				alert(ajax_obj.responseText);
			}
			
			var return_array = function(ajax_obj){
				alert(ajax_obj.responseText);
				var ret_arr = JSEntityDecoder(ajax_obj.responseText, customDelim);
				alert(ret_arr.fieldNames);
				return ret_arr;
			}
			
			var return_ajax = function(ajax_obj){
				return ajax_obj;
			}
			
			
			/******** init(): The start - Get into a game.
			*******************************************/
			function init(){
				var game_session = document.getElementById('session_id_input');
				game_session.value = 0;
				
				load_game();
			} 
			
			
			
			function make_card(){
				//alert('Clicked!');
				var letter = document.getElementById('card_num_input').value;
				//var new_card = new card(card_map[letter], letter, card_array.length);
				//new_card.create_card();
				//card_array.push(new_card);
				//$('#card0').draggable({containment: '#container'});
				
				//Add the card to the database
				var var_string = 'op=0&card_id=' + letter + '&owner_id=' + owner_id + '&x_pos=0&y_pos=0&game=' + game_id;
				//alert('var_String = ' + var_string);
				ajax('http://people.oregonstate.edu/~cartejac/CS361/', 'cards_mgmt.php', var_string, add_card);
				
			}
			
			function add_card(ajax_obj){
				var ans = ajax_obj.responseText.split(customDelim);
				if(ans[1] == "1"){
					var letter = document.getElementById('card_num_input').value;
					var new_card = new card(card_map[letter], letter, card_array.length);
					new_card.create_card();
					card_array.push(new_card);
					
				} else {
					alert("Card already created.");
					
				}
			}
			
			function make_draggable(){
				/*for (var i = 0; i < card_array.length; i++){
					$('#card' + i).draggable({containment: '#container'});
				}*/
				
				for(key in card_array){
					$('#card' + key).draggable({containment: '#container'});
				}
			}
			
			function set_game_id(){
				game_id = document.getElementById('game_id_input').value;
				alert('Game ID: ' + game_id);
					
				load_game();
				
				//Tell the user in a div.
				document.getElementById('game_id_display').innerHTML = 'game id: ' + game_id;
			}
			
			function set_transmit_interval(id){
				//alert("ID: " + id);
				cur_card = id;
				interval_array['card' + id] = setInterval('transmit_pos(' + id+ ');', 300);
				//var card = document.getElementById('card' + id);
				//card.style.left = '100px';
			}
			
			function clear_transmit_interval(id){
				//alert("Clear ID: " + id);
				
				clearInterval(interval_array['card' + id]);
				cur_card = -1;
				//Remove the lock if he/she has one
				if(has_lock){
					//AJAX
				}
			}
			
			var transmit_pos = function(id){
				//alert('Trying to transmit');
				//Get position information
				var card = document.getElementById('card' + id);
				var x_pos = card.offsetLeft;
				var y_pos = card.offsetTop;
				
				//alert('x_pos = ' + x_pos + '; y_pos' + y_pos);
				//AJAX
				var var_string = "op=1&game_id=" + game_id + "&uid=" + id + "&x_pos=" + x_pos + "&y_pos=" + y_pos;
				//alert(var_string);
				ajax(web_root, "cards_mgmt.php", var_string, set_lock);
			}
			
			//Determine if the user acquired a lock.
			function set_lock(ajax_obj){
				//alert(ajax_obj.responseText);
				var ans = ajax_obj.responseText.split(customDelim);
				if(ans[1] == "1"){
					//alert('Got the lock!');
					has_lock = 1;
				} else {
					//alert('No lock for you!');
					has_lock = 0;
				}
			}	
			
			function update_board(){
				//alert("Updating Board");
				var var_string = 'op=2&game_id=' + game_id;
				ajax(web_root, 'cards_mgmt.php', var_string, perform_updates);
			}
			
			//Take the response from the database (cid, position, uid, etc)
			//	and make new cards if they dont exist, before updating
			//	The position of every card in the page.
			function perform_updates(ajax_obj){
				//alert(ajax_obj.responseText);
				var new_pos = JSEntityDecoder(ajax_obj.responseText, customDelim);
				
				for(key in new_pos){
					if((+isTableKey(key)) != 1){
						if(typeof card_array[key] == 'undefined'){
							var new_card = new card(new_pos[key]['cid'], new_pos[key]['cid'], key);
							new_card.create_card();
							card_array[key] = new_card;
							
							make_draggable();
						} 
						
						if(key == cur_card){
							continue;
						}
						var card_div = document.getElementById('card' + key);
						card_div.style.left = new_pos[key]['x_pos'] + 'px';
						card_div.style.top = new_pos[key]['y_pos'] + 'px';
					}
				}
			}
			
			//Function: card()
			//Description: This is the constructor for the card object
			//Parameters: Letter: the alphanumeric character to display on the card
			//		Num: the numeric value of the card
			function card(num, letter, id){
				//Constructor
				this.opacity = 1; //Make it visible.
				this.id = id;
				this.num = num;
				this.letter = letter;
				
				this.create_card = create_card
				function create_card(){
					var contDiv = document.getElementById('container');
					//alert(id);
					var cardPrefix = "card" + this.id;
					var interval_txt = 'interval_array["' + cardPrefix + '"]';
					var cardDiv = "<div id = '" + cardPrefix + "' class = 'card' onmousedown = 'set_transmit_interval(" + id + ");' onmouseup = 'clear_transmit_interval(" + id + ");'>";
					cardDiv += "<div id = '" + cardPrefix + "_top_num' class = 'card_top_num'>" + this.letter + "</div>";
					cardDiv += "<div id = '" + cardPrefix + "_main' class = 'card_main'></div>";
					cardDiv += "<div id = '" + cardPrefix + "_bot_num' class = 'card_bot_num'>" + this.letter + "</div>";
					cardDiv += "</div>";
					
					contDiv.innerHTML += cardDiv;
				}
				
				//Methods
					this.change_opacity = change_opacity
					function change_opacity(){
						alert("This.id: " + this.id);
						if(this.opacity == 1){
							this.opacity = 0;
							document.getElementById('card' + this.id).style.background = 'black';
						}
						else{
							this.opacity = 1;
							document.getElementById('card' + this.id).style.background = 'white';
						}
					}
				//Members
					//opacity
			}
			
			
			function load_game(){
				var session = document.getElementById('session_id_input').value;
				//alert('session: ' + session);
				
				//Clear current cards
				for(index in card_array){
					deleteDiv('card' + index);
				}
				
				card_array.length = 0; //Clear the array.
				
				//Get the new cards and initalize
				var var_string = 'op=3&game_id=' + session;
				var ajax_obj = ajax(web_root, 'cards_mgmt.php', var_string, finish_loading);
				//var new_game = JSEntityDecoder(ajax_obj.responseText, "~");
				/******TODO: We have the table, we just need to make the cards now****/
				/**Think about asynchronous option*******/
				
				//alert('field name 0: ' + new_game.fieldName[0]);
			}
			
			function finish_loading(ajax_obj){
				var new_game = JSEntityDecoder(ajax_obj.responseText, customDelim);
				//alert(new_game.fieldNames);
				for(key in new_game){
					if((+isTableKey(key)) != 1){
						//alert(new_game[key]['cid']);
						var new_card = new card(new_game[key]['cid'], new_game[key]['cid'], key);
						new_card.create_card();
						card_array[key] = new_card;
						
					}
				}
				
				//Make them draggable
				make_draggable();
				
				//Set positions
				for(key in card_array){
					//Set position
					var card_div = document.getElementById('card' + key);
					card_div.style.left = new_game[key]['x_pos'] + 'px';
					card_div.style.top = new_game[key]['y_pos'] + 'px';
				}
				
				//Start getting data
				if(typeof interval_array['main'] == 'undefined'){
					interval_array['main'] = setInterval("update_board()", 300);
				}
			}
			
			//If you want the ajax object, your function pointer must
			//	return it
			function ajax(root, file, var_string, funct){
				//alert('Ajax accessed');
				if(window.XMLHttpRequest){
					var ajax_obj =  new XMLHttpRequest();
				}else{
					var ajax_obj = new ActiveXObject("Microsoft.XMLHTTP");
				}
				
				ajax_obj.open('POST', root + file, true);
				ajax_obj.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
				
				ajax_obj.send(var_string);
				
				ajax_obj.onreadystatechange = function(){
					if(ajax_obj.readyState == 4 && ajax_obj.status == 200){
						funct(ajax_obj);
						//return ajax_obj;
						//return obj;
					
					}else{
						//alert('Ready State: ' + ajax_obj.readyState);
					}
				}
				//AJAX for the edits
				/*var vars = new Array();
				var count = 8;
				vars[0] = "username="+username;
				AJAXTemplate(count,"o",vars, "POST", "php/getEdits.php", true);
				a[count][0].onreadystatechange = function(){
					if(a[count][0].readyState == 4 && a[count][0].status == 200){
						exec_code();
					}*/
				
				//return ajax_obj;
				//return ajax_obj;
			}
			
			//ajax('http://people.oregonstate.edu/~cartejac/CS361/', 'echo.php');
		
			function deleteDiv(forumName){
			//sometimes i dont want to brighten stuff
				var oldDiv = document.getElementById(forumName);
				if (oldDiv && oldDiv.parentNode && oldDiv.parentNode.removeChild){
					oldDiv.parentNode.removeChild(oldDiv);
				};
			}
			//alert_response('hi');
		</script>
	</head>
	<body onload = 'init();'>
		<div id = 'container'>
			
		</div><!--container-->
		<div id = 'make_card'>
			<div id = 'card_form'>
				<div class = 'input' id = 'input_cont'>
					<div id = 'input1'>
						<label>Number: </label><input type = 'text' id = 'card_num_input' />
						<button onclick = 'make_card();'>Make Card</button>
					</div><!--input1-->
					<div id = 'input2'>
						<label>New Game ID: </label><input type = 'text' id = 'game_id_input' />
						<button onclick = 'set_game_id();'>Set Game ID</button>
					</div><!--input2-->
					<div id = 'load_session'>
						<label>Game: </label><input type = 'text' id = 'session_id_input' />
						<button onclick = 'load_game();'>Load Session</button>
					</div>
					<div id = 'game_id_display'>game_id = 0</div>
				</div><!--input-->
			</div><!--card_form-->
		</div><!--make_card-->
	</body>
</html>