'use strict';

var cache = require('./cache.js');
var winston = require('winston');

winston.level = 'debug';

module.exports.listRaces = function () {
    return cache.listTelemetryPackets().then(function (telemetry_packets) {
        return telemetry_packets;
    });
};