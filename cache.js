'use strict';

var winston = require('winston');

winston.level = 'debug';

var redis = require('redis');
var client = redis.createClient();

var bluebird = require('bluebird');

bluebird.promisifyAll(redis.RedisClient.prototype);
bluebird.promisifyAll(redis.Multi.prototype);

const TELEMETRY_PACKETS = 'telemetry_packets';

client.on('error', function (err) {
    console.log('Error ' + err);
});

exports.clearTelemetryPackets = function () {
    return client.delAsync(TELEMETRY_PACKETS).then(function (res) {
        winston.debug('cache.js - clear - res: ' + JSON.stringify(res));
        return res;
    });
};

exports.listTelemetryPackets = function () {
    return client.lrangeAsync(TELEMETRY_PACKETS, 0, 1000).then(function (res) {
        winston.debug('cache.js - list - res: ' + JSON.stringify(res));
        var packets = [];
        for (var i = 0; i < res.length; i++) {
            packets.push(JSON.parse(res[i]));
        }
        return packets;
    });
};

exports.pushTelemetryPacket = function (packet, callback) {
    var json = JSON.stringify(packet);
    return client.lpushAsync(TELEMETRY_PACKETS, json).then(function (res) {
        winston.debug('cache.js - push - packet: ' + json);
        winston.debug('cache.js - push - res: ' + JSON.stringify(res));
        return res;
    });
};