'use strict';

const http = require('http');
const express = require('express');
const WsModule = require('./wsModule');

const config = {
    port: 8080,
    wshost: 'ws://localhost:8080'
};

const app = express();
const server = http.Server(app);
app.disable('x-powered-by');
server.listen(config.port);

const wsModule = new WsModule(server);
wsModule.init();

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

app.get('/', (req, res) => {
    const html = `
      <!doctype html>
      <html>
      <head>
        <meta charset="utf-8">
        <title>Stats</title>
      </head>
      <body>
        <div id="root"></div>
        <script src="bundle/main.js"></script>
      </body>
      </html>
    `;
    res.send(html);
});
