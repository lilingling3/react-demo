/**
 * Created by zhongzhengkai on 16/4/11.
 */
var HtmlWebpackPlugin = require('html-webpack-plugin');
var webpack = require('webpack');
var path = require('path');

var DEV_HOST = process.env.DEV_HOST ? process.env.DEV_HOST : '0.0.0.0';
var devIP = DEV_HOST;
var devPort = 3999;
if (DEV_HOST.indexOf(':') != -1) {
  var arr = DEV_HOST.split(':');
  devIP = arr[0];
  devPort = arr[1];
}

var APP_ENV = 'dev';
var __API_KEY__ = '';
if (process.env.APP_ENV)APP_ENV = process.env.APP_ENV;
if(process.env.API_KEY)__API_KEY__ = process.env.API_KEY;

var API_HOST  = process.env.API_HOST ? process.env.API_HOST : 'https://dccmtest.boldseas.com';
console.log('the API_HOST: ' + API_HOST);

var DT = process.env.DT ? 'true' : 'false';
var DEVICE= process.env.DEVICE ? process.env.DEVICE : '';


var webpackConfig = {
  devtool: 'eval',
  entry: [
    'webpack-dev-server/client?http://' + devIP + ':'+ devPort,
    'webpack/hot/only-dev-server',
    path.join(__dirname, '../src-management/main.js')
  ],
  output: {
    path: path.join(__dirname, 'dist'),
    //publicPath: '/static/',
    filename: APP_ENV+'.js'
  },
  module: {
    loaders: [
      {test: /\.js$/, loaders: ['react-hot', 'babel'], include: path.join(__dirname, '../src-management')},
      {test: /\.(woff|svg|eot|ttf)\??.*$/, loader: 'url-loader?limit=1&name=[path][name].[ext]'},
      {test: /\.css$/, loaders: ['style', 'raw'], include: path.join(__dirname, '../src-management')}
    ]
  },
  plugins: [
    new HtmlWebpackPlugin({
      template: require('path').join(__dirname,'../template-html/spa-index.html')
    }),//这个插件不能少,生成一份虚拟的html文件放到webpack-dev-server中,否则会报错404
    new webpack.HotModuleReplacementPlugin(),
    new webpack.NoErrorsPlugin(),
    new webpack.DefinePlugin({
      'process.env.NODE_ENV': JSON.stringify('development'),
      '__APP_ENV__': JSON.stringify(APP_ENV),
      '__API_HOST__': JSON.stringify(API_HOST),
      '__API_KEY__':JSON.stringify(__API_KEY__),
      '__QUERY_TOKEN__': JSON.stringify(''),
      '__HAS_DEVTOOL__': JSON.stringify(DT),
      '__DEVICE__': JSON.stringify(DEVICE),
      '__BUILD_TIME__': JSON.stringify(new Date().toLocaleString()),
    })
  ]
};


module.exports = webpackConfig;
