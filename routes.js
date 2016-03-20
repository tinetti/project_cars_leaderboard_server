'use strict';

var cache = require('./cache.js');
var service = require('./service.js');

var winston = require('winston');

winston.level = 'debug';

// Add the route
var routes = [];
var OK = {"message": "success"};

routes.push({
    method: 'DELETE',
    path: '/api/telemetry_packets',
    handler: function (request, reply) {
        winston.debug('DELETE /api/telemetry_packets');
        return cache.clearTelemetryPackets().then(function (res) {
            return reply(OK).code(200);
        });
    }
});

routes.push({
    method: 'GET',
    path: '/api/telemetry_packets',
    handler: function (request, reply) {
        winston.debug('GET /api/telemetry_packets');
        return cache.listTelemetryPackets().then(function (res) {
            return reply(res).code(200);
        });
    }
});

routes.push({
    method: 'POST',
    path: '/api/telemetry_packets',
    handler: function (request, reply) {
        winston.debug('POST /api/telemetry_packets');
        var packet = request.payload;
        return cache.pushTelemetryPacket(packet).then(function (res) {
            return reply(OK).code(201);
        });
    }
});

routes.push({
    method: 'GET',
    path: '/api/races',
    handler: function (request, reply) {
        return service.listRaces().then(function (res) {
            winston.debug('GET /api/races -> ' + JSON.stringify(res));
            return reply(res).code(200);
        });
    }
});

/*
 * UI Views
 */
routes.push({
    method: 'GET',
    path: '/',
    handler: function (request, reply) {
        winston.debug('GET /');
        return reply.redirect('/ui/races');
    }
});

routes.push({
    method: 'GET',
    path: '/ui/races',
    handler: function (request, reply) {
        winston.debug('GET /ui/races');
        return reply.view('races', {title: 'Races'});
        //    return service.listRaces().then(function (races) {
        //        // Render the view with the custom greeting
        //        var data = {
        //            title: 'Races',
        //            races: races
        //        };
        //
        //    });
    }
});

routes.push({
    method: 'GET',
    path: '/ui/lib/{param*}',
    handler: {
        directory: {
            path: 'lib'
        }
    }
});

module.exports.routes = routes;
