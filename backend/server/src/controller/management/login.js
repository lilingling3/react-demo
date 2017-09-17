/**
 * Created by zhongzhengkai on 2017/6/14.
 */
var bundleVersion = require('../../../config/spa-bundle-version');
var g = require('../../core/gateway');

exports.GET = function *(req, body, query) {
  return g.view('index', {bundleVersion},{layout:false});
};