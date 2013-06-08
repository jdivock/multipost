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
    url: "/checkSessions"
  });

  // Default View.
  Session.View = Backbone.View.extend({
    template: "sessions",

    initialize: function(){
      this.model.on("change", function() {
        console.log("MODEL CHANGED");
        this.render();
      }, this);
    },

    data: function(){
      console.log("DATA");
    },

    serialize: function() {
     console.log("SERIALIZE");

     var ret = this.model ? this.model.toJSON() : {};
      console.log(ret);
      return { session: ret }
    }
  });

  // Return the module for AMD compliance.
  return Session;

});
