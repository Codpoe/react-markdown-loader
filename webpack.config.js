const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');

module.exports = {
    mode: 'development',
    entry: {
        index: './docs/index.js'
    },
    output: {
        path: path.resolve(__dirname, 'docs/dist'),
        filename: '[name].bundle.js'
    },
    module: {
        rules: [
            {
                test: /\.js$/,
                use: 'babel-loader'
            },
            {
                test: /\.md$/,
                use: [
                    {
                        loader: 'babel-loader'
                    },
                    {
                        loader: './index.js'
                    }
                ]
            }
        ]
    },
    plugins: [
        new HtmlWebpackPlugin({
            template: './docs/index.tpl'
        })
    ],
    resolveLoader: {
        modules: [
            'node_modules'
        ]
    },
    devServer: {
        port: 9000
    },
    devtool: 'eval-source-map',
};
