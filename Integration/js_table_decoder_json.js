//Most people appear to do html formatting in the php page and send back
//What should be put in the user's page... I mean it's more code to send initially
//to change info on the page using JS, but your server won't overload...
/*************************************************
**Name:JSEntityDecoder()
**Description: Will reassemble an AJAX transmitted string that awas once a table
**	Into a multidimensional array using a custom delimiter. This object will also have
**	a size specifying the number of rows the table has.
**Input: tableString - The table to be retransformed. The structure follows the example below:
		"~~# fields~#records~fieldname1~fieldname2...~~record1ID~record1F1~...~~"
		The ID MUST BE the first field of a record and is not recorded with other properties as it is the index
		THE ID IS NOT A FIELDNAME. It is simply an index.
		#Fields - specifies the number of fields of the record (excluding ID)
		#records - specifies the number of records to follow.
	delim - A string that will act as the custom delimiter. 1 delim separates fields, 2 delims separate records
**Preconditions: 
**	1. The # of fields match the number of fields in each record.
**	2. The ID is the first field and it is unique.
**	3. The ID is one field.
**	4. The name of no field is 'size', 'numFields' or 'fieldNames'. 
**	5. The delimiter is actually present in the input string...
**Postconditions: The object with a size, list of field names and the data has been Returned.
**	The number of fields excludes the integer ID used to access the record.
**	All records are sets of strings, but fieldNum and size are numbers
********************************************************/
function JSEntityDecoder(tableString, delim){
	var outputTable = new Object;
	var recordArray = tableString.split(delim + delim);
	/*if(recordArray.length < 3){ alert("Pair of double delimiters not found"); return new Object();}
	var tableHeader = recordArray[1].split(delim);
	var currentRecord;
	
	outputTable.numFields = new Number(tableHeader[0]);
	outputTable.fieldNames = new Array(outputTable.numFields);
	outputTable.size = new Number(tableHeader[1]);
	//alert(recordArray);
	alert("Record Count: " + outputTable.size + "   Table field count: " + outputTable.numFields);
	//do we have the correct number of records??
	if((+outputTable.size) != ((+recordArray.length) - 3)){alert("The record count supplied does not match the number of records detected. Returning undefined object"); return new Object();}
	
	//Fill in the field names (ID is not included)
	var i = new Number();
	var namesFound = new String();
	for(i = 0; i < outputTable.numFields; i++){
		outputTable.fieldNames[i] = new String(tableHeader[2 + i]);
		namesFound  = namesFound + outputTable.fieldNames[i];
	}*/
	
	outputTable = getHeader(tableString, delim);
	
	//alert(namesFound);
	
	//For each record:
	//	1. Does it exist? Deprecated.
	//	2 Does it have the proper number of fields?
	//	3. Does it have an unique ID key in the first field?
	//If so, create a new associative array with a key provided and put in record information.
	//If not, tell the user
	var currentID;
	var k;
	var initialSize = (+outputTable.size);
	for(i = 0; i < initialSize; i++){
		/*if(typeof recordArray[(i + 2)] == 'undefined'){
			alert("Attemtping to read table row that does not exist. Improper count of records.");
			continue;
		}*/
		
		currentRecord = recordArray[(i + 2)].split(delim); //+2 to skip the tableHeader and the empty 0th entry
		//alert(currentRecord);
		//alert("currentRecord.length: " + currentRecord.length + "  outputTable.numFields + 1 = " + (outputTable.numFields + 1));
		if(currentRecord.length != (outputTable.numFields + 1)){
			alert("A record is missing fields. Problematic transmission/encoding, skipping record");
			outputTable.size--;
			continue;
			
		}else{
			currentID = currentRecord[0];
			
			if(outputTable[currentID] != undefined){
				//alert("Truncating Table!");
				alert("Identical IDs: " + currentID + " JSTableDecode terminating.");
				//Preserve the table's size
				outputTable.size = (+i);
				return outputTable;
				
			}else{
				outputTable[currentID] = new Array((+outputTable.numFields));
				k = 1;
				for(key2 in outputTable.fieldNames){
					//alert("Key:" + outputTable.fieldNames[key2]);
					outputTable[currentID][outputTable.fieldNames[key2]] = currentRecord[k];
					k++;
				}
			}
		}
	}
	
	return outputTable;
}

//I am not watching for duplicate rows, I may assume this does not occur
//This function is the same as JSEntityDecoder EXCEPT, it gives each entry
//	its own ID instead of trying to make one from the IDs given. All fields
//	in the mySQL table are in the resulting table.
function JSRelationshipDecoder(tableString, delim){
	var outputTable = new Object;
	allRows = tableString.split(delim + delim);
	outputTable = getHeader(tableString, delim);
	
	//Get the rows themselves
	//	1. We need to give everything its own ID, the keys cannot work here.
	//	2. Does it have the correct number of fields?
	var i  = new Number();
	var currentRow = new String();
	var initialSize = (+outputTable.size);
	for(i = 0; i < initialSize; i++){
		currentRow = allRows[(i + 2)].split(delim);
		if(currentRow.length == outputTable.numFields){
			outputTable[i] = new Array((+outputTable.numFields));
			for(key in currentRow){
				outputTable[i][outputTable.fieldNames[key]] = currentRow[key];
			}
			
		}else{
			alert("A record is missing fields. Problematic transmission/encoding, skipping record");
			outputTable.size--;
			continue;
		}
	}
	
	return outputTable;
}


