Races = new Mongo.Collection("races");

if (Meteor.isServer) {
  Meteor.publish("races", function () {
    return Races.find({});
  });
}

if (Meteor.isClient) {
  Meteor.subscribe("races");

  Template.body.helpers({
    races: function () {
      return Races.find({}, {sort: {createdAt: -1}});
    }
  });

  Template.body.events({
    "submit .new-race": function (event) {
      // Prevent default browser form submit
      event.preventDefault();

      // Get values from form element
      var raceInfo = {
        driver: event.target.driver.value,
        carName: event.target.carName.value,
        carClassName: event.target.carClassName.value,
        trackLocation: event.target.trackLocation.value,
        trackVariation: event.target.trackVariation.value
      };

      // Insert a race into the collection
      Meteor.call("addRace", raceInfo);

      // Clear form
      event.target.driver.value = Meteor.user().username;
      event.target.carName.value = "";
      event.target.carClassName.value = "";
      event.target.trackLocation.value = "";
      event.target.trackVariation.value = "";
    }
  });

  Template.race.events({
    "click .delete": function () {
      Meteor.call("deleteRace", this._id);
    }
  });

  Accounts.ui.config({
    passwordSignupFields: "USERNAME_ONLY"
  });
}

Meteor.methods({
  addRace: function (raceInfo) {
    // Make sure the user is logged in before inserting a race
    if (!Meteor.userId()) {
      throw new Meteor.Error("not-authorized");
    }

    Races.insert({
      carName: raceInfo.carName,
      carClassName: raceInfo.carClassName,
      trackLocation: raceInfo.trackLocation,
      trackVariation: raceInfo.trackVariation,
      driver: Meteor.user().username,
      createdAt: new Date(),
      owner: Meteor.userId()
    });
  },
  deleteRace: function (raceId) {
    var race = Races.findOne(raceId);
    if (!Meteor.userId()) {
      // Make sure the user is logged in before deleting a race
      throw new Meteor.Error("not-authorized");
    }

    Races.remove(raceId);
  }
});