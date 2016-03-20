'use strict';

var cache = require('./cache.js');

// Add the route
var routes = [];
var OK = {"message": "success"};

routes.push({
    method: 'DELETE',
    path: '/api/telemetry_packets',
    handler: function (request, reply) {
        return cache.clearTelemetryPackets().then(function (res) {
            return reply(OK).code(200);
        });
    }
});

routes.push({
    method: 'GET',
    path: '/api/telemetry_packets',
    handler: function (request, reply) {
        return cache.listTelemetryPackets().then(function (res) {
            return reply(res).code(200);
        });
    }
});

routes.push({
    method: 'POST',
    path: '/api/telemetry_packets',
    handler: function (request, reply) {
        var packet = request.payload;
        return cache.pushTelemetryPacket(packet).then(function (res) {
            return reply(OK).code(201);
        });
    }
});

exports.routes = routes;
