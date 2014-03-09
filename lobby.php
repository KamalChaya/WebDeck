<!DOCTYPE html>
	<head>
	<meta http-equiv="Content-Type" content="text/html;charset=utf-8" >
		<title>
			WebDeck Lobby
		</title>
		<script type = 'text/javascript' src = 'http://ajax.googleapis.com/ajax/libs/jquery/1.5.0/jquery.min.js'></script>
		<script type = "text/javascript" src="http://ajax.googleapis.com/ajax/libs/jqueryui/1.8.9/jquery-ui.min.js"></script>
		<script type = "text/javascript" src = "player_class.js"> </script>
		<script type = "text/javascript" src = "tests/lobby_tests.js"> </script>
		<script type = "text/javascript" >

			function launch_game()
			{
				var div = document.getElementById("game_id_input");
				var id = div.value;
				var complete = 0;

				if(id.length > 0) {
					localStorage["game_id"] = id;
					complete = complete + 1;
				}
				else {
					alert("Please enter a game session to join!");
				}

				var userdiv = document.getElementById("username");
				var userid = userdiv.value;

				if(userid.length > 0) {
					localStorage["wd_username"] = userid;
					complete = complete + 1;
				}
				else {
					alert("Please enter a username!");
				}

				if(complete == 2) {
					document.location = 'card_interface.html';
				}
			}
		</script>
		<link rel="stylesheet" type="text/css" href="style.css" />
	</head>
	<body>

		<?php 
			include('db_connect.php');

		$sql = "SELECT *
				FROM Games 
				ORDER BY Games.game_id ASC;";

		$result = execute_query($sql);

		echo "<table border='1'>
		<tr>
		<th>Game ID</th>
		<th>Host</th>
		<th>Description</th>
		</th>";
	
		while($row = mysqli_fetch_array($result)){
			echo "<tr>";
			echo "<td>" . $row['game_id'] . "</td>";
			echo "<td>" . $row['host'] . "</td>";
			echo "<td>" . $row['description'] . "</td>";
			echo "</tr>";
		}
		echo "</table>";

		?>


		<div id = "container">
			<div id = "header">
			</div><!--header-->
			<div id = "main">
			<button onclick='username_tests();'>Run username tests</button>
			<button onclick='game_tests();'>Run game tests</button>
			<div id = 'game_id_form'>
				<label>Username: </label><input type = 'text' id = 'username' />
				<label>Game ID: </label><input type = 'text' id = 'game_id_input' />
				<!--parent.location='http://web.engr.oregonstate.edu/~alltucki/WebDeck/card_interface.html-->
				<button onclick='launch_game();'>Join Game</button>
			</div><!--card_form-->
			
			</div><!--main-->
			<div id = "navigation">
				<a href = ""></a>
				<a href = ""></a>
			</div><!--navigation-->
			<div id = "footer">
				<h6>WebDeck 2014</h6>
			</div><!--footer-->
		</div><!--container-->
	</body>
</html>