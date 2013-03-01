var RSVP = (function() {
  function changeInvitation(data, textStatus, jqXHR) {
    RSVP.loadedCode = data.invitation.id;
    RSVP.loadedData = data;
    RSVP.showFormPane(data)
  }

  function getFailed(jqXHR) {
    requestFailed(jqXHR);
    appendFlash('badnews', "Please verify the code from your invitation envelope and try again. The code is on a white card separate from the main invitation.")
  }

  function updateSuccessful() {
    flash('goodnews', "RSVP update received. Thanks!");
    RSVP.loadedData = RSVP.formData();
  }

  function requestFailed(jqXHR) {
    var contentType = jqXHR.getResponseHeader('Content-Type');
    if (jqXHR.status && 400 <= jqXHR.status && jqXHR.status < 500 && /json/.test(contentType)) {
      displayErrors(JSON.parse(jqXHR.responseText));
    } else {
      clearFlash();
      // show general error box
    }
  }

  function flash(kind, message) {
    var elt = $('#result-flash')
    elt.stop().removeClass().addClass(kind).html(message).css('opacity', 1);
    if (kind === 'goodnews') {
      elt.fadeOut(30000, function () {
        elt.html('');
      });
    }
  }

  function appendFlash(kind, message) {
    flash(kind, $('#result-flash').html() + message)
  }

  function clearFlash() {
    $('#result-flash').html('').removeClass();
  }

  function displayErrors(errors) {
    // top-level errors key present
    if (errors['errors']) {
      flash('badnews', Handlebars.templates.rsvp_errors_list(errors));
    }
  }

  function overlayLoadingPane(message) {
    var toCover = $('#pane');

    createLoadingPaneIfNecessary(toCover);

    var loading = $('#loading')
      .width(toCover.width())
      .height(toCover.height())
      .css(toCover.position())
      .fadeIn(250);

    var loadingMessage = $('#loading-message');

    loadingMessage.css({
      top: loading.innerHeight() / 2 - loadingMessage.outerHeight() / 2,
      left: loading.innerWidth() / 2 - loadingMessage.outerWidth() / 2
    }).html(message)
  }

  function createLoadingPaneIfNecessary(toCover) {
    if ($('#loading')[0]) return;
    toCover.prepend('<div id="loading"><div id="loading-message"></div></div>');
  }

  function dropLoadingPane() {
    $('#loading').fadeOut(250);
  }

  /*
   * Recursively performs the following substitutions over an array or object:
   * - "" into null
   * - "true" into true
   * - "false" into false
   */
  function coerceFormValues(object) {
    if (object instanceof Array) {
      _.each(object, coerceFormValues);
    } else if (typeof object == 'object') {
      for (prop in object) {
        if (object.hasOwnProperty(prop)) {
          var value = object[prop];
          if (typeof value == 'object') {
            object[prop] = coerceFormValues(value);
          } else if (value === "") {
            object[prop] = null;
          } else if (value === "true") {
            object[prop] = true;
          } else if (value === "false") {
            object[prop] = false;
          }
        }
      }
    }
    return object;
  }

  /*
   * Provides a list of nested properties where the two given objects differ.
   * Not general purpose -- assumes that objects have approximately the same
   * structure.
   */
  function differences(o1, o2, path) {
    var d = [];

    if (o1 instanceof Array) {
      d = d.concat(arrayDifferences(o1, o2, path));
    } else if (typeof o1 == 'object' && o1 != null && o2 != null) {
      d = d.concat(objectDifferences(o1, o2, path));
    } else {
      if (o1 !== o2) {
        d.push([path, o1, o2])
      }
    }

    return d;
  }

  function arrayDifferences(a1, a2, path) {
    var d = [];

    if (a1.length != a2.length) {
      d.push([path + ".length", a1.length, a2.length]);
    }
    var len = _.min([a1.length, a2.length]);
    for (var i = 0 ; i < len ; i++) {
      d = d.concat(differences(a1[i], a2[i], path + "[" + i + "]"));
    }

    return d;
  }

  function objectDifferences(o1, o2, path) {
    var d = [];

    var all_keys = _.union(_.keys(o1), _.keys(o2));
    _.each(all_keys, function(key) {
      var subpath = path == "" ? key : path + "[" + key + "]";

      if (o1.hasOwnProperty(key) && o2.hasOwnProperty(key)) {
        d = d.concat(differences(o1[key], o2[key], subpath));
      } else if (o1.hasOwnProperty(key)) {
        d.push([subpath, o1[key], undefined])
      } else if (o2.hasOwnProperty(key)) {
        d.push([subpath, undefined, o2[key]])
      }
    });

    return d;
  }

  return {
    loadedCode: null,
    loadedData: null,

    formData: function() {
      return coerceFormValues($('form').serializeObject());
    },

    formChanges: function() {
      return differences(RSVP.loadedData, RSVP.formData(), '')
    },

    showFindInvitationPane: function() {
      $('#pane').html(Handlebars.templates.rsvp_find_invitation);
      $('form').submit(function() {
        RSVP.get($('#rsvp-id').val());
        return false;
      })
    },

    showFormPane: function(rsvpData) {
      location.hash = "code=" + rsvpData.invitation.id;
      $('#pane').html(Handlebars.templates.rsvp_response_form(rsvpData));
      $('form').submit(function() {
        RSVP.put(RSVP.formData());
        return false;
      });
    },

    overlayLoadPane: function(message) {
      overlayLoadPane(message)
    },

    processHash: function() {
      var code, matches;

      matches = /code=(\w+)/.exec(location.hash)
      if (matches) {
        code = matches[1];
      }

      if (!code) {
        RSVP.showFindInvitationPane();
      } else if (code != RSVP.loadedCode) {
        RSVP.showFindInvitationPane();
        $('#rsvp-id').val(code);
        $('form').submit();
      }
    },

    get: function(code) {
      if (!code || code == "") {
        clearFlash();
        return;
      }

      if (code.toUpperCase() == 'W3D4KR') {
        flash('goodnews', "Very funny. Please enter your actual invitation code. It's on a white card in your invitation envelope.")
        return;
      }

      overlayLoadingPane('Searching...');

      $.ajax('/invitations/' + code)
        .done(changeInvitation)
        .fail(getFailed)
        .always(dropLoadingPane);
    },

    put: function(data) {
      overlayLoadingPane('Updating...');

      var options = {
        type: 'PUT',
        data: JSON.stringify(data),
        contentType: 'application/json'
      }

      $.ajax('/invitations/' + data.invitation.id, options)
        .done(updateSuccessful)
        .fail(requestFailed)
        .always(dropLoadingPane);
    }
  }
})();
