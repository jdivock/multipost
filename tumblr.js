var Tumblr = require('tumblrwks');

/*
  You can get the consumerKey and consumerSecret by registing a tumblr app: http://www.tumblr.com/oauth/apps
*/

var tumblr = new Tumblr(
  {
    consumerKey: 'kS76Vv7DuvXZNR38mJdQgVfy1cqrHigunC3SaDIznt2Qel3fUP'
  }//, "arktest.tumblr.com"
  // specify the blog url now or the time you want to use
);

tumblr.get('/info', {hostname: 'arktest.tumblr.com'}, function(json){
  console.log(json);
});