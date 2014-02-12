<?php
	include('db_connect.php');
	/****************************************************
	Function: init_session()
	Description: Places 52 unflipped, unowned, cards in a specified location
		into the database given a game id.
	Note: Card ids are numeric at the moment.
	***************************************************/
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
	
	function init_session()
	{
		//Constants for now: change when we make lobby system.
		global $suit_map;
		global $card_map;
		$game_id = 4;// $_POST['game_id'];
		$x_pos = 0;//$_POST['x_pos'];
		$y_pos = 0;//$_POST['y_pos'];
		$i = 0;
		foreach($suit_map as $suit){
			foreach($card_map as $card){
				$sql = "	INSERT INTO Cards (uid, cid, last_change, owner, x_pos, y_pos, flipped, game, locked)
							VALUES ($i, '" . $card . $suit ."', current_time, -1, $x_pos, $y_pos, 0, $game_id, -1);";
				echo $sql;
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
	
	init_session();
?>

hello