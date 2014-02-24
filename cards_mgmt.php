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
		
		case 8:		//Set id of player based on username
			set_player_id();
			break;
			
		default:
			echo 'unrecognized operation' . $op;
	}
	
	function move_card()
	{
		global $mysqli;
		
		$card_id = $_POST['cid'];
		$x_pos = $_POST['x_pos'];
		$y_pos = $_POST['y_pos'];
		$game_id = $_POST['game_id'];
		$player_id = $_POST['pid'];
		
		$time = date('H:i:s', time());
		
		$sql = "UPDATE Cards C
				SET last_change = '$time', x_pos = $x_pos, y_pos = $y_pos
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
	
	
	function enter_session()
	{
		$game_id = $_POST['game_id'];
		$time = date('H:i:s', time());
		
		$sql = "SELECT cid, x_pos, y_pos, flipped, locked
				FROM Cards
				WHERE game_id = $game_id;";

		$result = execute_query($sql);
		$result = php_entity_encode($result);

		$result = make_json($sql, $game_id, $time, $result);
		echo $result;
	}
	
	
	function get_positions()
	{
		$game_id = $_POST['game_id'];
		$time = $_POST['lastu'];
		$time = date('H:i:s', ($time));
		
		$sql = "SELECT cid, x_pos, y_pos, flipped, locked
				FROM Cards
				WHERE game_id = $game_id AND last_change >= '$time';";
		
		$result = execute_query($sql);
		$result = php_entity_encode($result);

		$result = make_json($sql, $game_id, $time, $result);
		echo $result;
	}
	
	//lock = -1 means the card is unlocked
	function secure_lock()
	{
		global $mysqli;
		
		$game_id = $_POST['game_id'];
		$card_id = $_POST['card_id'];
		$player_id = $_POST['player_id'];
		
		$time = date('H:i:s', time());
		
		$sql = "SELECT C.cid
				FROM Cards C
				WHERE C.game_id = $game_id AND C.locked = $player_id AND C.cid = '$card_id'";
		$result = execute_query($sql);
		if($result->num_rows == 0){
			$sql = "UPDATE Cards C
					SET C.locked = $player_id, last_change = '$time'
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
	function release_lock()
	{
		global $mysqli;

		$game_id = $_POST['game_id'];
		$card_id = $_POST['card_id'];
		$player_id = $_POST['player_id'];
		
		$time = time();
		$time = date('H:i:s', $time);
		
		$sql = "UPDATE Cards C
				SET C.locked = -1, last_change = '$time'
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
	function flip_card()
	{
		global $mysqli;
		
		$game_id = $_POST['game_id'];
		$card_id = $_POST['card_id'];
		$flipped = $_POST['flipped'];
		$player_id = $_POST['pid'];
		
		$time = date('H:i:s', time());
		
		$sql = "UPDATE Cards C
				SET C.flipped = $flipped, C.last_change = '$time'
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
	
	function release_locks()
	{
		$game_id = $_POST['game_id'];
		$player_id = $_POST['player_id'];

		$time = date('H:i:s', time());
				
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

	function set_player_id()
	{
		$username = $_POST['username'];

		//die($username);

		$sql = "SELECT U.id
				FROM User U
				WHERE U.username = '".$username."'";

		$result = execute_query($sql);

		if($result.rows > 0) {
			die("Got rows!");
			$result = php_entity_encode($result);

			$result = JSON.parse($result);
		}
		else {
			die("No results!");
		}

		echo $result;
	}
?>