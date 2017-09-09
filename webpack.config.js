'use strict';

const path = require('path');
const webpack = require('webpack');

const isProd = process.env.NODE_ENV === 'production';

module.exports = {
    entry: [
        './dashboard.jsx',
        !isProd && 'webpack-hot-middleware/client'
    ].filter((x) => x),
    output: {
        path: path.join(__dirname, '/public/bundle/'),
        filename: 'main.js'
    },
    devtool: !isProd && 'source-map',
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
    },
    plugins: [
        isProd ? new webpack.DefinePlugin({ 'process.env': { 'NODE_ENV': "'production'" } }) : function() {},
        isProd ? new webpack.optimize.UglifyJsPlugin({ compress: { warnings: false } }) : function() {},
        new webpack.HotModuleReplacementPlugin(),
        new webpack.NoEmitOnErrorsPlugin()
    ]
};
