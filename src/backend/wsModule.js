'use strict';

const ws = require('ws');
const geoip = require('geoip-lite');
const useragent = require('useragent');

module.exports = wsModule;

function wsModule(server) {
    this.server = server;
    this.userCount = 0;
    this.userLastId = 0;
    this.users = {};
}

wsModule.prototype.init = function() {
    this.wss = new ws.Server({
        server: this.server,
        path: '/',
        clientTracking: false,
        maxPayload: 1024
    });

    this.wss.on('error', (err) => this.onError(err));
    this.wss.on('connection', (socket, message) => this.onConnection(socket, message));
    setInterval(() => console.log(`Users online: ${this.userCount}`), 10 * 1000);
};

wsModule.prototype.onError = function(err) {
    console.error(err);
};

wsModule.prototype.onConnection = function(socket, message) {
    this.userCount++;
    const id = this.userLastId++;
    const ip = message.headers['x-real-ip'] || message.connection.remoteAddress;
    const user = {
        id,
        host: message.headers.host,
        ip,
        ipgeo: geoip.lookup(ip),
        ua: useragent.lookup(message.headers['user-agent']).toJSON(),
        date: Date.now(),
        updated: Date.now()
    };

    this.users.id = user;

    socket.once('close', () => {
        delete this.users[id];
        this.userCount--;
    });

    socket.on('message', (msg) => {
        try {
            msg = JSON.parse(msg);
        } catch (err) {
            console.error('Cannot parse msg: ', msg);
            return;
        }

        switch (msg.type) {
            case 'init':
                user.url = msg.url;
                user.ref = msg.ref;
                break;
            default:
                console.log('unsexpected msg type: ', msg.type);
                break;
        }

        console.dir(user);
    });
};
