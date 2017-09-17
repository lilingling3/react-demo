/**
 * 运行 CP_NAME={dir}/{name} npm run build:cp 单独为某个组件打包,
 * 确保该组件下有一个main文件
 * @type {webpack|exports|module.exports}
 */

var webpack = require('webpack');
var path = require('path');
var spaVersion = require('../../backend/server/config/spa-bundle-version');

console.log('------------------------------------------');
console.log('execute build command for file: spa-prod.js');
console.log('------------------------------------------');

var __API_HOST__ = 'https://dccmapi.boldseas.com';
//var __API_HOST__ = 'https://dccmtest.boldseas.com';

var __PUBLIC_PATH__ = '';
var __API_KEY__ = '';
if(process.env.API_HOST)__API_HOST__ = process.env.API_HOST;
if(process.env.API_KEY)__API_KEY__ = process.env.API_KEY;
console.log('__API_HOST__:' + __API_HOST__);

if(process.env.PUBLIC_PATH){
  __PUBLIC_PATH__ = process.env.PUBLIC_PATH;
}else{
  //不指定PUBLIC_PATH的话,默认就是指向assets目录
  __PUBLIC_PATH__ = path.join(__dirname,'../assets');
}
console.log('__PUBLIC_PATH__:'+__PUBLIC_PATH__);

//var output_path = path.join(__dirname, '../../backend/www/public/web-app');
var output_path = path.join(__dirname, '../../backend/www/public/spa-bundle');
console.log('output_path:' + output_path);

var webpackConfig = {
  devtool: false,
  entry:[
    path.join(__dirname,'../src-management/main.js')
  ],
  output: {
    path: output_path,
    publicPath: __PUBLIC_PATH__,
    filename: 'management-spa-'+spaVersion+'.js'
  },
  module: {
    loaders: [
      //处理js文件的loader配置
      {test: /\.js$/,loaders: ['react-hot', 'babel'],
        include: [
          path.join(__dirname, '../src')
        ]
      },
      {
        test: /\.(woff|svg|eot|ttf)\??.*$/,
        loader: 'url-loader?limit=1&name=../assets/fonts/[name].[ext]',
        include: path.join(__dirname, '../assets/fonts')
      },
      //处理css文件的loader配置
      {test: /\.css$/,loaders: ['style', 'raw'],include: path.join(__dirname, '../src-management')}
    ]
  },
  plugins: [
    new webpack.DefinePlugin({
      'process.env.NODE_ENV': JSON.stringify('production'),
      '__APP_ENV__':JSON.stringify('prod'),
      '__API_HOST__':JSON.stringify(__API_HOST__),
      '__API_KEY__':JSON.stringify(__API_KEY__),
      '__QUERY_TOKEN__': JSON.stringify('?token[value]=Xkdfg$%?fdferddfnzdff3434314XDFGddeet44313qwtgmbjzmmbeeR'),
      '__HAS_DEVTOOL__': JSON.stringify('false'),
      '__BUILD_TIME__': JSON.stringify(new Date().toLocaleString())
    }),
    new webpack.optimize.UglifyJsPlugin({
      compress: {
        warnings: false
      }
    })
  ]
};

webpackConfig.externals = {

};

module.exports = webpackConfig;
