(function() {
  function latlngForPlace(placeElement) {
    var coords = $(placeElement).attr('data-geo').split(',')
    return new L.LatLng(coords[0], coords[1])
  }

  function initialPoint() {
    return latlngForPlace($('li#ceremony'));
  }

  function setToDefaultBounds() {
    // compute bounding box
    var minBounds = new L.LatLngBounds(initialPoint(), initialPoint());
    console.log(minBounds);
    $('li.place').each(function() {
      minBounds.extend(latlngForPlace(this))
    });
    console.log("Computed location bounds", minBounds.toBBoxString())

    // compute portion of map space covered by text box
    var contentWidth = $('#content').width()
    var locationsOffset = $('#locations').position().left
    var locationsFraction = (contentWidth - locationsOffset) / contentWidth
    console.log("Locations box takes ", locationsFraction, " of width")

    var minBoundsWidth = minBounds.getNorthEast().lng - minBounds.getNorthWest().lng
    var newDesiredWidth = minBoundsWidth / (1 - locationsFraction);
    var eastPad = newDesiredWidth - minBoundsWidth;
    console.log("Base width is ", minBoundsWidth, "deg. Need ", newDesiredWidth, "deg, so pad with ", eastPad)
    minBounds.extend([minBounds.getNorthEast().lat, minBounds.getNorthEast().lng + eastPad])
    console.log("Extended location bounds", minBounds.toBBoxString())

    map.fitBounds(minBounds.pad(0.1));
  }

  var map = L.map('map');

  L.tileLayer('http://{s}.tile.cloudmade.com/faf2b5539ca34ebcb69982fa1aa206b2/997/256/{z}/{x}/{y}.png', {
    attribution: 'Map data &copy; <a href="http://openstreetmap.org">OpenStreetMap</a> contributors, <a href="http://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, Imagery © <a href="http://cloudmade.com">CloudMade</a>',
    maxZoom: 18
  }).addTo(map);

  setToDefaultBounds();

  // set markers
  $('li.place').each(function() {
    var coords = latlngForPlace(this);
    var title = $(this).children('h4')[0].innerHTML;
    L.marker(coords, { title: title }).addTo(map);
  })
})()
