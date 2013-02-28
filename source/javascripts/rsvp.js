//= require rsvp/main
//= require rsvp/handlebars_helpers
//= require vendor/jquery.serialize-object

// on-load initialization
(function() {
  RSVP.showFindInvitationPane();
  RSVP.processHash();

  $(window).on('hashchange', RSVP.processHash);
})();
