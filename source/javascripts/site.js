#= require 'vendor/mustache'
#= require 'vendor/underscore'

(function() {
  $('a.comingsoon').click(function(e) {
    alert("The " + this.innerHTML + " page is coming soon.")
    return false;
  })
})()
