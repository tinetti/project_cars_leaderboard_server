/**
 * This file provided by Facebook is for non-commercial testing and evaluation
 * purposes only. Facebook reserves all rights not expressly granted.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL
 * FACEBOOK BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN
 * ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION
 * WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
 */

var fs = require('fs');
var path = require('path');
var express = require('express');
var bodyParser = require('body-parser');
var app = express();


app.set('port', (process.env.PORT || 3000));

app.use('/', express.static(path.join(__dirname, 'public')));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));


var cassandra = require('cassandra-driver');
//var cassandra = require('../../');
var async = require('async');
var assert = require('assert');

var client = new cassandra.Client({contactPoints: ['10.0.0.48']});

async.series([
    function connect(next) {
        client.connect(next);
    },
    function createKeyspace(next) {
        var query = "CREATE KEYSPACE IF NOT EXISTS examples WITH replication = {'class': 'SimpleStrategy', 'replication_factor': '3' }";
        client.execute(query, next);
    },
    function createTable(next) {
        var query = "CREATE TABLE IF NOT EXISTS examples.basic (id uuid, txt text, val int, PRIMARY KEY(id))";
        client.execute(query, next);
    }
], function (err) {
    if (err) {
        console.error('There was an error', err.message, err.stack);
    }
});


// Additional middleware which will set headers that we need on each request.
app.use(function (req, res, next) {
    // Set permissive CORS header - this allows this server to be used only as
    // an API server in conjunction with something like webpack-dev-server.
    res.setHeader('Access-Control-Allow-Origin', '*');

    // Disable caching so we'll always get the latest comments.
    res.setHeader('Cache-Control', 'no-cache');
    next();
});

app.get('/api/packets', function (req, res) {
    var params = req.query;
    console.log("query params: " + JSON.stringify(params));
    var query = 'SELECT id, txt, val FROM examples.basic';
    client.execute(query, [], {prepare: true}, function (err, result) {
        if (err) {
            console.error(err);
            res.json(err);
        }
        var row = result.first();
        console.log('Obtained row: ', row);
        res.json(result);
    });
});

app.post('/api/packets', function (req, res) {
    var id = cassandra.types.Uuid.random();
    var query = 'INSERT INTO examples.basic (id, txt, val) VALUES (?, ?, ?)';
    client.execute(query, [id, 'Hello!', 100], {prepare: true}, function (err, result) {
        if (err) {
            console.error(err);
            res.json(err);
        } else {
            res.json(result);
        }
    });
});


var server = app.listen(app.get('port'), function () {
    console.log('Server started: http://localhost:' + app.get('port') + '/');
});


function gracefulShutdown() {
    console.log("Shutting down");
    server.close();
    client.shutdown();
    process.exit();

    // if after
    setTimeout(function () {
        console.error("Could not close connections in time, forcefully shutting down");
        process.exit()
    }, 10 * 1000);
}

// listen for TERM signal .e.g. kill
process.on('SIGTERM', gracefulShutdown);

// listen for INT signal e.g. Ctrl-C
process.on('SIGINT', gracefulShutdown);
