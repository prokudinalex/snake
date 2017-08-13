'use strict';

var percolator = require('percolator').Percolator;

var Server = function(port) {
    var server = new percolator({
        'port': port,
        'autoLink': false
    });

    server.route('/api/about', {
        GET: function(req, res) {
            res.object({
                'status': 'ok'
            }).send();
        }
    });
    return server;
};

module.exports.Server = Server;
