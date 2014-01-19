<?php session_start(); ?>
<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">
<html xmlns="http://www.w3.org/1999/xhtml">
<head>
<meta http-equiv="Content-Type" content="text/html; charset=utf-8" />
<title>Create New Account</title>
<link rel="stylesheet" type="text/css" href="Format_CameraDB.css">
<style>
.error {color: #FF0000;}
</style>
</head>

<body>

<?php
if($_SERVER['REQUEST_METHOD'] == 'POST'){
	$firstErr = $lastErr = $emailErr = $pw1Err = $pw2Err = $confErr = "";
	$error = 0;
	$first = $last = $email = $pw1 = $pw2 = "";
	
	//Establish connection with mysql
	include 'connect_mysql.php';
	$con = connect_mysql();
	
	if (empty($_POST["first"])){
	   $firstErr = "First name is required";
	   $error = 1;
	}else{
	   $first = test_input($_POST["first"]);
	}
	
	if (empty($_POST["last"])){
	   $lastErr = "Last name is required";
	   $error = 1;
	}else{
	   $last = test_input($_POST["last"]);
	}
	
	if (empty($_POST["email"])){
		$emailErr = "Email is required";
		$error = 1;
	}else{
		$email = test_input($_POST["email"]);
	}
	
	if (empty($_POST["password1"])){
		$pw1Err = "Password is required";
		$error = 1;
	}else{
		$pw1 = test_input($_POST["password1"]);
	}
	
	if (empty($_POST["password2"])){
		$pw2Err = "Password confirmation is required";
		$error = 1;
	}else{
		$pw2 = test_input($_POST["password2"]);
	}
	
	if ($pw1 != $pw2){
		$confErr = "Password mismatch.";
		$error = 1;
	}
	
	if(search_email($con, $email)){
		$emailErr = "This email already exists in the database.";
		$error = 1;
	}
	
	if (!$error){
		create_account($con, $first, $last, $email, $pw1);
		login($con, $email, $pw1);
	}
}
function search_email($con, $email){
	$check_email = "SELECT U.email
					FROM Users_Prefers U
					WHERE U.email = '$email'";
	$result = mysqli_query($con, $check_email);
	return mysqli_fetch_array($result);
}

function create_account($con, $first, $last, $email, $password){
	$query = "INSERT
			 INTO Users_Prefers (firstname, lastname, creationdate, email, password)
			 VALUES ('$first', '$last', CURDATE(), '$email', '$password')";
	mysqli_query($con, $query);
}

function login($con, $email, $password){
	$query = "SELECT *
			 FROM Users_Prefers U
			 WHERE U.email = '$email' AND
			 	   U.password = '$password'";
	$result = mysqli_query($con, $query);
	$row = mysqli_fetch_array($result);
	if(!$row){
		echo "<span class='error'>Invalid email or password.</span>";
	}
	else{
		$_SESSION['uid'] = $row['uid'];
		$_SESSION['first'] = $row['firstname'];
		$_SESSION['last'] = $row['lastname'];
		echo '<script> window.location.assign("WelcomePage.php")</script>';
	}
}
function test_input($data)
{
     $data = trim($data);
     $data = stripslashes($data);
     $data = htmlspecialchars($data);
     return $data;
}
?>

<div class='orangebox'>
<h1>Create a New Account</h1>
<form method='post' action="<?php htmlspecialchars($_SERVER["PHP_SELF"]);?>">
<table>
<tr><td>First Name:</td><td><input type='text' name='first' value='<?php echo $_POST['first']; ?>'/>
	<span class="error"> <?php echo $firstErr;?></span></td></tr>
<tr><td>Last Name:</td><td><input type='text' name='last' value='<?php echo $_POST['last']; ?>'/>
	<span class="error"> <?php echo $lastErr;?></span></td></tr>
<tr><td>Email:</td><td><input type='text' name='email' value='<?php echo $_POST['email']; ?>'/>
	<span class="error"> <?php echo $emailErr;?></span></td></tr>
<tr><td>password:</td><td><input type='password' name='password1' />
	<span class="error"> <?php echo $pw1Err;?></span></td></tr>
<tr><td>confirm password:</td><td><input type='password' name='password2' />
	<span class="error"> <?php echo $pw2Err; echo $confErr;?></span></td></tr>
</table>
<input type='submit' value='Create Account' />
</form>
</div>
</body>
</html>