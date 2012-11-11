// Home module
define([
  // Application.
  "app"
],

// Map dependencies from above array.
function(app) {

  // Create a new module.
  var Home = app.module();

  // Default Model.
  Home.Model = Backbone.Model.extend({
  
  });

  // Default Collection.
  Home.Collection = Backbone.Collection.extend({
    model: Home.Model
  });

  // Default View.
  Home.Views.Layout = Backbone.View.extend({
    template: "home"
  });

  // Return the module for AMD compliance.
  return Home;

});
