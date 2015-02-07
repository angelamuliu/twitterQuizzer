var express = require('express'),
    morgan  = require('morgan'),
    path = require('path'),
    Twitter = require('twitter');

var client = new Twitter({
  consumer_key: 'STm827uRYt4mEjJ3NOmlpLNz6',
  consumer_secret: '6cP1UjImS4rr9oQ5NUIqFqgqS2ngAbTJGWVi11ySoZeyBZH83j',
  access_token_key: '3022571680-IWs9l8bBgcXjRsMMKc9Z0nU4TSWj9zi43ip6qFs',
  access_token_secret: 'WS9EE9x3OVcU9BrCQ0Kf7WDluefEu9ZNecmUjsbavBo88'
});

// Create a class that will be our main application
var SimpleStaticServer = function() {

  // set self to the scope of the class
  var self = this;  
  
  /*  ================================================================  */
  /*  App server functions (main app logic here).                       */
  /*  ================================================================  */

  self.app = express();
  self.app.use(morgan('[:date] :method :url :status'));	// Log requests
  self.app.use(express.static(path.join(__dirname, 'public')));	// Process static files

  // Start the server (starts up the sample application).
  self.start = function() {
    self.ipaddress = process.env.OPENSHIFT_NODEJS_IP || "127.0.0.1";
    self.port      = process.env.OPENSHIFT_NODEJS_PORT || 33333;

    //  Start listening on the specific IP and PORT
    self.app.listen(self.port, self.ipaddress, function() {
      console.log('%s: Node server started on %s:%d ...', Date(Date.now() ), self.ipaddress, self.port);
    });

    self.app.get("/startGame/:name", function(request, response) {
      var twitterhandle = request.params.name;
      client.get('friends/list', {screen_name: twitterhandle}, function(error, friends, rawresponse) {
        if(error) throw error;
          console.log(friends);
          response.end(JSON.stringify(friends));
      });
    })

    self.app.get("/getTweet/:userid", function(request, response) {
      var userid = request.params.userid;
      console.log("USER ID: " + userid);
      client.get('statuses/user_timeline', {user_id: userid, count: 10, include_rts: false, exclude_replies: true}, function(error, tweets, rawresponse) {
        if(error) throw error;  
          var randomtweet = Math.floor((Math.random() * tweets.length));
          var tweet = tweets[randomtweet];
          console.log("TWEET: " + tweet);
          var tweetid = tweet.id_str;
          console.log("TWEETID: " + tweetid);
          response.end(JSON.stringify(tweet));
          // client.get('statuses/oembed', {id: tweetid}, function(error, oembedlink, rawresponse) {
          //   response.end(oembedlink.html);
          // })
      });
    })


  };
};

var sss = new SimpleStaticServer();
sss.start();






