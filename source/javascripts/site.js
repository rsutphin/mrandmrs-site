#= require 'vendor/handlebars.runtime.js'
#= require 'vendor/underscore'
#= require 'compiled_templates'

(function() {
  $('a.comingsoon').click(function(e) {
    alert("The " + this.innerHTML + " page is coming soon.")
    return false;
  })
})()
