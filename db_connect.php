<?php
	
	//Establish connection to the database: "address", "username", "password", "db"
		//This mysqli object must be global to allow for escaping strings before they are
		//queried.
	$mysqli = new mysqli("oniddb.cws.oregonstate.edu", "cartejac-db", "zBhmQFAJB48y4N7s", "cartejac-db");
	if($mysqli->connect_errno != 0){
		die("Connection error: " . $mysqli->connect_errno . ".  Message: " . $mysqli->connect_error);
	}else{
		//echo "We read connection...\n";
		//echo $mysqli->host_info;
	}
	
	
	/******This function dies when the query doesn't work**********/
	/***************************************************
	** Function: execute_query()
	** Description: An easy-to-use function for executing queries
	**	against the hardcoded mySQL database above.
	** Input: The function below - execute_query() - will take a string as the query.
	** Preconditions: The string has already been ESCAPED (added backslashes in front so that ' " etc dont mess up query.
	** Returns: A mysqli_result object, TRUE or FALSE with a printed textual
	**	error has been returned. NOTE: All unaccounted for errors should be grouped together
	**	in a default case statement in the JS.
	***************************************************/
	function execute_query($query){
		//Get the global mysqli
		global $mysqli;
		
		//Execute the query
		$result = $mysqli->query($query);
		if($result){
			return $result;
		}else{
			die("<br/> mySQL Error Code: " . $mysqli->errno . " with message " . $mysqli->error);
		}
	}
	
	//$username has already been escaped
	/*function get_ID($username){
		$query = "SELECT U.userID
				FROM Trader_User U
				WHERE U.loginName = '$username';";
		
		$result = execute_query($query);
		if($result->num_rows == 1){
			//Good, send back the name
			$onlyRow = $result->fetch_row();
			return $onlyRow[0];
			
		}else{
			die("Error: get_ID() returned more than one user given the username $username.");
		}
	}*/
?>