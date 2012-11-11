var express = require('express'),
	 OAuth = require('oauth').OAuth,
	 querystring = require('querystring');

// Setup the Express.js server
var app = express.createServer();
app.use(express.logger());
app.use(express.bodyParser());
app.use(express.cookieParser());
app.use(express.session({
	secret: "skjghskdjfhbqigohqdiouk"
}));

// Home Page
app.get('/', function(req, res){
	if(!req.session.oauth_access_token) {
		res.redirect("/tumblr_login");	
		//res.redirect("/google_login");
	}
	else {
		res.redirect("/getTumblrInfo");
	}
});


app.get('/tumblr_login', function(req,res){
	
	var oa = new OAuth("http://www.tumblr.com/oauth/request_token",
						"http://www.tumblr.com/oauth/access_token",
	                  process.env.MULTIPOST_CONSUME_KEY,
	                  process.env.MULTIPOST_SECRET_KEY,
	                  "1.0",
	                  "http://google.com",
	                  //"http://localhost:3000/tumblr_cb"+( req.param('action') && req.param('action') != "" ? "?action="+querystring.escape(req.param('action')) : "" ),
	                  "HMAC-SHA1");

	oa.getOAuthRequestToken(function(error, oauth_token, oauth_token_secret, results){

		console.log("HERE");
	  if(error) {
			console.log('error');
	 		console.log(error);
		}
	  else { 
			// store the tokens in the session
			req.session.oa = oa;
			req.session.oauth_token = oauth_token;
			req.session.oauth_token_secret = oauth_token_secret;
		
			// redirect the user to authorize the token
	   		res.redirect("http://www.tumblr.com/oauth/authorize?oauth_token="+oauth_token);
	  }
	})
})

// Callback for the authorization page
app.get('/tumblr_cb', function(req, res) {
		
	// get the OAuth access token with the 'oauth_verifier' that we received
	
	var oa = new OAuth(req.session.oa._requestUrl,
	                  req.session.oa._accessUrl,
	                  req.session.oa._consumerKey,
	                  req.session.oa._consumerSecret,
	                  req.session.oa._version,
	                  req.session.oa._authorize_callback,
	                  req.session.oa._signatureMethod);
	
    console.log(oa);
	
	oa.getOAuthAccessToken(
		req.session.oauth_token, 
		req.session.oauth_token_secret, 
		req.param('oauth_verifier'), 
		function(error, oauth_access_token, oauth_access_token_secret, results2) {
			
			if(error) {
				console.log('error');
				console.log(error);
	 		}
	 		else {
		
				// store the access token in the session
				req.session.oauth_access_token = oauth_access_token;
				req.session.oauth_access_token_secret = oauth_access_token_secret;
				
	    		res.redirect((req.param('action') && req.param('action') != "") ? req.param('action') : "/getTumblrInfo");
	 		}

	});
	
});

app.get('/makeTumblrPost', function(req,res){
	var oa = new OAuth(req.session.oa._requestUrl,
	                  req.session.oa._accessUrl,
	                  req.session.oa._consumerKey,
	                  req.session.oa._consumerSecret,
	                  req.session.oa._version,
	                  req.session.oa._authorize_callback,
	                  req.session.oa._signatureMethod);


})

app.get('/getTumblrInfo', function(req, res){

	var oa = new OAuth(req.session.oa._requestUrl,
	                  req.session.oa._accessUrl,
	                  req.session.oa._consumerKey,
	                  req.session.oa._consumerSecret,
	                  req.session.oa._version,
	                  req.session.oa._authorize_callback,
	                  req.session.oa._signatureMethod);

	console.log("GETTING TUMBLR INFO");

	oa.getProtectedResource(
					"http://api.tumblr.com/v2/user/info	", 
					"GET", 
					req.session.oauth_access_token, 
					req.session.oauth_access_token_secret,
					function (error, data, response) {
						console.log("DATA: " + data);
						var feed = JSON.parse(data);

						console.log(feed.response.user.blogs[0]);
						res.write(data);
						//res.write(JSON.stringify(data));
						res.end();
					}		
				)	
});

app.listen(3000);
console.log("listening on http://localhost:3000");