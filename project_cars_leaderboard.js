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

if (Meteor.isClient) {
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

  Template.body.events({
    "submit .save-race": function (event) {
      // Prevent default browser form submit
      event.preventDefault();

      // Get values from form element
      var raceInfo = {
        driver: event.target.driver.value,
        carName: event.target.carName.value,
        carClassName: event.target.carClassName.value,
        trackLocation: event.target.trackLocation.value,
        trackVariation: event.target.trackVariation.value,
        lapTime: event.target.lapTime.value
      };

      // Insert a race into the collection
      Meteor.call("saveRace", raceInfo);

      // Clear lap time
      event.target.lapTime.value = "";
    }
  });

  Template.raceTableRow.events({
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
  },
  deleteRace: function (raceId) {
    if (!Meteor.userId()) {
      // Make sure the user is logged in before deleting a race
      throw new Meteor.Error("not-authorized");
    }

    SavedRaces.remove(raceId);
  }
});