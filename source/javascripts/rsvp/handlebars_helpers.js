RSVP.HandlebarsHelpers = (function() {
  function radio(inputName, value, text, selected) {
    var out;

    out = "<label><input type=\"radio\" name=\"" + inputName + "\" value=\"" + value + "\"";
    if (selected) {
      out += " checked";
    }
    out += "> " + text + "</label>";

    return out;
  }

  return {
    ATTENDING_RESPONSES: {
      "has not decided whether to attend": null,
      "will attend": true,
      "regretfully declines": false
    },

    attending_control: function(currentValue, guestIndex) {
      var out = "<ul class='radio-select attending'>\n";

      var inputName = "guests[" + guestIndex + "][attending]";

      _.each(RSVP.HandlebarsHelpers.ATTENDING_RESPONSES, function(dataValue, text) {
        var inputValue = dataValue === null ? '' : dataValue
        out += "<li>" + radio(inputName, inputValue, text, currentValue === dataValue) + "</li>\n";
      });

      out += "</ul>"

      return new Handlebars.SafeString(out);
    },

    ENTREE_CHOICES: [
      "Smoked Beef Brisket",
      "Smoked Pork Loin",
      "Black Bean and Faro Cakes"
    ],

    entree_choice_control: function(currentValue, guestIndex) {
      var out = "<ul class='radio-select entree_choice'>\n";

      var inputName = "guests[" + guestIndex + "][entree_choice]";

      _.each(RSVP.HandlebarsHelpers.ENTREE_CHOICES, function(text) {
        out += "<li>" + radio(inputName, text, text, currentValue === text) + "</li>\n"
      });

      if (currentValue && !_.contains(RSVP.HandlebarsHelpers.ENTREE_CHOICES, currentValue)) {
        out += "<li>" + radio(inputName, currentValue, currentValue + " (off-menu choice)", true) + "</li>\n";
      }

      out += "</ul>"

      return new Handlebars.SafeString(out);
    }
  }
})();

// helper init
(function() {
  _.each(RSVP.HandlebarsHelpers, function (helper, helperName) {
    Handlebars.registerHelper(helperName, helper);
  });
})();
