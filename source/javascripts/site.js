(function() {
  $('a.comingsoon').click(function(e) {
    alert("The " + this.innerHTML + " page is coming soon.")
    return false;
  })
})()
