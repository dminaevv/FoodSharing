'use strict';

const { merge } = require('webpack-merge');
const common = require('./webpack.config.js');

module.exports = (env) => merge(common(env), {
    mode: 'development',
    watch: true,
    devtool: 'source-map',
    module: {
        rules: [
            {
                test: /\.tsx?$/,
                exclude: /node_modules/,
                use: ['ts-loader']
            }
        ]
    }
});
