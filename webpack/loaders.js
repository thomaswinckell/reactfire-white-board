const pkg = require( '../package.json' );
const path = require( 'path' );
const ExtractTextPlugin = require( 'extract-text-webpack-plugin' );

const DEV = process.env.NODE_ENV === 'dev';

const jsLoader = [
    'babel-loader?presets[]=es2015,presets[]=stage-0,presets[]=react,plugins[]=babel-plugin-transform-decorators-legacy'
];

const htmlLoader = [
    'file-loader?name=[path][name].[ext]',
    'template-html-loader?' + [
        'raw=true',
        'engine=lodash',
        'version=' + pkg.version,
        'title=' + pkg.title || pkg.name,
        'name=' + pkg.name,
        'description=' + pkg.description,
        'dev=' + DEV
    ].join( '&' )
].join( '!' );

var sassLoader, cssLoader, depSassLoader, depCssLoader;
const sassParams = [
    'outputStyle=expanded'
];

if( DEV ) {
    sassParams.push( 'sourceMap', 'sourceMapContents=true' );
    sassLoader = [
        'style-loader',
        'css-loader?modules=truel&localIdentName=[path][name]---[local]---[hash:base64:5]',
        'postcss-loader',
        'sass-loader?' + sassParams.join( '&' )
    ].join( '!' );
    cssLoader = [
        'style-loader',
        'css-loader?modules=true&localIdentName=[path][name]---[local]---[hash:base64:5]',
        'postcss-loader'
    ].join( '!' );
    depSassLoader = [
        'style-loader',
        'css-loader',
        'postcss-loader',
        'sass-loader?' + sassParams.join( '&' )
    ].join( '!' );
    depCssLoader = [
        'style-loader',
        'css-loader',
        'postcss-loader'
    ].join( '!' );
} else {
    sassLoader = ExtractTextPlugin.extract( 'style-loader', [
        'css-loader?modules=true&localIdentName=[hash:base64]',
        'postcss-loader',
        'sass-loader?' + sassParams.join( '&' )
    ].join( '!' ) );
    cssLoader = ExtractTextPlugin.extract( 'style-loader', [
        'css-loader?modules=true&localIdentName=[hash:base64]',
        'postcss-loader'
    ].join( '!' ) );
    depSassLoader = ExtractTextPlugin.extract( 'style-loader', [
        'css-loader',
        'postcss-loader',
        'sass-loader?' + sassParams.join( '&' )
    ].join( '!' ) );
    depCssLoader = ExtractTextPlugin.extract( 'style-loader', [
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
        test:    /node_modules.*\.css$/,
        loader:  depCssLoader
    },
    {
        test:    /\.scss$/,
        exclude: /node_modules/,
        loader:  sassLoader
    },
    {
        test:    /node_modules.*\.scss$/,
        loader:  depSassLoader
    },
    {
        test: /\.(jpe?g|gif|png)$/,
        loader: 'file-loader?name=images/[name].[ext]?[hash]'
    },
    {
        test:   /\.woff(2)?(\?.*)?$/,
        loader: 'file-loader?name=fonts/[name].[ext]'
    },
    {
        test:   /\.(eot|svg|ttf|otf)(\?.*)?$/,
        loader: 'file-loader?name=fonts/[name].[ext]'
    }
];
