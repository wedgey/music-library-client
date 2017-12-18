const path = require('path');
const fs = require('fs');
const HtmlWebPackPlugin = require('html-webpack-plugin');
const ExtractTextPlugin = require('extract-text-webpack-plugin');
const webpack = require('webpack');
const lessToJs = require('less-vars-to-js');
const themeVariables = lessToJs(fs.readFileSync(path.join(__dirname, './src/css/antTheme.less'), 'utf8'));

const isProd = process.env.NODE_ENV === "production";
const getCssLoader = (loader) => {
    if (!isProd) return ['style-loader', 'css-loader', loader];
    else return ExtractTextPlugin.extract({
        fallback: 'style-loader',
        use: ['css-loader', loader],
        publicPath: '/dist/css'
    });
}

module.exports = {
    entry: {
        app: ["babel-polyfill", "./src/app.js"],
        css: "./src/css/app.scss"
    },
    output: {
        path: path.resolve(__dirname, "dist"),
        filename: "[name].bundle.js",
        publicPath: "/"
    },
    module: {
        rules: [
            {
                test: /\.scss$/,
                use: getCssLoader('sass-loader')
            },
            {
                test: /\.less$/,
                use: getCssLoader({loader: "less-loader", options: { modifyVars: themeVariables }})
            },
            {
                test: /\.js$/,
                exclude: /node_modules/,
                use: 'babel-loader'
            },
            {
                test: /\.(jpe?g|png|svg|gif)$/,
                include: [ path.resolve(__dirname, "./src/images")],
                use: [
                    'file-loader?name=[name].[ext]&outputPath=images/',
                    'image-webpack-loader?bypassOnDebug'
                ]
            },
            { test: /\.(woff2?|svg)$/, include: [ path.resolve(__dirname, "./src/fonts")], use: 'url-loader?limit=10000&name=./fonts/[name].[ext]' },
            { test: /\.(ttf|eot)$/, use: 'file-loader?name=./fonts/[name].[ext]' },
        ]
    },
    devServer: {
        contentBase: path.join(__dirname, "dist"),
        compress: true,
        stats: "errors-only",
        open: true,
        host: "0.0.0.0",
        port: 3000,
        hot: true,
        watchOptions: {
            ignored: /node_modules/,
            poll: true
        },
        historyApiFallback: true
    },
    plugins: [
        new HtmlWebPackPlugin({
            title: "KPop Library",
            hash: true,
            template: './src/index.html'
        }),
        new ExtractTextPlugin({
            filename: './css/[name].css',
            disable: !isProd,
            allChunks: true
        }),
        new webpack.HotModuleReplacementPlugin(),
        new webpack.NamedModulesPlugin()
    ]
}