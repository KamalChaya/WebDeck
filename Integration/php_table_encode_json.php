<?php
	/******************************************************
	** Function: php_entity_encode()
	** Description: Take valid SELECT query result sets and translate them into a table for
	**	JS usage on the client side.
	** Echo Format: Custom delim ='~' -> ~~#fields~#records~field1~field2...~~record1ID~field1~field2~...~~
	** Parameters: 
	**	$result - a valid mysqli_result object.
	**	"customDelim" - this is a global variable that specifies the custom delimiter used across the site.
	** Assumptions : The FIRST COLUMN OF THE TABLE IS THE ID/PRIMARY KEY
	** Postconditions : A nicely formatted string is RETURNED for js_table_decoder() to
	**	recieve and use. OR an error has been released.
	** Notes:
	**	Watch for NULLs, This leads to an unintended double delim. They are replaced with delimNULLdelim
	*****************************************************/
	
	function php_entity_encode($result){
		$returnArray = array();

		$tmp = array();
		while($row = $result->fetch_object()) {
			$tmp = $row;
			array_push($returnArray, $tmp);
		
		//Return the result for processing/echoing
		return json_encode($returnArray);
	}
?>