/*****************************************
** Function: getHeader()
** Description: Functional decomposition for table decoding - This function will
**	read the uniform table header, get its number of rows and fields, store the field names
**	and return this object
** Parameters : tableString - a valid string with the table's information (see JSEntityDecoder)
**		delim - The custom delim for the table string.
** Preconditions : The tablestring and delim are valid as specified in JSEntityDecode
** Postconditions : The new object with field names and record counts has been returned.
******************************************/
function getHeader(tableString, delim){
	var outputTable = new Object();
	var recordArray = tableString.split(delim + delim);
	if(recordArray.length < 3){ alert("Pair of double delimiters not found"); return new Object();}
	var tableHeader = recordArray[1].split(delim);
	var currentRecord;
	
	outputTable.numFields = new Number(tableHeader[0]);
	outputTable.fieldNames = new Array(outputTable.numFields);
	outputTable.size = new Number(tableHeader[1]);
	//alert(recordArray);
	//alert("Record Count: " + outputTable.size + "   Table field count: " + outputTable.numFields);
	//do we have the correct number of records??
	if((+outputTable.size) != ((+recordArray.length) - 3)){alert("The record count supplied does not match the number of records detected. Returning undefined object"); return new Object();}
	
	//Fill in the field names (IDs ARE included)
	var i = new Number();
	var namesFound = new String();
	for(i = 0; i < outputTable.numFields; i++){
		outputTable.fieldNames[i] = new String(tableHeader[2 + i]);
		namesFound  = namesFound + outputTable.fieldNames[i];
	}
	
	return outputTable;
}

//How about a test harness:
function JSEntityDecoder_Test1(){
	var table1 = "~~0~0~~";
	var table2 = "~~1~1~name~~2~jackson~~";
	var table3 = "~~3~3~name~age~gpa~~1~jackson~19~3.0~~2~Logan~17~3.0~~";
	
	//Some error testing
	var table4 = table3 + "3~repeatedIndex~57~3.5~~";
	var table5 = "~~2~3~wrongDelim~addtlInfo~~1-lol-problem~~2~wrongNumFields~~3~realRecord~success?~~";
	//var outputTable = JSEntityDecoder(table1, "~");
	//	printTable(outputTable);
	//outputTable = JSEntityDecoder(table2, "~");
	//	printTable(outputTable);
	//outputTable = JSEntityDecoder(table3, "~");
	//	printTable(outputTable);
	//alert(table4);
	outputTable = JSEntityDecoder(table4, "~");
		printTable(outputTable);
	outputTable = JSEntityDecoder(table5, "~");
		printTable(outputTable);
	outputTable = JSEntityDecoder("lol", "!");
	
	//What if we put in the wrong delimiter. Write a print function. 
}

//How about one for relationships
function JSRelationshipDecoder_Test1(){
	var table1 = "~~3~2~commentID~offerID~completedID~~1~3~NULL~~3~2~NULL~~";
	var table2 = "~~0~0~~";
	var table3 = "~~";
	var table4 = "~~2~3~invalidFieldCount~id2~~whaddup~~2~many~!~~valid~entry~~";
	
	var outputTable = JSRelationshipDecoder(table1, "~");
		printTable(outputTable);
	outputTable = JSRelationshipDecoder(table2, "~");
		printTable(outputTable);
	outputTable = JSRelationshipDecoder(table3, "~");
		printTable(outputTable);
	outputTable = JSRelationshipDecoder(table4, "~");
		printTable(outputTable);
}


//Returns 1 if the record is a non-entity key, returns 0 if it is an entity
function isTableKey(key){
	if(key == "size" || key == "fieldNames" || key == "numFields"){
		//These are non-entity records in the table
		return 1;
	}else{
		//These are entity records
		return 0;
	}
}


function printTable(inputTable){
	var outputString = "";
	
	for(key in inputTable){
		if(key == "size"){
			outputString = "Size: " + inputTable.size + "\n" + outputString;
		}else if(key == "fieldNames"){
			var fieldString = "Fields: ";
			for(key2 in inputTable.fieldNames){
				fieldString = fieldString + inputTable.fieldNames[key2] + "   ";
			}
			
			outputString = outputString + fieldString + "\n";
		}else if(key == "numFields"){
			outputString = "Field Count: " + inputTable.numFields + "\n" + outputString;
		}else{
			var recordString = "Record Id " + key + ": ";
			for(key2 in inputTable[key]){
				if(key2 == 0){
					alert("It's length");
				}
				recordString += key2 + "-" + inputTable[key][key2] + "   ";
			}
			
			outputString = outputString + recordString + "\n";
		}
	}
	
	alert(outputString);
}


/*When you split()...
** you get everything before the first delimiter as a string, everything past the 
** last and everything between them (1+ # of delimiters).
*/

/*In JS objects, you can define new properties at any time. Properties can be looped through
** using the for...in loop: it will go through each property*/
/* The array brackets are the same as just typing out the associative array index without
**	the quotes. Thus, when we add fields, it can be referenced using a string and brackets
**	or just hardcoding. I don't like hardcoding though...*/