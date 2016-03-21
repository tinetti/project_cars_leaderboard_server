SavedRaces = new Mongo.Collection("savedRaces");
UnsavedRaces = new Meteor.RedisCollection("redis");

if (Meteor.isServer) {
  Meteor.publish("savedRaces", function () {
    return SavedRaces.find({});
  });
  Meteor.publish("unsavedRaces", function () {
    return UnsavedRaces.matching("race-*");
  });
}

if (!Meteor.isClient) {
} else {
  Meteor.subscribe("savedRaces");
  Meteor.subscribe("unsavedRaces");

  Template.body.helpers({
    savedRaces: function () {
      return SavedRaces.find({}, {sort: {createdAt: -1}});
    },
    unsavedRaces: function () {
      return UnsavedRaces.matching("race-*");
    }
  });

  Template.editRace.helpers({
    editedRace: function () {
      return Session.get("editedRace");
    }
  });

  Template.body.events({
    "click .create-race": function (event) {
      var raceInfo = {
        driver: Meteor.user().username
      };

      Session.set("editedRace", raceInfo);
    }
  });

  Template.editRace.events({
    "submit .save-race": function (event) {
      event.preventDefault();

      function v(name) {
        var field = event.target[name];
        return field ? field.value : null;
      }

      // Get values from form element
      var fields = ["_id", "driver", "lapTime", "carName", "carClassName", "trackLocation", "trackVariation", "createdAt", "createdBy", "modifiedAt", "modifiedBy"];
      var raceInfo = {};
      for (var i = 0; i < fields.length; i++) {
        raceInfo[fields[i]] = v(fields[i]);
      }

      // Insert a race into the collection
      Meteor.call("saveRace", raceInfo);

      // Clear race
      Session.set("editedRace", null);
    },
    "click .cancel": function (event) {
      Session.set("editedRace", null);
    }
  });

  Template.raceTableRow.events({
    "click .edit": function () {
      Session.set("editedRace", this);
    },

    "click .delete": function () {
      Meteor.call("deleteRace", this._id);
    }
  });

  Accounts.ui.config({
    passwordSignupFields: "USERNAME_ONLY"
  });
}

Meteor.methods({
  saveRace: function (raceInfo) {
    // Make sure the user is logged in before inserting a race
    if (!Meteor.userId()) {
      throw new Meteor.Error("not-authorized");
    }

    if (raceInfo._id) {
      SavedRaces.update({_id: raceInfo._id}, {
        _id: raceInfo._id,
        driver: raceInfo.driver,
        lapTime: raceInfo.lapTime,
        carName: raceInfo.carName,
        carClassName: raceInfo.carClassName,
        trackLocation: raceInfo.trackLocation,
        trackVariation: raceInfo.trackVariation,
        createdAt: raceInfo.createdAt,
        createdBy: raceInfo.createdBy,
        modifiedAt: new Date(),
        modifiedBy: Meteor.userId()
      });
    } else {
      SavedRaces.insert({
        driver: raceInfo.driver,
        lapTime: raceInfo.lapTime,
        carName: raceInfo.carName,
        carClassName: raceInfo.carClassName,
        trackLocation: raceInfo.trackLocation,
        trackVariation: raceInfo.trackVariation,
        createdAt: new Date(),
        createdBy: Meteor.userId()
      });
    }
  },
  deleteRace: function (raceId) {
    if (!Meteor.userId()) {
      // Make sure the user is logged in before deleting a race
      throw new Meteor.Error("not-authorized");
    }

    SavedRaces.remove(raceId);
  }
});