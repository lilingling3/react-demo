/**
 * Created by zhongzhengkai on 16/4/18!!
 */


exports.handleAllHttpAccess = function (req, res, next) {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, Charset, apiKey');
  res.header('Access-Control-Allow-Methods', 'HEAD,PUT,POST,GET,DELETE,OPTIONS');
  res.header('X-Powered-By', 'express 4');
  res.locals.uid = 'xxxx123456';//挂到locals里的值,渲染视图时可以直接取到
  // res.header('Content-encoding','gzip');

  req._helpData = {startTime: Date.now()};//为所有请求设置的帮助对象,方便业务逻辑做一些额外的处理
  console.log(req.method + ": " + req.originalUrl);
  next();
};


