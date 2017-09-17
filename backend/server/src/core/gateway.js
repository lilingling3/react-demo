/**
 * Created by zhongzhengkai on 16/4/15.
 */
// var urlConfig = require('../../config/url-route');//!!! 这里会产生循环 require ....
var util = require("util");
var logHelper = require('../../support/logger/helper');
var httpLogger = logHelper.getLogger('httpAccess');
var exLogger = logHelper.getLogger('exception');
var errorLogger = logHelper.getLogger('error');
var hot = require('./hot');
var async = require('async');
var routeController = require('../../config/route-controller');
var co = require('co');

exports.registerRoutes = function (app) {
  var urlConfig = require('../../config/url-route');
  app.all('*', hot.handleAllHttpAccess);
  var urlPathArr = Object.keys(urlConfig);
  urlPathArr.forEach(urlPath=> app.use(urlPath, urlConfig[urlPath]));//注册各个url要使用的路由文件
};

/**
 * @param view
 * @param data
 * @param {Object} [options={}] 可选参数
 * @param {String|boolean} [options.layout] 模板的布局页面,不传入的话,会读取创建express app对象时设置的值,禁用布局传入false,@see https://github.com/ericf/express-handlebars,走自己定制的模板布局
 * @param {Boolean} [options.cache] 模板文件是否启用缓存,不传入的话,会读取创建express app对象时设置的值
 * @param {Object} [options.helpers] 模板的助手
 * @param {Object} [options.cookies] 返回的页面里要设置的cookie值
 * @returns {{type: string, view: *, data: *}}
 */
exports.view = (view, data={}, options={})=> {
  return {type: 'view', view, data, options};
};

// 让前端重定向
exports.redirect = (redirectUri)=> {
  return {type: 'redirect', redirectUri};
};

// 返回前端json数据
exports.json = (data)=> {
  return {type: 'json', data};
};

// 返回前端文件
exports.file = (filePath)=> {
  return {type: 'file', filePath};
};

/**
 *
 * @param req
 * @param res
 * @param {Object} [options={err:'',data:{...}}] 可选参数
 * @param {Object|String} [options.err] 回传给前端的错误提示
 * @param {Object|String|Boolean} [options.data] 回传给前端的数据
 */
exports.doSend = function (req, res, options) {
  req._helpData.toSend = options;
  var err = options.err;
  _recordLog(req, err);
  //有任何错误传入,就不会把toSend传给前端, 只会传递err
  if (err) {
    if (err instanceof Error) {
      console.log(err.stack);
      var _status = 200;
      if (process.env.APP_ENV == 'prod') {
        _status = 500;
        // 当有错误且有错误码时把状态码派发下去
        if (err.status) _status = err.status;
        res.status(_status).send({status: false, err: err.message});
      } else {
        res.status(_status).send({status: false, err: err.stack});
      }
    } else if (Array.isArray(err)) {
      res.status(200).send({err: err[0], isErrThrow: true});
    } else {
      res.status(200).send(options);
    }
  } else {
    res.status(200).send(options);
  }
};

/**
 *
 * @param {Object} req
 * @param {Object} res
 * @param {Object} [options={}] 可选参数
 * @param {String} [options.view] 要渲染的模板文件名,不传入的话会读取url-config里所配置的文件名
 * @param {Object} [options.data] 模板的数据源
 * @param {String|boolean} [options.layout] 模板的布局页面,不传入的话,会读取创建express app对象时设置的值,禁用布局传入false,@see https://github.com/ericf/express-handlebars,走自己定制的模板布局
 * @param {Boolean} [options.cache] 模板文件是否启用缓存,不传入的话,会读取创建express app对象时设置的值
 * @param {Object} [options.helpers] 模板的助手
 * @param {String} [options.err] 错误页面的提示信息(通常情况下是一些系统级别的错误,会跳转到error页面,如404错误)
 * @param {Object|Array} [options.errHint] 这个页面的一些标签需要显示的错误提示,形如:{text:'string too long',prop:'name'},表示一个叫name的dom产生的错误
 * @returns {*}
 */
