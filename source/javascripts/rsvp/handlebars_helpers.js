RSVP.HandlebarsHelpers = (function() {
  function radio(inputName, value, text, selected) {
    var out;

    out = "<label><input type=\"radio\" name=\"" + inputName + "\" value=\"" + value + "\"";
    if (selected) {
      out += " checked";
    }
    out += "> <span>" + text + "</span></label>";

    return out;
  }

  return {
    evenOdd: function(index) {
      return index % 2 == 0 ? 'even' : 'odd';
    },

    evenOddAfterList: function(list, postListIndex) {
      return ((list.length + postListIndex) % 2 == 0) ? 'even' : 'odd';
    },

    ATTENDING_RESPONSES: {
      "will be there": true,
      "regretfully declines": false,
      "is not sure yet": null
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
        out += "<li>" + radio(inputName, currentValue, currentValue + " <em>(off-menu choice)<em>", true) + "</li>\n";
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
