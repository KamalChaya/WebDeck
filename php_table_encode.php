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
	
	function php_entity_encode($result)
	{
		$returnArray = array();

		$tmp = array();
		while($row = $result->fetch_object()) {
			$tmp = $row;
			array_push($returnArray, $tmp);
		}
		
		//Return the result for processing/echoing
		return json_encode($returnArray);
	}

	function query_trim($query)
	{
		$ret_query = $query;
		$ret_query = trim(preg_replace('/\t+/', ' ', $ret_query));
		$ret_query = trim(preg_replace('/,/', '\,', $ret_query));
		$ret_query = trim(preg_replace('/\n+/', '', $ret_query));

		return $ret_query;
	}

	/*
	make_json usage
		If $result is a SELECTion, the calling function is responsible to call
		php_entity_encode first.
		How to access once returned to the .js file and transformed into a
		JSON object with JSON.parse():
			The query executed:
				<JSON object>.query
			The Game ID being operated on:
				<JSON object>.game_id
			The time of execution:
				<JSON object>.time
			The return value of an UPDATE or INSERT:
				<JSON object>.result
			The values from a SELECT:
				<JSON object>.result[<index>].<field>
	*/
	function make_json($query, $game_id, $time, $result)
	{
		$ret_query = query_trim($query);
		$ret_query = json_encode($ret_query);

		$ret_string = '{"query":' . $ret_query .
						',"game_id":"' . $game_id . '"' .
						',"time":"' . $time . '"' .
						',"result":' . $result . '}';

		return $ret_string;
	}
?>