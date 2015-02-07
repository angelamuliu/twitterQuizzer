
// Note: Users is an array of arrays that contain the actual user, this is unintentional but we'll deal
// To acces: users[i][0] -> user object
users = [];
user = "not set";
score = 0;

function getUserTweets(user_id) {
	$.ajax({
		url: '/getTweet/' + user_id,
		type: 'GET',
		// Update DOM with embeded tweet and choices
		success: function(result) {
			console.log(result);
			$("div#theTWEET").html(result);
			insertChoices();
		}
	})
}

function insertChoices() {
	for (var i=0; i<users.length; i++) {
		var user = users[i][0];
		$("div#theANSWERS").append("<button class=\"answer\" id=\"" + user.id_str + "\">" + user.screen_name + "</button>");
	}
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
		$("#startpage").fadeOut();
		var twittername = $("#twitter_handle").val();
		$.ajax({ // Submit a name and get friends
			url: '/startGame/' + twittername,
			type: 'GET',
			success: function(result) { // Results a JSON string of friends
				console.log(result);
				users = JSON.parse(result).users;
				users = extractFour(users);
				user = getRandomUser(users);
				console.log(user);
				getUserTweets(user.id);
			}
		})
	})




})