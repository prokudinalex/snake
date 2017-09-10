'use strict';

const Server = require('./server.js').Server;
const server = Server('8080');
server.listen(() => {
    console.log('Server listening on port', server.options.port);
});
