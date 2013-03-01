//= require rsvp/main
//= require rsvp/handlebars_helpers
//= require vendor/jquery.serialize-object

// on-load initialization
(function() {
  window.onerror = RSVP.onerror

  RSVP.processHash();

  $(window).on('hashchange', RSVP.processHash);
})();
