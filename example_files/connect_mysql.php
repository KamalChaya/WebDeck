<?php
function connect_mysql(){
	$con = mysqli_connect('database_location', 'user', 'password', 'databasename'); 
	if (mysqli_connect_errno($con)){
	echo "Failed to connect to MySQL: " . mysqli_connect_errno();
	}
	return $con;
}
?>
