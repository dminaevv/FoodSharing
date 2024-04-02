'use strict';

const { merge } = require('webpack-merge');
const common = require('./webpack.config.js');
const ForkTsCheckerWebpackPlugin = require('fork-ts-checker-webpack-plugin');

module.exports = (env) => merge(common(env), {
    mode: 'development',
    watch: true,
    devtool: 'source-map',
    module: {
        rules: [
            {
                test: /\.tsx?$/,
                exclude: /node_modules/,
                use: [
                    { loader: 'ts-loader', options: { transpileOnly: true } }
                ]
            }
        ]
    },
    plugins: [new ForkTsCheckerWebpackPlugin()]
});
