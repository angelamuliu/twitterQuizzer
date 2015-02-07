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

    self.app.get("/test", function(request, response) {
      client.get('friends/ids', {screen_name: 'officialjaden'}, function(error, tweets, response){
        if(error) throw error;
          console.log(tweets);  // The friends
      });

    });

  };
}; 

var sss = new SimpleStaticServer();
sss.start();






