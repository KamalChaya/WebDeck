//test_chat
console.log("attached test_chat.js");
var chat_test_num = 0;
function chat_test_harness()
{
	switch(chat_test_num){
		case 0:
			test_multi_chat();
			break;
		
		case 1:
			test_chat_spec_char();
			break;
		
		case 2:
			test_chat_overflow();
			break;
		
		default:
			break;
	}
	
	chat_test_num++;
}


function test_multi_chat()
{
	console.log("Passing a hello message. Ensure that another screen is open in this game session");
	chat.send("Hello World!", "Jackson");
	console.log("Verify that the hello message showed up on both people's interfaces.");
}

function test_chat_spec_char()
{
	console.log("Attmepting to pass this string '`!@#$%^&*()-+=_~\\' to chat.");
	chat.send("'`!@#$%^&*()-+=_~\\'", "Kamal");
	console.log("Verify that the string is printed.");
}

function test_chat_sep()
{
	console.log("Ensure that two machines are logged into different game sessions.");
	console.log("Submitting a hello message");
	
	chat.send("Hello World!", "Jackson");
	
	console.log("Verify that the message did NOT show up on both interfaces.");
}

function test_chat_overflow()
{
	console.log("Submitting a message longer than the chat box width.");
	
	chat.send("this is a really long test just to make sure that the chat box does not, in-fact, overflow when a user enters a stupidly long message, which we are certain they will because people have this weird tendency to just keep talking even though they really shouldn't", "Jackson--");
	
	console.log("Ensure that the text wraps around the edge of the box.");
	console.log("Submitting enough messages to overflow the chat box height.");
	for (var i = 0; i < 20; ++i){
		chat.send("OMG! Look for overflow!", "Jackson");
	}
	console.log("Verify that the chat box developed a scroll bar and did not paste text off the screen.");
}