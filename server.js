'use strict';

var Hapi = require('hapi');

var cache = require('./cache.js');
//var dataStore = require('./data_store.js');
var routes = require('./routes.js').routes;

// Create a server with a host and port
var server = new Hapi.Server();
var port = process.env.PORT || 3000;
server.connection({
    host: 'localhost',
    port: port
});

for (var i = 0; i < routes.length; i++) {
    server.route(routes[i]);
}

function start() {
    server.start(function (err) {
        if (err) {
            throw err;
        }
        console.log('Server running at:', server.info.uri);
    });
}

if (require.main === module) {
    start();
}
else {
    exports.start = start;
    exports.port = port;
}

