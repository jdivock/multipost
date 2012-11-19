// Home module
define([
  // Application.
  "app"
],

// Map dependencies from above array.
function(app) {

  // Create a new module.
  var Session = app.module();

  // Default Model.
  Session.Model = Backbone.Model.extend({
    url: app.prefix + "/checkSessions"
  });

  // Default View.
  Session.View = Backbone.View.extend({
    template: "sessions",

    initialize: function(){
      this.model.on("change", function() {
        console.log(this.model.toJSON())
        this.render();
      }, this);
    },

    serialize: function() {
      return { tumblr: true, evernote: false, mybb: true }
    }
  });

  // Return the module for AMD compliance.
  return Session;

});
