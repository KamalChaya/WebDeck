<?php
	include('db_connect.php')
	include('php_table_encode.php')


	function make_stack() {
		 $game_id = $_POST['game_id']
		 $player_id = $_POST['player_id']

		 $query = "UPDATE Cards C
		 	   SET C.stack = 1 + (SELECT MAX(C.stack) 
                                              FROM Cards C   
			                      WHERE C.game = $game_id)
			   WHERE C.locked = $player_id"

		 $exec = execute_query($query)	   			   		       			       	       	     
		 	   
	}


?>