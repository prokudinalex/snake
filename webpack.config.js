/* eslint no-unused-vars: 0 */
'use strict';

const path = require('path');
const webpack = require('webpack');

module.exports = {
    entry: [
        './dashboard.jsx'
    ],
    output: {
        path: path.join(__dirname, '/public/bundle/'),
        filename: 'main.js'
    },
    module: {
        loaders: [
            {
                test: /.jsx?$/,
                loader: 'babel-loader',
                exclude: /node_modules/,
                query: { presets: [ 'es2015', 'react' ] }
            },
            { test: /\.css$/, loader: 'style-loader!css-loader' },
            { test: /\.png$/, loader: 'url' },
            { test: /\.(woff|woff2)(\?v=\d+\.\d+\.\d+)?$/, loader: 'file-loader' },
            { test: /\.ttf(\?v=\d+\.\d+\.\d+)?$/, loader: 'file-loader' },
            { test: /\.eot(\?v=\d+\.\d+\.\d+)?$/, loader: 'file-loader' },
            { test: /\.svg(\?v=\d+\.\d+\.\d+)?$/, loader: 'file-loader' }
        ]
    }
};
