RSVP.HandlebarsHelpers = (function() {
  function radio(inputName, value, text, selected, moreInputAttributes) {
    var out = "<label>";

    out += radioOnly(inputName, value, selected, moreInputAttributes)
        + " <span>" + text + "</span></label>";

    return out;
  }

  function radioOnly(inputName, value, selected, moreInputAttributes) {
    var out;

    out = "<input type=\"radio\" name=\"" + inputName + "\" value=\"" + value + "\"";
    if (selected) {
      out += " checked";
    }
    if (moreInputAttributes) {
      out += " " + moreInputAttributes;
    }
    out += ">";

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
      "can't wait!": true,
      "can't come.": false,
      "can't decide.": null
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
      "Beef Brisket",
      "Pork Loin",
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

      if (!currentValue) {
        out += radioOnly(inputName, "", true, "class=\"hidden\"");
      }

      out += "</ul>"

      return new Handlebars.SafeString(out);
    },

    any_rehearsal_dinner: function(guests, options) {
      var any = _.any(this.guests, function(guest) { return guest.invited_to_rehearsal_dinner; })
      if (any) {
        return options.fn(this);
      } else {
        return null;
      }
    },

    ATTENDING_REHEARSAL_DINNER_RESPONSES: {
      "Another dinner on 5/17 sounds tasty": true,
      "Regrets": false,
      "Not sure": null
    },

    attending_rehearsal_dinner_control: function(currentValue, guestIndex) {
      var out = "<ul class='radio-select attending_rehearsal_dinner'>\n";

      var inputName = "guests[" + guestIndex + "][attending_rehearsal_dinner]";

      _.each(RSVP.HandlebarsHelpers.ATTENDING_REHEARSAL_DINNER_RESPONSES, function(dataValue, text) {
        var inputValue = dataValue === null ? '' : dataValue
        out += "<li class=" + dataValue + ">" + radio(inputName, inputValue, text, currentValue === dataValue) + "</li>\n";
      });

      out += "</ul>"

      return new Handlebars.SafeString(out);
    },

  }
})();

// helper init
(function() {
  _.each(RSVP.HandlebarsHelpers, function (helper, helperName) {
    Handlebars.registerHelper(helperName, helper);
  });
})();
