/**
 * Created by zhongzhengkai on 2017/6/14.
 */
var g = require('../../core/gateway');
var cf = require('../../core/common-func');

exports.getBooks = function *(req, body, query) {
  //var result = yield cf.get('http://wwww.baidu.com');
  return g.json([{name: 1, age: 2}]);
};

exports.testPost = function *(req, body, query) {
  console.log('body::::',body);
  return g.json([{name: 1111, age: 22222}]);
};

exports.getInfo = function* (req,body,query) {
  return g.json({name:'张三',sex:'男',age:20});
}