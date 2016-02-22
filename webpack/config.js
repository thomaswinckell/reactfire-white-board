const _ = require( 'lodash' );
const path = require( 'path' );
const util = require( 'util' );
const autoprefixer = require( 'autoprefixer' );
const pkg = require( '../package.json' );
const loaders = require( './loaders' );
const plugins = require( './plugins' );

const DEV = process.env.NODE_ENV === 'dev';
const MODE = process.env.MODE || '';

const jsBundle = path.join( 'js', util.format( '[name].js' ) );
const entries = {
    app:       ['app.js'],
    vendors:   ['react', 'jquery', 'lodash', 'moment', 'firebase', 'classnames'],
    polyfills: ['babel-polyfill']
};
const alias = {
};

if( DEV ) {
    entries.app.unshift(
        util.format( 'webpack-dev-server/client?http://%s:%d', pkg.config.devHost, pkg.config.devPort ),
        'webpack/hot/dev-server'
    );
}

const context = path.join( __dirname, '../src' );

module.exports = {
    context:   context,
    entry:     entries,
    target:    'web',
    output:    {
        path:       path.resolve( pkg.config.buildDir ),
        publicPath: '/',
        filename:   jsBundle,
        pathinfo:   false
    },
    resolve:   {
        alias :     alias,
        root:       context,
        extensions: ['', '.js', '.json', '.jsx']
    },
    module:    {
        loaders: loaders,
        noParse: []
    },
    plugins:   plugins,
    devtool:   DEV ? 'inline-source-map' : false,
    cache:     DEV,
    debug:     DEV,
    devServer: {
        contentBase: path.resolve( pkg.config.buildDir ),
        reload:      util.format( 'http://%s:%d', pkg.config.devHost, pkg.config.devPort ),
        hot:         true,
        noInfo:      true,
        inline:      true,
        stats:       { colors: true }
    },
    postcss: function () {
        return [ autoprefixer ];
    }
};
