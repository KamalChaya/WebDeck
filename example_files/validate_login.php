<?php
function validate_login($con){
	$query = "SELECT *
			 FROM Users_Prefers U
			 WHERE U.email = '${_POST['email']}' AND
			 	   U.password = '${_POST['password']}'";
	$result = mysqli_query($con, $query);
	$row = mysqli_fetch_array($result);
	if(!$row){
		echo "<span class='error'>Invalid email or password.</span>";
		return false;
	}
	else{
		$_SESSION['uid'] = $row['uid'];
		$_SESSION['last'] = $row['lastname'];
		$_SESSION['first'] = $row['firstname'];
		return true;
	}
}
?>