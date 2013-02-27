var RSVP = (function() {
  function changeInvitation(data, textStatus, jqXHR) {
    RSVP.showFormPane(data)
  }

  return {
    showFindInvitationPane: function() {
      $('#pane').html(Handlebars.templates.rsvp_find_invitation)
      $('form').submit(function() {
        RSVP.get($('#rsvp-id').val())
        return false;
      })
    },

    showFormPane: function(invitation) {
      $('#pane').html(Handlebars.templates.rsvp_response_form(invitation))
    },

    get: function(code) {
      $.ajax('/invitations/' + code)
        .done(changeInvitation)
        .fail(function() { console.log('Error'); console.log(arguments) })
    }
  }
})();
