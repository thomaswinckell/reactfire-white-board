const webpack = require( 'webpack' );
const util = require( 'util' );
const ExtractTextPlugin = require( 'extract-text-webpack-plugin' );
const CopyWebpackPlugin = require( 'copy-webpack-plugin' );
const StringReplacePlugin = require( 'string-replace-webpack-plugin' );
const WebpackNotifier = require( 'webpack-notifier' );
const pkg = require( '../package.json' );
const path = require( 'path' );

const DEV = process.env.NODE_ENV === 'dev';
const cssBundle = path.join( 'css', '[name].css' );

const plugins = [
    new webpack.optimize.OccurenceOrderPlugin(),
    new webpack.optimize.CommonsChunkPlugin( {
        names:    ['vendors', 'polyfills'],
        filename: path.join( 'js', util.format( '[name].js' ) )
    } ),
    new StringReplacePlugin()
];

const copy = [
    //{ from: path.resolve( __dirname, '../src/images' ), to: 'images' },
    { from: path.resolve( __dirname, '../src/fonts' ),  to: 'fonts' }
];

if( DEV ) {
    plugins.push(
        new WebpackNotifier( { title: pkg.name } ),
        new CopyWebpackPlugin( copy ),
        new webpack.HotModuleReplacementPlugin()
    );
} else {
    plugins.push(
        new CopyWebpackPlugin( copy ),
        new ExtractTextPlugin( cssBundle, {
            allChunks: true
        } ),
        new webpack.optimize.UglifyJsPlugin(),
        new webpack.NoErrorsPlugin()
    );
}

module.exports = plugins;
