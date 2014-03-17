.------..------..------.     .------..------..------..------.
|W.--. ||E.--. ||B.--. |.-.  |D.--. ||E.--. ||C.--. ||K.--. |
| :/\: || (\/) || :(): ((5)) | :/\: || (\/) || :/\: || :/\: |
| :\/: || :\/: || ()() |'-.-.| (__) || :\/: || :\/: || :\/: |
| '--'W|| '--'E|| '--'B| ((1)) '--'D|| '--'E|| '--'C|| '--'K|
`------'`------'`------'  '-'`------'`------'`------'`------'
	    __          __  _       _____            _    
	    \ \        / / | |     |  __ \          | |   
	     \ \  /\  / /__| |__   | |  | | ___  ___| | __
	      \ \/  \/ / _ \ '_ \  | |  | |/ _ \/ __| |/ /
	       \  /\  /  __/ |_) | | |__| |  __/ (__|   < 
	        \/  \/ \___|_.__/  |_____/ \___|\___|_|\_\
                                               
                                               
--Description--
WebDeck is just like a real deck of cards, online!  Play from anywhere,
with anyone!

--How to set up your very own WebDeck!--
To replicate WebDeck, you'll need a web server and a MySQL server.

	-Web Server:
		Download the WebDeck folder into whatever directory you wish on your
		web server.  This will dictate what website to direct your friends to.
		login: <root sever address>/WebDeck/lobby.php
	-MySQL:
		Tables need to be created on your SQL server, and one of the source
		files will also need to be changed.
			Database Connection: Line 6 of db_connect.php contains the database
			login information. Alter it appropriately.
				$mysqli = new mysqli(<server address>, <user name>, <password>, <database name>);
			Table Creation: Run the following queries on your database.
			
				CREATE TABLE IF NOT EXISTS `Cards` (
				  `uid` int(11) NOT NULL,
				  `cid` varchar(5) DEFAULT NULL,
				  `last_update` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
				  `in_hand` int(11) DEFAULT '0',
				  `x_pos` int(11) DEFAULT '0',
				  `y_pos` int(11) DEFAULT '0',
				  `z_pos` int(11) NOT NULL DEFAULT '0',
				  `flipped` int(11) DEFAULT '0',
				  `game_id` int(11) NOT NULL DEFAULT '0',
				  `locked` int(11) DEFAULT '-1',
				  ` deck_id` int(11) NOT NULL DEFAULT '1',
				  PRIMARY KEY (`uid`,`game_id`)
				) ENGINE=MyISAM  DEFAULT CHARSET=latin1;

				CREATE TABLE IF NOT EXISTS `Games` (
				  `game_id` int(11) NOT NULL,
				  `host` varchar(15) NOT NULL,
				  `description` varchar(140) NOT NULL,
				  UNIQUE KEY `game_id` (`game_id`)
				) ENGINE=MyISAM DEFAULT CHARSET=latin1;

				CREATE TABLE IF NOT EXISTS `User` (
				  username varchar(15) NOT NULL,
				  id int(255) unsigned NOT NULL,
				  UNIQUE KEY username (username),
				  UNIQUE KEY id (id)
				) ENGINE=MyISAM DEFAULT CHARSET=latin1;