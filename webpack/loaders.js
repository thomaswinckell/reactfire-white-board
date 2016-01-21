const pkg = require( '../package.json' );
const path = require( 'path' );
const ExtractTextPlugin = require( 'extract-text-webpack-plugin' );
const StringReplacePlugin = require( 'string-replace-webpack-plugin' );

const DEV = process.env.NODE_ENV === 'dev';

const buildTime = ( new Date() ).getTime();

const jsLoader = [
    'babel-loader?presets[]=es2015,presets[]=stage-0,presets[]=react,plugins[]=babel-plugin-transform-decorators-legacy'
];

const htmlLoader = [
    'file-loader?name=[path][name].[ext]',
    'template-html-loader?' + [
        'raw=true',
        'engine=lodash',
        'version=' + pkg.version,
        'buildTime=' + buildTime,
        'title=' + pkg.name,
        'debug=' + DEV
    ].join( '&' )
].join( '!' );

var sassLoader;
var cssLoader;
const sassParams = [
    'outputStyle=expanded',
    'includePaths[]=' + path.resolve( __dirname, '../node_modules/font-awesome/scss' )
];

if( DEV ) {
    sassParams.push( 'sourceMap', 'sourceMapContents=true' );
    sassLoader = [
        'style-loader',
        'css-loader',
        'postcss-loader',
        'sass-loader?' + sassParams.join( '&' )
    ].join( '!' );
    cssLoader = [
        'style-loader',
        'css-loader',
        'postcss-loader'
    ].join( '!' );
} else {
    sassLoader = ExtractTextPlugin.extract( 'style-loader', [
        'css-loader',
        'postcss-loader',
        'sass-loader?' + sassParams.join( '&' )
    ].join( '!' ) );
    cssLoader = ExtractTextPlugin.extract( 'style-loader', [
        'css-loader',
        'postcss-loader'
    ].join( '!' ) );
}


module.exports = [
    {
        test:    /\.jsx?$/,
        exclude: /node_modules/,
        loaders: jsLoader
    },
    {
        test:   /\.json$/,
        loader: 'json-loader'
    },
    {
        test:   /\.html$/,
        loader: htmlLoader
    },
    {
        test:    /\.css$/,
        exclude: /node_modules/,
        loader:  cssLoader
    },
    {
        test:    /\.scss$/,
        exclude: /node_modules/,
        loader:  sassLoader
    },
    {
        test: /\.(jpe?g|gif|png)$/,
        loader: 'url-loader'
    },
    {
        test:   /\.woff(2)?(\?.*)?$/,
        loader: 'url-loader'
    },
    {
        test:   /\.(eot|svg|ttf|otf)(\?.*)?$/,
        loader: 'url-loader'
    },{
        test: /AppConfig.js$/,
        loader: StringReplacePlugin.replace( {
            replacements: [
                {
                    pattern: /<!-- @firebase (\w*?) -->/ig,
                    replacement: function ( match, p1, offset, string ) {
                        return pkg.config.firebase[p1];
                    }
                },{
                    pattern: /<!-- @gmaps (\w*?) -->/ig,
                    replacement: function ( match, p1, offset, string ) {
                        return pkg.config.google.maps[p1];
                    }
                }
            ]
        } )
    }
];
