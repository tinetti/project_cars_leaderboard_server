var chai = require('chai');
var chaiHttp = require('chai-http');
var expect = chai.expect;

var server = require('../server.js');

chai.use(chaiHttp);


describe('/api/telemetry_packets', function () {

    var url = 'http://localhost:' + server.port;
    var path = '/api/telemetry_packets';

    var json = {
        "CarName": "Formula C",
        "CarClassName": "FC",
        "TrackLocation": "Brands Hatch",
        "TrackVariation": "Indy"
    };

    before(function () {
        server.start();
    });

    it('clears telemetry packets', function (done) {
        chai.request(url)
            .delete(path)
            .end(function (err, res) {
                expect(res).to.have.status(200);
                expect(res.body).to.deep.equal({"message": "success"});
                done();
            });
    });

    it('posts telemetry packet', function (done) {

        var url = 'http://localhost:' + server.port;
        chai.request(url)
            .post(path)
            .send(json)
            .end(function (err, res) {
                expect(res).to.have.status(201);
                done();
            });
    });

    it('gets telemetry packets', function (done) {
        chai.request(url)
            .get(path)
            .end(function (err, res) {
                expect(res).to.have.status(200);
                expect(res).to.be.json;
                expect(res.body).to.deep.equal([json]);
                done();
            });
    });
});
