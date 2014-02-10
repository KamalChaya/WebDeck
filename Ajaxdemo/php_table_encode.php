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
	$customDelim = '~';
	//include("./bookTrader_test_harnesses.php");
	
	function php_entity_encode($result){
		/*
		global $customDelim;
		$tableString = "";
		
		//Set up the header: two delims, field/row counts, field names
		$tableString .= $customDelim . $customDelim;
		$tableString .= ($result->field_count - 1) . $customDelim . $result->num_rows;
		//skip the id column, set $i at 1, not zero
		for($i = 1; $i < $result->field_count; $i  = $i + 1){
			$field = $result->fetch_field_direct($i);
			$tableString .= $customDelim . $field->name;
		}
		$tableString .= $customDelim . $customDelim;
		
		//Enter all of the rows into the string
		$tableString .= get_rows($result);
		
		//Return the result for processing/echoing
		return $tableString;
		*/

		$returnArray = array();

		$tmp = array();
		while($row = $result->fetch_object()) {
			$tmp = $row;
			array_push($returnArray, $tmp);
		}

		return json_encode($returnArray);
	}
	
	
	
	//This one will be slightly different, we will need to think up a meaningful ID
	//	and send it over along with all columns as fields.
	/***************************************************
	** Function : php_relationship_encode()
	** Description : This function will take a relationship, which is comprised of multiple
	**	keys, and translate it into an decodable table for JS.
	** Input : $result - a valid mysqli_result object (probably SELECT query)
	** Output: A string with the form (delim = ~) "~~#fields~#records~field1~field2~field3...~~fieldval1~fieldval2...~~"
	**	Unlike entity_encode(), ALL COLUMNS are in the field names section and ALL COLUMNS
	**	should be represented in the resulting JS table. The field count reflects this.
	******************************************************/
	function php_relationship_encode($result){
		global $customDelim;
		$tableString = "";
		
		//Create Header
		$tableString .= $customDelim . $customDelim;
		$tableString .= $result->field_count . $customDelim . $result->num_rows;
		for($i = 0; $i < $result->field_count; $i  = $i + 1){
			$field = $result->fetch_field_direct($i);
			$tableString .= $customDelim . $field->name;
		}
		$tableString .= $customDelim . $customDelim;
		
		//Get the records
		$tableString .= get_rows($result);
		
		return $tableString;
	}
	
	
	/*********************************************
	** Function: get_rows()
	** Description : The method for encoding rows in both the entiy and relationship encode
	**	functions is very similar: Take all information and put it in a string, so
	**	that's what this function does. It searches for double delims in the event of a 
	**	NULL conversion or an empty string.
	** Parameters : $result - a valid mysql_result object
	** Output: It will return the rows encoded as a string with the delim separating
	**	fields and double delim separating records.
	************************************************/
	function get_rows($result){
		global $customDelim;
		
		$returnString = "";
		
		for($i = 0; $i < $result->num_rows; $i = $i + 1){
			//echo "Adding row: " . $i . "<br/>";
			$currentRow = $result->fetch_row();
			$rowString = implode($customDelim, $currentRow);
			$rowString = str_replace(($customDelim . $customDelim),
								($customDelim . "NULL" . $customDelim),
								($rowString . $customDelim))
								. $customDelim;
			if($rowString[0] == $customDelim){
				$rowString = "NULL" . $rowString;
			}
			
			$returnString .= $rowString;
		}
		
		//echo "$returnString <br/>";
		return $returnString;
	}
	
	
	//This function will perform a task very similar to implode() except that it
	//	places the string "NULL" in where NULL values are encountered.
	//DYSFUNCTIONAL
	/*function implode_null($glue, $inArr){
		$returnString = "";
		foreach($inArr as $value){
			if($value == NULL){
				$returnString .= "NULL" . $glue;
			}else{
				$returnString .= $value . $glue;
			}
		}
		
		return ;
	}*/
?>