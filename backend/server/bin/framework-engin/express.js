var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var compression = require('compression');

var app = express();
var projEnv = require('../../config/env/project');
var cf = require('../../src/core/common-func');

var port = normalizePort(process.env.PORT || projEnv.PORT);
app.set('port', port);
app.set('env', cf.getAppEnv());

app.set('views', path.join(projEnv.WWW_VIEWS_PATH));//设置网页文件的读取路径

//app.set('view engine', 'hbs');// 设置模板引擎为handlebars
//app.set('view engine', 'html');
//app.engine('html',require('hbs').__express);

//<<<---使用express-handlebars作为模板引擎,文件后缀使用传统的html,方便对单个html文件使用live edit调试模式
var exphbs = require('express-handlebars');
app.engine('.html', exphbs({defaultLayout: 'template1', extname: '.html', layoutsDir: path.join(projEnv.WWW_VIEWS_PATH, 'layout')}));
app.set('view engine', '.html');
if(app.get('env') != 'dev'){//非开发环境,开启模板缓存
  app.enable('view cache');
}
//--->>>

// uncomment after placing your favicon in /public
app.use(favicon(path.join(projEnv.WWW_PUBLIC_PATH, 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
// for raw data
//app.use(bodyParser.text({ type: 'text/*' }));
app.use(cookieParser());
app.use(compression({filter: shouldCompress}));//为静态资源开启gzip压缩功能,该语句必须放在下面一句之上,否则不会起效
app.use(express.static(projEnv.WWW_PUBLIC_PATH));

function shouldCompress(req, res) {
  if (req.headers['x-no-compression']) {
    return false
  }
  // fallback to standard filter function
  return compression.filter(req, res)
}

var errorLog = require('../../support/logger/helper').getLogger('error');
var exceptionLog = require('../../support/logger/helper').getLogger('exception');
var gateway = require('../../src/core/gateway');
gateway.registerRoutes(app);


// catch 404 and forward to error handler
app.use(function (req, res, next) {
  errorLog.error(req.originalUrl+' not found!');
  var err = new Error("hey,man,  ~_~   you\'ve come a uncharted world! "+req.url);
  err.status = 404;
  next(err);
});

// error handlers
// development error handler
// will print stacktrace
if (app.get('env') === 'development') {
  app.use(function (err, req, res, next) {
    exceptionLog.info(err);
    res.status(err.status || 500);
    console.log('-------->', err);
    res.render('error', {err});
  });
}

// production error handler
// no stacktraces leaked to user
app.use(function (err, req, res, next) {
  exceptionLog.info(err);
  res.status(err.status || 500);
  res.render('error', {err});
});

/**
 * Normalize a port into a number, string, or false.
 */
function normalizePort(val) {
  var port = parseInt(val, 10);
  if (isNaN(port)) {
    return val;// named pipe
  }
  if (port >= 0) {
    return port;// port number
  }
  return false;
}

module.exports = app;
