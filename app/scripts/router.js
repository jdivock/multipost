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
      "": "index"
    },

    index: function() {

      var sessionModel = new Session.Model();

      app.useLayout("main").setViews({
        // Attach the root content View to the layout.
        "#home": new Home.Views.Layout(),
        
      })//.render();

       new Session.View({model: sessionModel })

      sessionModel.fetch();
      
    }
  });

  return Router;

});