exports.doRender = function (req, res, options) {
  options = options || {};
  var err = options.err || false;
  if (!options.data) {
    options.data = {};
  }
  req._helpData.toSend = options.data;

  var hbsHelpers = require('./hbs-helpers');
  var inputHelpers = options.helpers;
  if (inputHelpers) {
    for (var name in inputHelpers) {
      hbsHelpers[name] = inputHelpers[name];//attention:如果自己定义的helper和配置的重名,自己会覆盖掉配置好的
    }
  }
  options.helpers = hbsHelpers;

  var renderData = options.data;
  if (typeof renderData != 'object') {
    //throw new Error('value of data property must be a object!');
    return res.render('error', {err: 'value of data property must be a object! now it is:' + renderData});
  }
  var errStr = _recordLog(req, err);

  //to optimize: 如果Error带了type值,这里还可以进一步划分跳转页面
  if (err) {
    res.render('error', {layout: false, err: errStr, helpers: hbsHelpers});
  } else {
    var cookies = options.cookies;
    if (cookies) {
      Object.keys(cookies).forEach(cookieName=> {
        var cookie = cookies[cookieName];
        var path = cookie.path || '/';
        var value = cookie.value;
        res.cookie(cookieName, value, {path});
      });
    }
    res.render(options.view, options);
  }
};

function _recordLog(req, err) {
  var text = util.format('method:%s,elapsedTime:%sms,url:%s', req.method, Date.now() - req._helpData.startTime, req.originalUrl);
  var errStr = '';
  if (err) {
    if (typeof err == 'object') {
      if (err instanceof Error) {
        errStr = err.message;
        exLogger.info(err);//异常日志记录的是 err.message, err.stack
      } else {
        errStr = JSON.stringify(err);
        errorLogger.info(errStr);
      }
      text += ',error:' + errStr;
    } else {
      errStr = err;
      errorLogger.info(errStr);
      text += ',error:' + errStr;
    }
  }
  if (req.method == 'POST') {
    try {
      text += ',requestData:' + JSON.stringify(req.body);
    } catch (e) {
      text += e;
    }
  }
  var toSend = req._helpData.toSend;
  if (toSend) {
    text += ',responseData:' + JSON.stringify(toSend);
  }
  text += '\n';
  httpLogger.info(text);
  return errStr;
}

exports.handle = (req, res, next) => {
  var method = req.method;
  var routePath = req.route.path;
  var fn = routeController[routePath].controller[method];
  execute(req, res, next, fn);
};

/**
 * 给路由设定用哪一个controller来处理请求
 * 确保controller里定义了和请求方法名一致的函数，如 GET POST PUT PATCH DELETE ...
 * @param controller
 * @returns {function(*=, *=, *=)}
 */
exports.useController = (controller)=>{
  return (req, res, next)=> {
    var fn = controller[req.method];
    if(!fn) return exports.doSend(req, res, {err: 'no '+ req.method + 'defined in module'});
    else execute(req, res, next, fn);
  }
};

// 给路由设定使用哪一个函数处理业务逻辑
exports.use= (fn)=>{
  return (req, res, next) => execute(req, res, next, fn)
};

function execute(req, res, next, fn) {
  if (!fn) {
    var pathname = req.baseUrl + req.route.path;
    exports.doSend(req, res, {err: 'no controller defined for [method:' + method + ',pathname:' + pathname});
  } else {
    //fn.constructor.toString() == 'function GeneratorFunction() { [native code] }'
    if (isGenerator(fn)) {
      console.log('************   co controller   ************');
      var fnGen = co.wrap(fn);
      fnGen(req, req.body, req.query)
        .then(result => {
          if(!result) return exports.doSend(req, res, {err: 'no return keyword for controller'});
          var type = result.type;
          if(type === undefined )return exports.doSend(req, res, {err: 'type not defined,please use func:view,file,redirect,data'});
          switch(type){
            case 'view':
              // res.header("Content-Type", "text/html;charset=utf-8");
              result.options.view = result.view;
              result.options.data = result.data;
              exports.doRender(req, res, result.options);
              break;
            case 'redirect':
              res.redirect(result.redirectUri);
              break;
            case 'json':
              res.header("Content-Type", "application/json;charset=utf-8");
              exports.doSend(req, res, {data: result.data});
              break;
            case 'file':
              res.attachment(result.filePath);
              res.sendFile(result.filePath);
              break;
            default:
              exports.doSend(req, res, {err: 'not support type:'+type +'for gateway'});
          }
        })
        .catch(err => {
          errorLogger.info(err);
          exports.doSend(req, res, {err: err})
        });
    } else {
      console.log('************   controller   ************');
      fn(req, res, next);
    }
  }
}

function isGenerator(fn) {
  var result = false;
  if (fn.constructor.toString() == 'function GeneratorFunction() { [native code] }')result = true;
  else if (fn.prototype && fn.prototype.__proto__.next != undefined)result = true;
  return result;
}