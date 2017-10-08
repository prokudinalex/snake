'use strict';

const path = require('path');
const http = require('http');
const express = require('express');
const WsModule = require('./wsModule');

const config = {
    port: 8080
};

const app = express();
const server = http.Server(app);
app.disable('x-powered-by');

const publicBundle = express.static(path.join(__dirname, '../../public/bundle'));
app.use('/bundle', publicBundle);

const simpleSnake = express.static(path.join(__dirname, '../../public/snake/simple'));
app.use('/simple', simpleSnake);

const wsSnake = express.static(path.join(__dirname, '../../public/snake/ws'));
app.use('/snake', wsSnake);

if (process.env.NODE_ENV !== 'production') {
    const webpack = require('webpack');
    const webpackDevMiddleware = require('webpack-dev-middleware');
    const webpackHotMiddleware = require('webpack-hot-middleware');
    const config = require('../../webpack.config.js');
    const compiler = webpack(config);

    app.use(webpackHotMiddleware(compiler));
    app.use(webpackDevMiddleware(compiler, {
        noInfo: true,
        publicPath: config.output.publicPathdist
    }));
}

server.listen(config.port);

const wsModule = new WsModule(server);
wsModule.init();

app.get('/stats', (req, res) => {
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
