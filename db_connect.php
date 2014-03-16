<?php
	
	//Connection Constructor	
	//Establishes connection to the database: "address", "username", "password", "db"
	//		then error checks
	$mysqli = new mysqli("oniddb.cws.oregonstate.edu", "cartejac-db", "zBhmQFAJB48y4N7s", "cartejac-db");
	if($mysqli->connect_errno != 0){
		die("Connection error: " . $mysqli->connect_errno . ".  Message: " . $mysqli->connect_error);
	
	}
	
	
	/******This function dies when the query doesn't work**********/
	/***************************************************
	** Function: execute_query()
	** Description: An easy-to-use function for executing queries
	**	against the hardcoded mySQL database above.
	** Input: The function below - execute_query() - will take a string as the query.
	** Preconditions: The string has already been ESCAPED 
	** Returns: A mysqli_result object, TRUE or FALSE with a printed textual
	**	error has been returned.
	***************************************************/
	function execute_query($query){
		global $mysqli;
		
		//Execute the query
		$result = $mysqli->query($query);
		if($result){
			return $result;
			
		}else{
			die("<br/> mySQL Error Code: " . $mysqli->errno . " with message " . $mysqli->error);
		}
	}
?>