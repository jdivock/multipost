define([
  // Application.
  "app",
  "../modules/home"
],

function(app, Home) {

  // Defining the application router, you can attach sub routers here.
  var Router = Backbone.Router.extend({
    routes: {
      "": "index"
    },

    index: function() {
      app.useLayout("main").setViews({
        // Attach the root content View to the layout.
        "#home": new Home.Views.Layout()
      }).render();
    }
  });

  return Router;

});
