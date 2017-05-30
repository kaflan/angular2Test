const path = require('path');
const fs = require('fs');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const webpack = require('webpack');
const BrowserSyncPlugin = require('browser-sync-webpack-plugin');
var ExtractTextPlugin = require('extract-text-webpack-plugin');
var helpers = require('./helpers')

module.exports = {
    entry: {
        'polyfills': './App/src/polyfills.ts',
    'vendor': './App/src/vendor.ts',
    'app': './App/src/index.ts'
    },
    output: {
        filename: 'scripts/[name].js',
        path: path.resolve(__dirname, 'client'),
        chunkFilename: 'scripts/[name].js'
    },
    target: "node",
    stats: {
        // minimal logging
        assets: false,
        colors: true,
        // version: false,
        hash: false,
        // timings: false,
        chunks: false,
        chunkModules: false,
        children: false
    },
    //  devServer: {
    //     hot: true,
    //     // enable HMR on the server

    //     contentBase: path.resolve(__dirname, 'App'),
    //     // match the output path

    //     publicPath: '/'
    //     // match the output `publicPath`
    // },
    module: {
        rules: [
            {
                test: /\.ts?$/,
                exclude: /node_modules/,
                loader: 'ts-loader'
            },
            {
                test: /\.html$/,
                use: [{
                    loader: 'html-loader'
                }]
            },
            {
                test: /\.css$/,
                "exclude": [
                    "node_modules",
                    "build",
                    "vendor"
                ],
                use: ['style-loader', 'css-loader'],
            },
        ]
    },
    plugins: [
         new webpack.ContextReplacementPlugin(
            /angular(\\|\/)core(\\|\/)@angular/,
            path.resolve(__dirname, '/App')
        ),
        new HtmlWebpackPlugin({
            template: './App/index.html',
            cache: false,
            inject: 'body'
        }),
        new webpack.HotModuleReplacementPlugin(),
        new webpack.NamedModulesPlugin(),
        new webpack.NoEmitOnErrorsPlugin(),
        new webpack.DefinePlugin({
            'process.env.NODE_ENV': JSON.stringify('development')
        }),
        
        new BrowserSyncPlugin({
        // proxy the Webpack Dev Server endpoint 
        // (which should be serving on http://localhost:3100/) 
        // through BrowserSync 
        proxy: 'http://localhost:3000/'
        }, {
        // prevent BrowserSync from reloading the page 
        // and let Webpack Dev Server take care of this 
        reload: true
      })
       
    ],
    resolve: {
        extensions: ['.ts', '.tsx', '.js', '.jsx']
    }
};