<?php
	include('db_connect.php');
	include('php_table_encode.php');
	
	$customDelim = "~";
	
	$op = $_POST['op'];
	
	switch($op){
		case 0: 	//Create the card
			create_card();
			break;
		
		case 1: 	//Move the card
			move_card();
			break;
		
		case 2:	//Get positions
			get_positions();
			break;
		
		case 3:	//Get all of the cards for a session.
			enter_session();
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
		echo "   '".$sql."'      ";
		$res = execute_query($sql);
		if($res == true){
			echo $customDelim . "1" . $customDelim;
		} else {
			echo $customDelim . "0" . $customDelim;
		}
	}
	
	
	function move_card(){
		global $customDelim;
		
		$card_id = $_POST['uid'];
		$x_pos = $_POST['x_pos'];
		$y_pos = $_POST['y_pos'];
		$game = $_POST['game_id'];
		
		$sql = "UPDATE Cards C
				SET last_change = current_time, x_pos = $x_pos, y_pos = $y_pos
				WHERE C.uid = $card_id AND C.locked = 0;";
		
		echo "     " . $sql . "      ";
		$result = execute_query($sql);
		if($result){
			echo $customDelim . "1" . $customDelim;
		} else {
			echo $customDelim . "0" . $customDelim;
		}
	}
	
	
	function enter_session(){
		$game_id = $_POST['game_id'];
		
		echo 'Game ID: ' . $game_id;
		
		$sql = "	SELECT uid, cid, x_pos, y_pos, flipped
				FROM Cards
				WHERE game = $game_id;";
		$result = execute_query($sql);	
		$tableString = php_entity_encode($result);
		echo $tableString;
	}
	
	
	function get_positions(){
		$game_id = $_POST['game_id'];
		
		echo 'Game ID: ' . $game_id;
		
		$sql = "	SELECT uid, cid, x_pos, y_pos, flipped
				FROM Cards
				WHERE game = $game_id;";
		$result = execute_query($sql);	
		$tableString = php_entity_encode($result);
		echo $tableString;
	}
?>