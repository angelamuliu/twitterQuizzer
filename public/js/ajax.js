
// Thank the lords for this code from https://gist.github.com/buu700/4200601
(function ($) {
 
/**
* @function
* @property {object} jQuery plugin which runs handler function once specified element is inserted into the DOM
* @param {function} handler A function to execute at the time when the element is inserted
* @param {bool} shouldRunHandlerOnce Optional: if true, handler is unbound after its first invocation
* @example $(selector).waitUntilExists(function);
*/
 
$.fn.waitUntilExists	= function (handler, shouldRunHandlerOnce, isChild) {
	var found	= 'found';
	var $this	= $(this.selector);
	var $elements	= $this.not(function () { return $(this).data(found); }).each(handler).data(found, true);
	
	if (!isChild)
	{
		(window.waitUntilExists_Intervals = window.waitUntilExists_Intervals || {})[this.selector] =
			window.setInterval(function () { $this.waitUntilExists(handler, shouldRunHandlerOnce, true); }, 500)
		;
	}
	else if (shouldRunHandlerOnce && $elements.length)
	{
		window.clearInterval(window.waitUntilExists_Intervals[this.selector]);
	}
	
	return $this;
}
 
}(jQuery));

// ---------------------------------------------



// Note: Users is an array of arrays that contain the actual user, this is unintentional but we'll deal
// To acces: users[i][0] -> user object
users = [];
user = "not set";
score = 0;
gamestart = false;

function getUserTweets(user_id) {
	$.ajax({
		url: '/getTweet/' + user_id,
		type: 'GET',
		// Update DOM with embeded tweet and choices
		success: function(result) {
			console.log(result);
			$("div#theTWEET").html(result);
			console.log(gamestart);
			if (!gamestart) {
				insertChoices();
			}
			$("iframe").waitUntilExists(function() {
				console.log("EXISTS!");
				console.log($("iframe").contents().find('.header'));
    			$("iframe").contents().find('.header').hide();
    		}, false);
		}
	})
}

function insertChoices() {
	console.log("INSERT CHOICES");
	gamestart = true;
	// Appends four buttons with usernames that serve as choices
	for (var i=0; i<users.length; i++) {
		var curuser = users[i][0];
		console.log(curuser);
		$("div#theANSWERS").append("<button class=\"answer\" id=\"" + curuser.id_str + "\">" + curuser.screen_name + "</button>");
	}
	// Listener that checks answer and also empties and resends AJAX request for next round
	$(".answer").click(function() {
		var answer_id = $(this).attr('id');
		if (answer_id == user.id_str){
			score +=1;
		}
		$("div#theTWEET").empty();
		user = getRandomUser(users);
		getUserTweets(user.id);
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