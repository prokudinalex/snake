'use strict';

const http = require('http');
const express = require('express');
const ws = require('ws');
let geoip = require('geoip-lite');
let useragent = require('useragent');

const config = {
    port: 8080,
    wshost: 'ws://localhost:8080'
};

const app = express();
const server = http.Server(app);
const wss = new ws.Server({
    server,
    path: '/',
    clientTracking: false,
    maxPayload: 1024
});

app.disable('x-powered-by');
server.listen(config.port);

const users = {};
let userCount = 0;
let userLastId = 0;

setInterval(() => console.log(`Users online: ${userCount}`), 10 * 1000);

wss.on('connection', (socket, message) => {
    userCount++;
    const id = userLastId++;
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

    users.id = user;

    socket.once('close', () => {
        delete users[id];
        userCount--;
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
});

wss.on('error', (err) => {
    console.error(err);
});

app.get('/analytics.js', (req, res) => {
    const js = `
        var socket = new WebSocket('${config.wshost}');
        socket.onopen = function() {
            socket.send(JSON.stringify({
                type: 'init',
                url: document.location.href,
                ref: document.referrer
            }));
        };`;
    res.set('Content-Type', 'application/javascript');
    res.send(js);
});

app.get('/test/*', (req, res) => {
    const html = `
        <!doctype html>
        <html>
            <head>
                <meta charset="utf-8">
                <title>Test Page</title>
            </head>
            <body>
                <h1>test page</h1>
                <script src="/analytics.js"></script>
            </body>
            </html>`;
    res.send(html);
});
