var express = require('express'),
	 OAuth = require('oauth').OAuth,
	 Tumblr = require('tumblrwks'),
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
app.get('/', function(request, response){
	//response.send('Working on it');
	if(!request.session.oauth_access_token) {
		response.redirect("/tumblr_login");	
		//response.redirect("/google_login");
	}
	else {
		response.redirect("/getTumblrUserInfo");
	}
});


app.get('/tumblr_login', function(request,response){
	
	var oa = new OAuth("http://www.tumblr.com/oauth/request_token",
						"http://www.tumblr.com/oauth/access_token",
	                  process.env.MULTIPOST_CONSUME_KEY,
	                  process.env.MULTIPOST_SECRET_KEY,
	                  "1.0",
	                  "http://google.com",
	                  //"http://localhost:3000/tumblr_cb"+( request.param('action') && request.param('action') != "" ? "?action="+querystring.escape(request.param('action')) : "" ),
	                  "HMAC-SHA1");

	oa.getOAuthRequestToken(function(error, oauth_token, oauth_token_secret, results){

		console.log("HERE");
	  if(error) {
			console.log('error');
	 		console.log(error);
		}
	  else { 
			// store the tokens in the session
			request.session.oa = oa;
			request.session.oauth_token = oauth_token;
			request.session.oauth_token_secret = oauth_token_secret;
		
			// redirect the user to authorize the token
	   		response.redirect("http://www.tumblr.com/oauth/authorize?oauth_token="+oauth_token);
	  }
	})
})

// Callback for the authorization page
app.get('/tumblr_cb', function(request, response) {
		
	// get the OAuth access token with the 'oauth_verifier' that we received
	
	var oa = new OAuth(request.session.oa._requestUrl,
	                  request.session.oa._accessUrl,
	                  request.session.oa._consumerKey,
	                  request.session.oa._consumerSecret,
	                  request.session.oa._version,
	                  request.session.oa._authorize_callback,
	                  request.session.oa._signatureMethod);
	
    console.log(oa);
	
	oa.getOAuthAccessToken(
		request.session.oauth_token, 
		request.session.oauth_token_secret, 
		request.param('oauth_verifier'), 
		function(error, oauth_access_token, oauth_access_token_secret, results2) {
			
			if(error) {
				console.log('error');
				console.log(error);
	 		}
	 		else {
		
				// store the access token in the session
				request.session.oauth_access_token = oauth_access_token;
				request.session.oauth_access_token_secret = oauth_access_token_secret;
				
	    		response.redirect((request.param('action') && request.param('action') != "") ? request.param('action') : "/getTumblrUserInfo");
	 		}

	});
	
});


app.post('/postTumblr', require_tumblr_login, function(request, response){
		tumblr =  new Tumblr(
						  {
						    consumerKey: request.session.oa._consumerKey,
						    consumerSecret: request.session.oa._consumerSecret,
						    accessToken: request.session.oauth_access_token,
						    accessSecret: request.session.oauth_access_token_secret
						  }, request.session.tumblr_blog + ".tumblr.com"
			);

		tumblr.post('/post', {type: 'text', title: request.body.title, body: request.body.body}, function(json){
		  console.log(json);
		});

		response.send({"status":"ok"})
})

app.get('/getTumblrUserInfo', require_tumblr_login, function(request, response){

	var oa = new OAuth(request.session.oa._requestUrl,
	                  request.session.oa._accessUrl,
	                  request.session.oa._consumerKey,
	                  request.session.oa._consumerSecret,
	                  request.session.oa._version,
	                  request.session.oa._authorize_callback,
	                  request.session.oa._signatureMethod);


	oa.getProtectedResource(
					"http://api.tumblr.com/v2/user/info	", 
					"GET", 
					request.session.oauth_access_token, 
					request.session.oauth_access_token_secret,
					function (error, data, res) {
						console.log("DATA: " + data);
						var feed = JSON.parse(data);

						request.session.tumblr_blog = feed.response.user.blogs[0].name;
						console.log(request.session.tumblr_blog);
						response.write(data);

						
		
						//response.write(JSON.stringify(data));
						response.end();
					}		
				)	
});

function require_tumblr_login(req, res, next) {
	if(!req.session.oauth_access_token) {
		res.redirect("/tumblr_login?action="+querystring.escape(req.originalUrl));
		return;
	}
	next();
};

app.get('/getTumblrInfo', require_tumblr_login, function(request, response){

	var oa = new OAuth(request.session.oa._requestUrl,
	                  request.session.oa._accessUrl,
	                  request.session.oa._consumerKey,
	                  request.session.oa._consumerSecret,
	                  request.session.oa._version,
	                  request.session.oa._authorize_callback,
	                  request.session.oa._signatureMethod);

	console.log("GETTING TUMBLR INFO");

	oa.getProtectedResource(
					"http://api.tumblr.com/v2/user/info	", 
					"GET", 
					request.session.oauth_access_token, 
					request.session.oauth_access_token_secret,
					function (error, data, res) {
						console.log("DATA: " + data);
						var feed = JSON.parse(data);
						response.write(data);
						
						response.end();
					}		
				)	
});


var port = process.env.PORT || 3000;
console.log("listening on http://localhost:" + port);
app.listen(port);