<?php
	include('db_connect.php');
	include('php_table_encode.php');
		
	$op = $_POST['op'];
	
	switch($op){
		case 0: 	//Unused
			// Execute function here
			break;
		
		case 1: 	//Move the card: updates x and y coordinates
			move_card();
			break;
		
		case 2:	//Get positions: retrieve positions since last query
			get_positions();
			break;
		
		case 3:	//Get all of the cards for a session.
			enter_session();
			break;
			
		case 4:	//Get a lock on selection
			secure_lock();
			break;
		
		case 5:	//When a play no longer has a card selected, this tells the system
			release_lock();
			break;
		
		case 6:	//Set a card's flipped field to the passed in variable
			flip_card();
			break;
		
		case 7: 	//Release all locks and send back lock information
			release_locks();
			break;
		
		case 8:	//Set id of player based on username
			get_player_id();
			break;
		
		case 9:	//Adding card to hand
			add_to_hand();
			break;

		case 10:
			get_max_player();
			break;

		case 11:
			add_new_player();
			break;
			
		case 12:	//Removing cards from hand
			remove_hand();
			break;

		case 13:
			count_cards();
			break;

		case 14:
			make_cards();
			break;

		case 15:
			get_games();
			break;

		case 16:
			remove_game();
			break;

		case 17:
			add_session();
			break;

		case 18:
			get_session();
			break;

		case 19:
			reset_cards();
			break;

		default:
			echo 'unrecognized operation' . $op;
	}
	// Name: move_cards();
	// Description: Will set new card positions (x,y,z) based on where the card is dragged and change update time to current time.
	// Pre-Conditions: there are cards to move.
	// Post-Conditions:  the database is updated with values corresponding to where the card is on the screen.
	function move_card()
	{
		global $mysqli;
		
		$game_id = $_POST['game_id'];
		$card_id = $_POST['cid'];
		$player_id = $_POST['pid'];
		$x_pos = $_POST['x_pos'];
		$y_pos = $_POST['y_pos'];
		$z_pos = $_POST['z_pos'];
		
		$time = date('Y-m-d H:i:s', time());
		
		$sql = "UPDATE Cards C
				SET last_update = NOW(), x_pos = $x_pos, y_pos = $y_pos, z_pos = $z_pos
				WHERE C.cid = '$card_id' AND C.game_id = $game_id AND C.locked = $player_id";
		
		$result = execute_query($sql);
		if($mysqli->affected_rows != 0){
			$result = '"1"';
		} else {
			$result = '"0"';
		}

		$result = make_json($sql, $game_id, $time, $result);
		echo $result;
	}
	
	// Name: get_positions();
	// Description: Get positions of the cards in the database.
	// Pre-Conditions: 
	// Post-Conditions: 
	// Return: cid, x_pos, y_pos, z_pos, flipped, locked, in_hand
	function get_positions()
	{
		$game_id = $_POST['game_id'];
		$update = date('Y-m-d H:i:s', time());
		$time = $_POST['lastu'];

		$time = date('Y-m-d H:i:s', strtotime($time) - 1000);
		
		$sql = "SELECT cid, x_pos, y_pos, z_pos, flipped, locked, in_hand
				FROM Cards
				WHERE game_id = $game_id AND last_update > '$time';";
		
		$result = execute_query($sql);
		$result = php_entity_encode($result);

		$result = make_json($sql, $game_id, $update, $result);
		echo $result;
	}
	
	// Name: enter_session();
	// Description: Gets all the cards for specific game.
	// Pre-Conditions:
	// Post-Conditions:
	// Return: cid, x_pos, y_pos, flipped, locked
	function enter_session()
	{
		$game_id = $_POST['game_id'];
		$time = date('Y-m-d H:i:s', time());
		
		$sql = "SELECT cid, x_pos, y_pos, flipped, locked
				FROM Cards
				WHERE game_id = $game_id;";

		$result = execute_query($sql);
		$result = php_entity_encode($result);

		$result = make_json($sql, $game_id, $time, $result);
		echo $result;
	}
	
	
	//lock = -1 means the card is unlocked
	// Name: secure_lock();
	// Description: Pulls database to see if card is selected, if not then card will be locked to current selector.
	// Pre-Conditions:
	// Post-Conditions: card is locked to appropriate card selector.
	// Return:
	function secure_lock()
	{
		global $mysqli;
		
		$game_id = $_POST['game_id'];
		$card_id = $_POST['card_id'];
		$player_id = $_POST['player_id'];
		
		$time = date('Y-m-d H:i:s', time());
		
		$sql = "SELECT C.cid
				FROM Cards C
				WHERE C.game_id = $game_id AND C.locked = $player_id AND C.cid = '$card_id'";
		$result = execute_query($sql);
		if($result->num_rows == 0){
			$sql = "UPDATE Cards C
					SET C.locked = $player_id, last_update = NOW()
					WHERE (C.locked = -1 OR C.locked = $player_id) AND C.game_id = $game_id AND C.cid = '$card_id' ;";
							
			$result = execute_query($sql);
			if($mysqli->affected_rows != 0){
				$result = '"1"';
			} else {
				$result = '"0"';
			}

		} else {
			$result = '"2"'; //We already have it selected
		}

		$result = make_json($sql, $game_id, $time, $result);
		echo $result;
	}
	
	//Returns 1 on successful release.
	//Returns 0 on a failed release: user did not have possession of the 
	//	CID and game sent in.

	// Name: release_lock();
	// Description: Checks database if user still has card selected, if not then release the lock.
	// Pre-Conditions:
	// Post-Conditions: Card lock is updated in database.
	// Return:
	function release_lock()
	{
		global $mysqli;

		$game_id = $_POST['game_id'];
		$card_id = $_POST['card_id'];
		$player_id = $_POST['player_id'];
		
		$time = date('Y-m-d H:i:s', time());
		
		$sql = "UPDATE Cards C
				SET C.locked = -1, last_update = NOW()
				WHERE C.locked = $player_id AND C.game_id = $game_id AND C.cid = '$card_id' ;";
						
		$result = execute_query($sql);
		if($mysqli->affected_rows != 0){
			$result = '"1"';
		} else {
			$result = '"0"';
		}

		$result = make_json($sql, $game_id, $time, $result);
		echo $result;
	}
	
	
	//Card must be unlocked (-1) to be flippable.
	// Name: flip_card();
	// Description: Will flip the card if right clicked.
	// Pre-Conditions:
	// Post-Conditions: Card flipped value is changed in the database.
	// Return:
	function flip_card()
	{
		global $mysqli;
		
		$game_id = $_POST['game_id'];
		$card_id = $_POST['card_id'];
		$flipped = $_POST['flipped'];
		$player_id = $_POST['pid'];
		
		$time = date('Y-m-d H:i:s', time());
		
		$sql = "UPDATE Cards C
				SET C.flipped = $flipped, C.last_update = NOW()
				WHERE (C.locked = -1 OR C.locked = $player_id) AND C.cid = '$card_id' AND C.game_id = $game_id;";
				
		$result = execute_query($sql);
		if($mysqli->affected_rows != 0){
			$result = '"1"';
		} else {
			$result = '"0"';
		}

		$result = make_json($sql, $game_id, $time, $result);
		echo $result;
	}
	
	// Name: release_locks();
	// Description: Checks database if user still has cards selected, if not update database.
	// Pre-Conditions:
	// Post-Conditions: Card lock is updated in database.
	// Return:
	function release_locks()
	{
		$game_id = $_POST['game_id'];
		$player_id = $_POST['player_id'];

		$time = date('Y-m-d H:i:s', time());
				
		$sql = "SELECT C.cid
				FROM Cards C
				WHERE C.locked = $player_id AND C.game_id = $game_id;";

		$result = execute_query($sql);
		$result = php_entity_encode($result);

		$result = make_json($sql, $game_id, $time, $result);
		echo $result;
		
		$sql2 = "UPDATE Cards C
				SET C.locked = -1
				WHERE C.locked = $player_id AND C.game_id = $game_id;";
		$result = execute_query($sql2);
	}

	// Name: get_player_id();
	// Description: Will search database by given username and return a user id accordingly.
	// Pre-Conditions:
	// Post-Conditions:
	// Return: id
	function get_player_id()
	{
		$username = $_POST['username'];

		$sql = "SELECT U.id
				FROM User U
				WHERE U.username = '$username'";

		$result = execute_query($sql);
		$result = php_entity_encode($result);

		echo $result;
	}

	/* Function add_to_hand()
	 * Return: If the card's in_hand value was changed, this returns a
	 * 	0. Failure is a 1.
	*/
	function add_to_hand()
	{
		$card_id = $_POST['card_id'];
		$game_id = $_POST['game_id'];
		$player_id = $_POST['player_id'];
		
		$sql = "	UPDATE Cards C
				SET C.in_hand = $player_id, C.last_update = NOW()
				WHERE C.cid = '$card_id' AND C.game_id = $game_id AND C.locked = $player_id";
		
		$result = execute_query($sql);
		if($mysqli->affected_rows != 0){
			$result = '"1"';	//Failure, did not add card to hand
			
		} else {
			$result = '"0"';
			
		}

		$result = make_json($sql, $game_id, "", $result);
		echo $result;
	}

	// Name: get_max_player();
	// Description: Query database for max user id.
	// Pre-Conditions:
	// Post-Conditions:
	// Return: id
	function get_max_player()
	{
		$sql = "SELECT max(U.id) id
				FROM User U";

		$result = execute_query($sql);
		$result = php_entity_encode($result);

		echo $result;
	}

	// Name: add_new_player();
	// Description: will retrieve username entered by user and add that into the database with maxid+1.
	// Pre-Conditions:
	// Post-Conditions: Database is updated with username and appropriate id.
	// Return:
	function add_new_player()
	{
		$username = $_POST['username'];
		$id = $_POST['uid'];

		$sql = "INSERT INTO User (username, id)
				VALUES ('$username', '$id')";

		$result = execute_query($sql);

		echo $result;
	}


	//Empties selected cards from your hand to table at a 
	//	hardcoded location. TODO: make this value not hardcoded.
	// Will deselect cards too.
	function remove_hand()
	{
		$x_pos = $_POST['x_pos'];
		$y_pos = $_POST['y_pos'];
		$card_id = $_POST['card_id'];
		$player_id = $_POST['player_id'];
		$game_id = $_POST['game_id'];
		
		$sql = "	UPDATE Cards C
				SET C.locked = -1, C.in_hand = 0, C.x_pos = $x_pos, C.y_pos = $y_pos, C.last_update = NOW()
				WHERE C.in_hand = $player_id AND C.game_id = $game_id AND C.cid = '$card_id';";
		
		$result = execute_query($sql);
		if($mysqli->affected_rows != 0){
			$result = '"1"';	//Failure, did not add card to hand
			
		} else {
			$result = '"0"';
			
		}

		$result = make_json($sql, $game_id, "", $result);
		echo $result;
	}

	// Name: count_cards();
	// Description: Retrieve game id from user and then query database for number of cards in that game.
	// Pre-Conditions:
	// Post-Conditions:
	// Return: num_cards
	function count_cards()
	{
		$game_id = $_POST['game_id'];

		$sql = "SELECT COUNT(game_id) AS num_cards
				FROM Cards
				WHERE game_id = $game_id";

		$result = execute_query($sql);
		$result = php_entity_encode($result);

		echo $result;
	}

	// Name: make_cards();
	// Description: Will make 52 cards for given game id.
	// Pre-Conditions:
	// Post-Conditions: 52 cards are added to the database with appropriate game id.
	// Return:
	function make_cards()
	{
		$card_map = array();

		for($i = 2; $i < 11; ++$i){
			$card_map[$i] = $i;
		}
		
		$suit_map = array();
		$suit_map [0] = 'C';
		$suit_map [1] = 'D';
		$suit_map [2] = 'H';
		$suit_map [3] = 'S';
		
		// Face cards
		$card_map [1] = 'A';
		$card_map [11] = 'J';
		$card_map [12] = 'Q';
		$card_map [13] = 'K';

		$game_id = $_POST['game_id'];

		$i = 0;
		foreach($suit_map as $suit){
			foreach($card_map as $card){
				$rand_z = rand(0,52);
				$sql = "	INSERT INTO Cards (uid, cid, z_pos, game_id)
							VALUES ($i, '" . $card . $suit ."', $rand_z, $game_id);";
				$result = execute_query($sql);
				
				if ($result){
					//echo $sql . "\n\n";
				} else {
					echo "Could not add card #" . $i . "\n";
				}
				
				$i = $i + 1;
			}
		}


	}

	// Name: get_games();
	// Description: Query database for all distinct games that have been inactive for 2 days or longer.
	// Pre-Conditions:
	// Post-Conditions:
	// Return: game_id
	function get_games()
	{

		$sql = "SELECT DISTINCT game_id
				FROM Cards
				WHERE
						time_to_sec(
							timediff(
								NOW(), (SELECT MAX(last_update))
							))
							/ 3600
						 > 48;
					;";

		//WHERE (time_to_sec(timediff(NOW(), last_update) / 3600) > 0;";

		$result = execute_query($sql);

		$result = php_entity_encode($result);

		echo $result;
	}

	// Name: remove_game()
	// Description: Will remove 52 cards with given game_id and remove Game with given game id.
	// Pre-Conditions:
	// Post-Conditions: Database is updated with games that have an inactivity of less than 2 days.
	// Return:
	function remove_game()
	{
		$game_id = $_POST['game_id'];

		$sql = "DELETE FROM Cards
				WHERE game_id = $game_id;";

		$result = execute_query($sql);

		$sql2 = "DELETE FROM Games
				WHERE game_id = $game_id;";
		$result = execute_query($sql2);
	}

	// Name: add_session();
	// Description: add a new game
	// Pre-Conditions:
	// Post-Conditions: new game is added to database with  game_id, host and description
	// Return:
	function add_session()
	{
		$game_id = $_POST['game_id'];
		$host_name = $_POST['host'];
		$game_desc = $_POST['desc'];

		
		$sql = "INSERT INTO Games (game_id, host, description)
				VALUES ('$game_id', '$host_name', '$game_desc');"; 
		$result = execute_query($sql);

		if ($result){
			echo $result;
		} else {
			echo "Failed to add\n";
		}	
	}

	//not sure when this function is used
	/*function get_session()
	{
		$game_id = $_POST['game_id'];

		$sql = "SELECT *
				FROM Games
				WHERE game_id = $game_id;";

		$result = execute_query($sql);

		echo $result;
	}*/

	// Name: reset_cards()
	// Description: Will put all cards back to (0,0) position and shuffle the cards (z_pos)
	// Pre-Conditions:
	// Post-Conditions: Database is updated with appropriate x, y, z pos.
	// Return:
	function reset_cards()
	{
		$game_id = $_POST['game_id'];

		for($i = 0; $i < 52; ++$i) {
			$rand_z = rand(0,52);
			$sql = "UPDATE Cards
					SET x_pos=0, y_pos=0, z_pos=$rand_z, flipped = 0
					WHERE game_id=$game_id AND uid=$i;";
			$result = execute_query($sql);
		}

		echo $result;
	}

?>