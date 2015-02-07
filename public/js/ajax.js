

// Note: Users is an array of arrays that contain the actual user, this is unintentional but we'll deal
// To acces: users[i][0] -> user object
users = [];
user = "not set";
score = 0;
gamestart = false;
gamerounds = 0;

// Gets a single random tweet as a serverside response
function getUserTweets(user_id) {
	try {
		$.ajax({
			url: '/getTweet/' + user_id,
			type: 'GET',
			// Update DOM with embeded tweet and choices
			success: function(result) {
				var tweet_text = JSON.parse(result).text;
				var username = JSON.parse(result).screen_name;
				$("div#front").html(tweet_text);
				$('div#front').linkify();
				$("div#back").html(user.screen_name);
				if (!gamestart) {
					$("div#theSCORE").html("Score: " + score);
					insertChoices();
				}
			}
		})
	} catch(error) {
		console.log(error);

	}
}

function refresh(){
	location.reload(); 
}

function insertChoices() {
	gamestart = true;
	// Appends four buttons with usernames that serve as choices
	for (var i=0; i<users.length; i++) {
		var iconhtml = "<span class=\"glyphicon glyphicon-user\" aria-hidden=\"true\"></span> ";
		var curuser = users[i][0];
		$("div#theANSWERS").append("<button class=\"answer\" id=\"" + curuser.id_str + "\">" + iconhtml + curuser.screen_name + "</button>");
	}
	// Listener that checks answer and also empties and resends AJAX request for next round
	$(".answer").click(function() {
		gamerounds += 1;
		var answer_id = $(this).attr('id');
		if (answer_id == user.id_str){
			$("div#theSCORE").empty();
			score +=1;
			$("div#theSCORE").html("Score: " + score);
		}
		$("div#front").empty();
		$("div#back").empty();
		// Only do 10 rounds, then end the game
		if (gamerounds < 5) {
			user = getRandomUser(users);
			getUserTweets(user.id);
		} else {
			$("div#theANSWERS").fadeOut();
			//add some css changing javascript here for score??? 
			$("div#theSCORE").append("<button id=\"refresh\"> Play again </button>")
			$("div#theSCORE").append("<a class=\"twitter-share-button\"href=\"https://twitter.com/share\" data-text=\"I received " +score+ " points for TwitterQuizzer. How well do you know your friend? \"data-via=\"twitterdev\">Tweet</a><script>window.twttr=(function(d,s,id){var js,fjs=d.getElementsByTagName(s)[0],t=window.twttr||{};if(d.getElementById(id))return;js=d.createElement(s);js.id=id;js.src=\"https://platform.twitter.com/widgets.js\";fjs.parentNode.insertBefore(js,fjs);t._e=[];t.ready=function(f){t._e.push(f);};return t;}(document,\"script\",\"twitter-wjs\"));</script>")
			$("#refresh").click(refresh)
		}
	});
}

// From a list of users, cuts down the list into 4 users
function extractFour(users) {
	updatedList = [];
	while (updatedList.length < 4) {
		var i = Math.floor((Math.random() * users.length)); 
		updatedList.push(users.splice(i, 1));
	}
	return updatedList;
}

// Returns random number from 0 to length of list
function getRandomUser(users) {
	return users[Math.floor((Math.random() * users.length))][0];
}

// ---------------------------------------------

$(document).ready(function() {

	$("#submit_name").click(function() {
		var twittername = $("#twitter_handle").val();
		if (twittername.length === 0 || !twittername.trim()) { // Checking if twittername is just blank spaces
			alert("Please enter a valid twitter handle");
		} else {
			try {
				$("#startpage").fadeOut();
				$.ajax({ // Submit a name and get friends
					url: '/startGame/' + twittername,
					type: 'GET',
					success: function(result) { // Results a JSON string of friends
						users = JSON.parse(result).users;
						if (users.length === 0) { // If user doesn't exist, returned response gives empty array of friends
							alert("Please enter a valid twitter handle");
							$("#startpage").fadeIn();
						} else { // Continue with ajax call to grab tweets
							users = extractFour(users);
							user = getRandomUser(users);
							getUserTweets(user.id);
						}
					}
				})
			} catch(error) {
				alert("Please enter a valid twitter handle");
				$("#startpage").fadeIn();
			}
		}
	})






})