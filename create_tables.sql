
CREATE TABLE chatuser(
	login_name varchar(50) not null,
	user_id varchar(50) not null,
	display_name varchar(50) not null,
	primary key (user_id, login_name))

CREATE TABLE chatline(
	author varchar(50),
	text varchar(200),
	author_id varchar(50),
	primary key (author_id))
	
