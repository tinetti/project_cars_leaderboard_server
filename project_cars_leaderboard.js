Laps = new Mongo.Collection("laps");

if (Meteor.isServer) {
//  logger = Meteor.require('winston');

  Meteor.publish("laps", function () {
    return Laps.find({});
  });
  Meteor.startup(function () {
    Api = new Restivus({
      version: 'v1',
      useDefaultAuth: true,
      prettyJson: true
    });

    Api.addCollection(Meteor.users);

    Api.addRoute('laps', {authRequired: true}, {
      get: {
        authRequired: false,
        action: function () {
          return Laps.find({}).fetch();
        }
      },
      post: function () {
        response = this.response;
        done = this.done;

        lap = {
          driver: "",
          lapTime: this.bodyParams.lapTime,
          carName: this.bodyParams.carName,
          carClassName: this.bodyParams.carClassName,
          trackLocation: this.bodyParams.trackLocation,
          trackVariation: this.bodyParams.trackVariation,
          createdAt: new Date(),
          createdBy: this.userId
        };

        if (!lap.carName && !lap.trackLocation) {
          response.statusCode = 400;
          response.write(JSON.stringify({message: "carName and trackLocation are required"}))
        } else {
          Laps.insert(lap, function (err, _id) {
            if (err) {
              responseText = JSON.stringify(err);
            } else {
              lap._id = _id;
              responseText = JSON.stringify(lap);
            }

            response.write(responseText);
          });
        }

        done();

        return true;
      }
    });

//    logger.info("server started");
  });
} else {
  Meteor.subscribe("laps");

  Template.body.helpers({
    savedLaps: function () {
      return Laps.find({driver: {$ne: ""}}, {sort: {createdAt: -1}});
    },
    unsavedLaps: function () {
      return Laps.find({driver: ""}, {sort: {createdAt: -1}});
    }
  });

  Template.editLap.helpers({
    editedLap: function () {
      return Session.get("editedLap");
    }
  });

  Template.body.events({
    "click .create-lap": function (event) {
      var lapInfo = {
        driver: Meteor.user().username
      };

      Session.set("editedLap", lapInfo);
    }
  });

  Template.editLap.events({
    "submit .save-lap": function (event) {
      event.preventDefault();

      function v(name) {
        var field = event.target[name];
        return field ? field.value : null;
      }

      // Get values from form element
      var fields = ["_id", "driver", "lapTime", "carName", "carClassName", "trackLocation", "trackVariation", "createdAt", "createdBy", "modifiedAt", "modifiedBy"];
      var lapInfo = {};
      for (var i = 0; i < fields.length; i++) {
        lapInfo[fields[i]] = v(fields[i]);
      }

      // Insert a lap into the collection
      Meteor.call("saveLap", lapInfo);

      // Clear lap
      Session.set("editedLap", null);
    },
    "click .cancel": function (event) {
      Session.set("editedLap", null);
    }
  });

  Template.lapTableRow.events({
    "click .edit": function () {
      Session.set("editedLap", this);
    },

    "click .delete": function () {
      Meteor.call("deleteLap", this._id);
    }
  });

  Accounts.ui.config({
    passwordSignupFields: "USERNAME_ONLY"
  });
}

Meteor.methods({
  saveLap: function (lapInfo, callback) {
    // Make sure the user is logged in before inserting a lap
    if (!Meteor.userId()) {
      throw new Meteor.Error("not-authorized");
    }

    if (lapInfo._id) {
      Laps.update({_id: lapInfo._id}, {
        _id: lapInfo._id,
        driver: lapInfo.driver,
        lapTime: lapInfo.lapTime,
        carName: lapInfo.carName,
        carClassName: lapInfo.carClassName,
        trackLocation: lapInfo.trackLocation,
        trackVariation: lapInfo.trackVariation,
        createdAt: lapInfo.createdAt,
        createdBy: lapInfo.createdBy,
        modifiedAt: new Date(),
        modifiedBy: Meteor.userId()
      }, callback);
    } else {
      Laps.insert({
        driver: lapInfo.driver,
        lapTime: lapInfo.lapTime,
        carName: lapInfo.carName,
        carClassName: lapInfo.carClassName,
        trackLocation: lapInfo.trackLocation,
        trackVariation: lapInfo.trackVariation,
        createdAt: new Date(),
        createdBy: Meteor.userId()
      }, callback);
    }
  },
  deleteLap: function (lapId) {
    if (!Meteor.userId()) {
      // Make sure the user is logged in before deleting a lap
      throw new Meteor.Error("not-authorized");
    }

    Laps.remove(lapId);
  }
});
