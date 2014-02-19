<?php session_start(); ?>
<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">
<html xmlns="http://www.w3.org/1999/xhtml">
<head>
<meta http-equiv="Content-Type" content="text/html; charset=utf-8" />
<title>Login</title>
<link rel="stylesheet" type="text/css" href="Format_CameraDB.css">
<style>
.error {color: #FF0000;}
</style>
</head>

<body>
<div class="orangebox">
<h1>Welcome!</h1>
<br />
<h3>Log in to web deck:</h3>
<form method='post' action="<?php htmlspecialchars($_SERVER["PHP_SELF"]);?>">
<table>
<tr><td>email: </td>
	<td><input type='text' name='email' value='<?php echo $_POST['email']; ?>' /></td>
</tr>
<tr><td>Password:</td>
	<td><input type='password' name='password' /></td>
</tr>
</table>
<br />
<input type='submit' value='Log in' />
</form>

<form action='Create_New_Account.php'>
<input type='submit' value='Create New Account' />
</form>

<?php
if($_SERVER['REQUEST_METHOD'] == 'POST'){
	include "connect_mysql.php";
	include "Validate_Login.php";
	$con = connect_mysql();
	if(validate_login($con)){
		echo '<script> window.location.assign("WelcomePage.php")</script>';
	}
}

?>
</div>
</body>
</html>
