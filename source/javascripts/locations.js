function Locations() {
  var self = this;

  function latlngForPlace(placeElement) {
    var coords = $(placeElement).attr('data-geo').split(',')
    return new L.LatLng(coords[0], coords[1])
  }

  this.sections = _.map($('li.section'), function (elt) {
    return {
      elementId: elt.id,
      sectionId: elt.id.replace(/^section-/, ''),
      title: $(elt).find('h3').text(),
      titleDowncase: function () { return this.title.toLowerCase(); },
      plural: function() {
        if (this.places.length == 1) {
          return '';
        } else {
          return 's';
        }
      },
      places: _.map($(elt).find('li.place'), function(pElt) {
        return {
          elementId: pElt.id,
          placeId: pElt.id.replace(/^place-/, ''),
          title: $(pElt).find('h4').text(),
          latLng: latlngForPlace(pElt)
        }
      })
    }
  })

  this.places = _.chain(this.sections).
    map(function (section) { return section.places }).flatten().value();

  function initialPoint() {
    return latlngForPlace($('li#ceremony'));
  }

  this.setToDefaultBounds = function() {
    // compute bounding box
    var minBounds = new L.LatLngBounds(initialPoint(), initialPoint());
    _(this.places).each(function(place) {
      minBounds.extend(place.latLng)
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

    this.map.fitBounds(minBounds.pad(0.1));
  }

  this.setMarkers = function () {
    _.each(this.places, function(place) {
      var title = $('#' + place.elementId).find('h4').text();
      L.marker(place.latLng, { title: title }).addTo(self.map);
    })
  }

  this.createSectionControls = function () {
    $('#locations h2').after(
      Mustache.render(
        "<ul id='section_tabs'>{{#sections}}<li id='section_tab-{{sectionId}}' class='section_tab'><a href='#{{sectionId}}' data-section='{{sectionId}}'>{{title}}</a></li>{{/sections}}</ul>",
        { sections: this.sections })
    );
    $('li.section_tab a').click(function () {
      var sectionId = $(this).attr('data-section');
      console.log('Activating', sectionId, 'section from tab action');
      $('li.section h3').hide();
      $('li.section').hide();
      $('li#section-' + sectionId).show();
      $('li.section_tab a').removeClass('selected');
      $('li#section_tab-' + sectionId + ' a').addClass('selected');
      return false;
    });


    _.each($('#locations h3'), function(sectionHeading) {
      var sectionElement = $(sectionHeading).closest('li.section')[0]
      var section = _.find(self.sections, function(s) { return s.elementId == sectionElement.id; })

      // $(sectionHeading).after(
      //   Mustache.render(
      //     "<p><label class='show_section'><input id='show_section-{{id}}' type='checkbox'> Show the {{titleDowncase}} location{{plural}} on the map</label></p>",
      //     section
      //   )
      // )
    })
  }

  this.selectSection = function (sectionId) {
    console.log("Activating", sectionId, 'programatically')
    $('#section_tab-' + sectionId + ' a').click();
  }

  this.map = L.map('map');

  L.tileLayer('http://{s}.tile.cloudmade.com/faf2b5539ca34ebcb69982fa1aa206b2/997/256/{z}/{x}/{y}.png', {
    attribution: 'Map data &copy; <a href="http://openstreetmap.org">OpenStreetMap</a> contributors, <a href="http://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, Imagery © <a href="http://cloudmade.com">CloudMade</a>',
    maxZoom: 18
  }).addTo(this.map);
}

(function() {
  var locations = new Locations();
  console.log(locations);
  locations.setMarkers();
  locations.setToDefaultBounds();
  locations.createSectionControls();
  locations.selectSection('wedding');
}())
