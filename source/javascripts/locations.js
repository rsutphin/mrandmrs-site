function Locations() {
  var self = this;

  function latlngForPlace(placeElement) {
    var coords = $(placeElement).attr('data-geo').split(',')
    return new L.LatLng(coords[0], coords[1])
  }

  this.Section = function (sectionElt) {
    this.element = sectionElt
    this.elementId = this.element.id
    this.sectionId = this.element.id.replace(/^section-/, '')
    this.title = $(this.element).find('h3').text()

    this.titleDowncase = function () { return this.title.toLowerCase(); }

    this.plural = function () {
      if (this.places.length == 1) {
        return '';
      } else {
        return 's';
      }
    }

    var section = this;
    this.places = _.map($(this.element).find('li.place'),
      function (pElt) { return new self.Place(pElt, section); })
  }

  this.Place = function (placeElt, section) {
    this.section = section
    this.element = placeElt

    this.elementId = placeElt.id
    this.placeId = placeElt.id.replace(/^place-/, '')
    this.iconUrl = $(placeElt).attr('data-icon')

    this.title = $(placeElt).find('h4').text()
    this.descriptionHtml = $(placeElt).find('.description').html()
    console.log(this.descriptionHtml)
    this.popupContent = Handlebars.templates.place_popup_content(this)
    this.latLng = latlngForPlace(placeElt)

    this.markerVisible = true

    this.setMarkerVisible = function (vis) {
      this.markerVisible = vis;
      this.displayMarkerAsAppropriate();
    }

    this.displayMarkerAsAppropriate = function () {
      if (!this.marker) {
        this.marker = L.marker(this.latLng, {
          title: this.title,
          icon: L.icon({
            iconUrl: "images/markers/" + this.iconUrl,
            iconSize: [32, 37],
            iconAnchor: [16, 36],
            popupAnchor: [0, -36]
          })
        });
        this.marker.bindPopup(this.popupContent)
        this.marker.addTo(self.map)
      }

      this.marker.setOpacity(this.markerVisible ? 1 : 0.1)
    }
  }

  this.sections = _.map($('li.section'), function (elt) {
    return new self.Section(elt);
  });

  this.sectionsById = _.reduce(this.sections, function (idx, section) {
    idx[section.sectionId] = section;
    return idx;
  }, {})

  this.places = _.chain(this.sections).
    map(function (section) { return section.places }).flatten().value();

  function initialPoint() {
    return latlngForPlace($('li#ceremony'));
  }

  this.zoomToFitVisibleMarkers = function () {
    // compute bounding box
    var visibleMarkers = _.filter(this.places, function (place) { return place.markerVisible; })
    if (visibleMarkers.length == 0) { return; }

    var minBounds = new L.LatLngBounds(visibleMarkers[0].latLng, visibleMarkers[0].latLng);
    _.each(visibleMarkers, function(place) {
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
      place.displayMarkerAsAppropriate();
    })
  }

  this.createSectionControls = function () {
    $('#locations h2').after(
      Handlebars.templates.locations_section_selector({ sections: this.sections })
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

      $(sectionHeading).after(
        Handlebars.templates.locations_section_display_control(section)
      )
    })

    $('input.show_section').change(function () {
      _.each($('input.show_section'), function (showInput) {
        var section = self.sectionsById[$(showInput).attr('data-section')]
        _.each(section.places, function (place) {
          place.setMarkerVisible(showInput.checked);
        })
      });
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
  window.locations = new Locations();
  console.log(locations);
  locations.setMarkers();
  locations.zoomToFitVisibleMarkers();
  locations.createSectionControls();
  locations.selectSection('wedding');
}())
