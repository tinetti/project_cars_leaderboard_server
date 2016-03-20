'use strict';

var Hapi = require('hapi');

var routes = require('./routes.js').routes;

// Create a server with a host and port
var server = new Hapi.Server();
var port = process.env.PORT || 3000;
server.connection({
    host: 'localhost',
    port: port
});

function start() {
    server.start(function (err) {
        if (err) {
            throw err;
        }
        console.log('Server running at:', server.info.uri);
    });
}

server.register([{
    register: require('inert')
}, {
    register: require('vision')
}], function (err) {

    if (err) return console.error(err);

    server.views({
        engines: {
            html: require('handlebars')
        },
        path: 'views',
        layoutPath: 'views/layout',
        layout: 'default',
        partialsPath: 'views/partials'
        //helpersPath: 'views/helpers',
    });

    // Add routes from routes.js
    for (var i = 0; i < routes.length; i++) {
        server.route(routes[i]);
    }
});


if (require.main === module) {
    start();
}
else {
    exports.start = start;
    exports.port = port;
}
