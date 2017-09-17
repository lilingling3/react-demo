/**
 * Created by yujie on 17/5/4.
 */
var g = require('../../core/gateway');
var cf = require('../../core/common-func');


exports.GET = function *(req, body, query){
  return g.view('login',{},{layout:false});
};

exports.POST = function *(req, body, query){
  g.view('login');
};




