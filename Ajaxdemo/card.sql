Card game SQL

Card Table:
	Needs:
		-Position.
		-Flippedness.
		-Owner.
		-Timestamp.
		-Selected...
	
	CREATE TABLE Cards (
				uid			INT AUTO_INCREMENT,
				cid			VARCHAR(5),
				last_change	TIME,
				owner		INT,
				x_pos		INT,
				y_pos		INT,
				flipped		INT,
				game			INT,
				locked			INT,
				
				CONSTRAINT card_id PRIMARY KEY (uid)
	);
	
	Actions:
	//Create card
	INSERT INTO Cards (uid, cid, last_change, owner, x_pos, y_pos, game)
	VALUES (NULL, $card_id, current_time, $owner_id, $x_pos, $y_pos, $game);
	
	//Get game session cards
	SELECT cid, x_pos, y_pos, flipped
	FROM Cards
	WHERE game = $game_id;
	
	//Update position
	UPDATE Cards 
	SET last_change = current_time, x_pos = $x_pos, y_pos = $y_pos
	WHERE cid = $card_id;