var RSVP = (function() {
  function changeInvitation(data, textStatus, jqXHR) {
    RSVP.showFormPane(data)
  }

  return {
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
    },

    processHash: function() {
      var matches, code;

      matches = /code=(\w+)/.exec(location.hash)
      if (!matches) return;
      code = matches[1];

      $('#rsvp-id').val(code);
      RSVP.get(code);
    },

    get: function(code) {
      $.ajax('/invitations/' + code)
        .done(changeInvitation)
        .fail(function() { console.log('Error'); console.log(arguments) })
    }
  }
})();
