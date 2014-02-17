<?php
	include('db_connect.php');
	include('php_table_encode.php');
	
	$customDelim = "~";
	
	$op = $_POST['op'];
	
	switch($op){
		case 0: 	//Create the card
			create_card(); // <-- Deprecated
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
			
		default:
			echo 'unrecognized operation' . $op;
	}
	
	
	function create_card(){
		global $customDelim;
		
		$card_id = $_POST['card_id'];
		$owner_id = $_POST['owner_id'];
		$x_pos = $_POST['x_pos'];
		$y_pos = $_POST['y_pos'];
		$game = $_POST['game'];
		
		//Escape illegal values here
		
		$sql = "INSERT INTO Cards (uid, cid, last_change, owner, x_pos, y_pos, flipped, game, locked)
				VALUES (NULL, $card_id, current_time, $owner_id, $x_pos, $y_pos, 0, $game, 0);";
		//echo "   '".$sql."'      ";
		$res = execute_query($sql);
		if($res == true){
			echo "1";
		} else {
			echo "0";
		}
	}
	
	
	function move_card(){
		global $customDelim;
		global $mysqli;
		
		$card_id = $_POST['cid'];
		$x_pos = $_POST['x_pos'];
		$y_pos = $_POST['y_pos'];
		$game = $_POST['game_id'];
		$player_id = $_POST['pid'];
		
		$time = time();
		$time = date('H:i:s', $time);
		
		$sql = "UPDATE Cards C
				SET last_change = '$time', x_pos = $x_pos, y_pos = $y_pos
				WHERE C.cid = '$card_id' AND C.game = $game AND C.locked = $player_id";
		
		//echo "     " . $sql . "      ";
		$result = execute_query($sql);
		if($mysqli->affected_rows != 0){
			echo "1";
		} else {
			echo "0";
		}
	}
	
	
	function enter_session(){
		$game_id = $_POST['game_id'];
		
		//echo 'Game ID: ' . $game_id;
		
		$sql = "	SELECT cid, x_pos, y_pos, flipped, locked
				FROM Cards
				WHERE game = $game_id;";
		$result = execute_query($sql);	
		$tableString = php_entity_encode($result);
		echo $tableString;
	}
	
	
	function get_positions(){
		$game_id = $_POST['game_id'];
		$time = $_POST['lastu'];
		
		$time = date('H:i:s', ($time));

		//echo 'Game ID: ' . $game_id;
		
		$sql = "	SELECT cid, x_pos, y_pos, flipped, locked
				FROM Cards
				WHERE game = $game_id AND last_change >= '$time';";
		
		//echo "\n\n" . $sql . "\n\n";
		$result = execute_query($sql);
		$tableString = '{"time":"' . $time . '","query":'
			. php_entity_encode($result) . '}';
		echo $tableString;
	}
	
	//lock = -1 means the card is unlocked
	function secure_lock()
	{
		global $mysqli;
		global $customDelim;
		
		$game_id = $_POST['game_id'];
		$card_id = $_POST['card_id'];
		$player_id = $_POST['player_id'];
		
		$time = time();
		$time = date('H:i:s', $time);
		
		$sql = "	UPDATE Cards C
				SET C.locked = $player_id, last_change = '$time'
				WHERE C.locked = -1 AND C.game = $game_id AND C.cid = '$card_id' ;";
				
		//echo "\n\n" . $sql . "\n\n";
		
		$result = execute_query($sql);
		if($mysqli->affected_rows != 0){
			//echo "They got the lock!";
			echo "1";
			
		} else {
			//echo "Somebody has it locked!";
			echo "0";
		}
	}
	
	//Returns 1 on successful release.
	//Returns 0 on a failed release: user did not have possession of the 
	//	CID and game sent in.
	function release_lock()
	{
		global $mysqli;
		global $customDelim;
		
		$game_id = $_POST['game_id'];
		$card_id = $_POST['card_id'];
		$player_id = $_POST['player_id'];
		
		$time = time();
		$time = date('H:i:s', $time);
		
		$sql = "	UPDATE Cards C
				SET C.locked = -1, last_change = '$time'
				WHERE C.locked = $player_id AND C.game = $game_id AND C.cid = '$card_id' ;";
				
		//echo "\n\n" . $sql . "\n\n";
		
		$result = execute_query($sql);
		if($mysqli->affected_rows != 0){
			//echo "Lock Released";
			echo "1";
			
		} else {
			//echo "Problems";
			echo "0";
		}
	}
	
	
	//Card must be unlocked (-1) to be flippable.
	function flip_card()
	{
		global $mysqli;
		global $customDelim;
		
		$game_id = $_POST['game_id'];
		$card_id = $_POST['card_id'];
		$flipped = $_POST['flipped'];
		
		$time = time();
		$time = date('H:i:s', $time);
		
		$sql = "	UPDATE Cards C
				SET C.flipped = $flipped, C.last_change = '$time'
				WHERE C.locked = -1 AND C.cid = '$card_id' AND C.game = $game_id;";
		
		//echo "\n\n" . $sql . "\n\n";
		
		$result = execute_query($sql);
		if($mysqli->affected_rows != 0){
			//echo "Card Flipped!";
			echo "1";
			
		} else {
			//echo "Card not flipped";
			echo "0";
		}
	}
	
	function release_locks()
	{
		$game_id = $_POST['game_id'];
		$player_id = $_POST['player_id'];
		
		//die("Got vars");
		
		$sql = "	SELECT C.cid
				FROM Cards C
				WHERE C.locked = $player_id AND C.game = $game_id;";
		//die("Initiated function");
		$result = execute_query($sql);
		$tableString = php_entity_encode($result);
		echo $tableString;

		
		$sql2 = "	UPDATE Cards C
				SET C.locked = -1
				WHERE C.locked = $player_id AND C.game = $game_id;";
		$result = execute_query($sql2);
	}
?>