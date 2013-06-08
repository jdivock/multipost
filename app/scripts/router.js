define([
  // Application.
  "app",
  "../modules/home",
  "../modules/session"
],

function(app, Home, Session) {

  // Defining the application router, you can attach sub routers here.
  var Router = Backbone.Router.extend({
    routes: {
      "multipost": "index"
    },

    index: function() {
      var sessionModel = new Session.Model();

      app.useLayout("layouts/main").setViews({
        // Attach the root content View to the layout.
          "#home": new Home.View(),
          "#sessions": new Session.View( {'model': sessionModel} )
      }).render();

      sessionModel.fetch();
      
    }
  });

  return Router;

});
