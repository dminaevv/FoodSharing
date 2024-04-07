'use strict';

const path = require('path');
const webpack = require('webpack');


module.exports = env => {
    let envKeys = {};

    if (env) {
        envKeys = Object.keys(env).reduce((prev, next) => {
            prev[`process.env.${next}`] = JSON.stringify(env[next]);
            return prev;
        }, {});
    }

    return {
        entry: './src/app/app.tsx',
        output: {
            path: path.join(__dirname, '/../../wwwroot/dist'),
            filename: '[name].js',
            pathinfo: false,
            publicPath: '/dist/'
        },
        resolve: {
            extensions: ['.ts', '.tsx', '.js', '.json', 'css', '.scss']
        },
        module: {
            rules: [
                {
                    test: /\.module\.scss$/,
                    use: [
                        'style-loader',
                        {
                            loader: 'css-loader',
                            options: {
                                modules: { localIdentName: '[name]__[local]--[hash:base64:5]' }
                            }
                        },
                        'sass-loader'
                    ]
                },
                {
                    test: /\.scss$/,
                    exclude: /\.module\.scss$/,
                    use: ['style-loader', 'css-loader', 'sass-loader']
                },
                {
                    test: /\.css$/,
                    use: ['style-loader', 'css-loader']
                },
                {
                    test: /\.(png|jpe?g)$/,
                    use: [
                        {
                            loader: 'file-loader',
                            options: {
                                outputPath: 'images',
                            },
                        },
                    ],
                }, 
                {
                    enforce: 'pre',
                    test: /\.js$/,
                    use: ['source-map-loader']
                }
            ]
        },
        plugins: [new webpack.DefinePlugin(envKeys)]
    };
};
