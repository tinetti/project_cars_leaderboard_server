var chai = require('chai');
var chaiHttp = require('chai-http');
var server = require('../server.js');
var expect = chai.expect;

chai.use(chaiHttp);


describe('/api/packets', function () {
    var port;

    before(function () {
        server.start();
        port = server.app.get('port');
    });
    after(function () {
        server.stop();
    });

    it('posts json', function (done) {
        var json = {
            "CarName": "Formula C",
            "CarClassName": "FC",
            "TrackLocation": "Brands Hatch",
            "TrackVariation": "Indy",
            "Names": [
                "john",
                "Alberto Grosso",
                "Michel Groteclaes",
                "Bjorn Schenke",
                "Angus Macdonald",
                "Chris Siddall",
                "Jason Schumacher",
                "Marcello Mattos",
                "Parker Korpak",
                "Christian Mayr",
                "Tobias Worm",
                "Bryan Farnie",
                "Martin Hrubovsko",
                "Marcel Kannenberg",
                "Victor Vicente",
                "Robin Schmahl"
            ]
        };

        chai.request('http://localhost:' + port)
            .post('/api/packets')
            .set('Content-Type', 'application/json')
            .send(json)
            .end(function (err, res) {
                expect(res).to.have.status(201);
                done();
            });
    });
});