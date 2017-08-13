'use strict';

var request = require('request');
var Server = require('../../src/backend/server.js').Server;
var testPort = 8083;

describe('The API', function() {
    var server;

    beforeEach(function(done) {
        server = Server(testPort);
        server.listen(function(err) {
            console.log('Test server started on port: ', server.options.port);
            done();
        });
    });

    afterEach(function(done) {
        console.log('Closing test server...')
        server.close(function() {
            console.log('Server closed');
            done();
        })
    });

    it('should respond to GET at /api/about/', function(done) {
        var expected = {
            'status': 'ok'
        };

        request.get(
            {
                'url': 'http://localhost:' + testPort + '/api/about/',
                'json': true
            },
            function(err, res, body) {
                expect(res.statusCode).toBe(200);
                expect(body).toEqual(expected);
                done();
            });
    });
});
