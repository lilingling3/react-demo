/**
 * Created by zhongzhengkai on 2016/12/26.
 */


import {doRequest} from './tool/net';
import * as dlg from './tool/dlg';
import {SHOW_LOADING, HIDE_LOADING} from '../constants/action-name';
import {LS_LOGIN} from '../constants';
import React, {Component} from 'react';
import {store} from '../store/index';
import Toast from 'antd-mobile/lib/toast';
import {message} from 'antd';

var appWidth = screen.width;
var appHeight = screen.height;//整个webview的高度
var appViewWidth = appWidth <= 768 ? appWidth : 768;//整个app显示区域的宽度
var appViewHeight = appHeight;//整个app显示区域的高度

export const getSysPlatform = ()=> {
  if (navigator.userAgent.indexOf('Android') != -1)return 'Android';
  else return 'IOS';
};
if (getSysPlatform() == 'Android') appViewHeight -= 24;

const styleMap = {
  '412': {
    rowHeight: 21,
  },
  'default': {
    rowHeight: 19,
  }
};

const wantedConf = styleMap[appWidth];
const defaultConf = styleMap.default;

export const getStore = () => store;

export const getStyleVale = (styleKey) => {
  if (wantedConf) return wantedConf[styleKey];
  else return defaultConf[styleKey];
};

const sidebarStyle = {position: 'fixed', width: '100%', bottom: 0, zIndex: 3, overflowY: 'auto', background: '#fff'};
if (getSysPlatform() == 'IOS')sidebarStyle.top = 10;
export const getSidebarStyle = (zIndex = 3, top) => {
  var newStyle = {sidebar: {...sidebarStyle, zIndex}};
  if (top !== null)newStyle.top = top;
  return newStyle;
};

export const getCSSPixelWidth = () => {
  return appWidth;
};

export const getCSSPixelHeight = () => {
  return appHeight;
};

export const getAppViewWidth = () => {
  return appViewWidth;
};

export const getAppViewHeight = () => {
  return appViewHeight;
};

export const getCommonState = () => {
  return store.getState().common;
};

export const setQuery = (path, query) => {
  var common = store.getState().common;
  common.query[path] = query;
};

export const recordPath = (path) => {
  var common = store.getState().common;
  common.prevPath = common.currentPath;
  common.currentPath = path;
};

export const getCurrentQuery = () => {
  var common = store.getState().common;
  var result = common.query[common.currentPath];
  common.query[common.currentPath] = null;//!!! 调用一次就清理掉
  return result;
};

const pageLeaveEventManager = {};
export const definePageLeaveHandler = (pagePath, handlerFn)=> {
  pageLeaveEventManager[pagePath] = handlerFn;
};

export const getPageLeaveHandler = (pagePath)=> {
  return pageLeaveEventManager[pagePath];
};

export const getCurrentPath = ()=> {
  var common = store.getState().common;
  return common.currentPath;
};

//mode属性用来决定是否允许跨域请求，以及哪些response属性可读。可选的mode属性值为same-origin，no-cors（默认）以及cors。
var mode = 'cors';
var urlPrefix = __API_HOST__;
var headers = {'Content-Type': 'application/json', apiKey: 'apiKey-DCCM-Web'};

const defaultSpec = {attachPrefix: true, hasReply: true, throwError: false};
//请求特征设定 reqSpec: {noPrefix:true, hasReply:true}
export const doGet = (path, cb, dispatch, inputReqSpec) => {
  var token = store.getState().common.login.token;
  if (token) headers.token = token;
  var reqSpec = {...defaultSpec, ...inputReqSpec};
  request(path, {method: 'GET', mode, headers}, cb, dispatch, reqSpec);
};

export const doPost = (path, toPost, cb, dispatch, inputReqSpec) => {
  var token = store.getState().common.login.token;
  if (token) headers.token = token;
  var reqSpec = {...defaultSpec, ...inputReqSpec};
  request(path, {method: 'POST', body: toPost, mode, headers}, cb, dispatch, reqSpec);
};

export const justPost = (path, toPost, cb, dispatch, reqSpec = {}) => {
  var headers = {};
  if (reqSpec.headers) headers = reqSpec.headers;
  request(path, {method: 'POST', body: toPost, mode, headers}, cb, dispatch, {...reqSpec, attachPrefix: false});
};


export const justGet = (path, cb, dispatch, reqSpec = {}) => {
  var headers = {};
  if (reqSpec.headers) headers = reqSpec.headers;
  request(path, {method: 'GET', mode: 'cors', headers}, cb, dispatch, {...reqSpec, attachPrefix: false});
};

const requestReplyStatus = {};
const TIME_OUT = 38000;

export const request = function request(path, options, cb, dispatch, reqSpec = {
  attachPrefix: true,
  hasReply: true, //false 可能没结果
  json: true,
  throwError: false
}) {
  if (dispatch) dispatch({type: SHOW_LOADING});
  var fullPath;
  if (reqSpec.attachPrefix) fullPath = urlPrefix + path;
  else fullPath = path;
  console.log(' request url:' + fullPath);

  console.log('------>request data:', fullPath, options);
  var requestReply;
  var timerId = setTimeout(() => {
    if (!requestReply) dlg.toast('http request timeout!');
    if (dispatch) dispatch({type: HIDE_LOADING});
    requestReplyStatus[timerId] = 'REQUEST_TIMEOUT';
    console.debug('------>REQUEST_TIMEOUT:', timerId, requestReplyStatus)
  }, TIME_OUT);
  requestReplyStatus[timerId] = 'REQUEST_START';

  callRequest(fullPath, options, reqSpec, (err, reply) => {
    requestReply = reply;
    clearTimeout(timerId);

    if (requestReplyStatus[timerId] != 'REQUEST_TIMEOUT') {
      requestReplyStatus[timerId] = 'REQUEST_END';
      if (dispatch) dispatch({type: HIDE_LOADING});
      console.debug('<------ request reply:' + path, reply, err);
      if (err) {
        if (err.message == 'Failed to fetch'){
          if(reqSpec.throwError) cb('error');
          message.error('无法连接网络');
        } else {
          if (reqSpec.throwError) cb('error');
          else message.error("aad");
        }
      } else {
        if (requestReply.error) {
          try {
            var errorInfo = JSON.parse(requestReply.message);
            var errText = requestReply.message ? requestReply.message : requestReply.error;
            if ((reqSpec.throwError)) {
              cb(requestReply, errText);
            } else {
              if (errorInfo.message) {
                message.error(errorInfo.message);
              } else {
                message.error(errText);
              }
            }
          } catch (e) {
            var errText = requestReply.message ? requestReply.message : requestReply.error;
            message.error(errText);
          }
        } else {
          if (requestReply.data) cb(requestReply.data);//同时兼容我们的后端返回格式
          else cb(requestReply);
        }
      }
    } else {
      console.debug('REQUEST_TIMEOUT for path:' + path);
    }
  });
};

function callRequest(fullPath, options, reqSpec, reqCb) {
  try {
    doRequest(fullPath, options, reqSpec, reqCb);
  } catch (ex) {
    alert(ex.message);
  }
  // if(options.method == 'GET')XHRGet(fullPath, options, reqCb);
  // else XHRPost(fullPath, options, reqCb);
}

function XHRGet(url, options, cb) {
  console.log('XHRGet');
  var xhr = new XMLHttpRequest();
  xhr.open('GET', url, true);
  var headers = options.headers || {};
  Object.keys(headers).forEach(function (key) {
    xhr.setRequestHeader(key, headers[key]);
  });
  xhr.onload = function () {
    if (xhr.status >= 200 && xhr.status <= 400) {
      // console.log('--1: ',xhr.responseText);
      cb(null, xhr.responseBody || JSON.parse(xhr.responseText));
    } else {
      // console.log('--2: ',xhr.responseText);
      cb(new Error(xhr.responseText));
    }
  };
  xhr.send();
}

function XHRPost(url, options, cb) {
  //console.log('XHRPost');
  var xhr = new XMLHttpRequest();
  var data = options.body || {};

  xhr.open('POST', url, true);
  var headers = options.headers || {};
  Object.keys(headers).forEach(function (key) {
    xhr.setRequestHeader(key, headers[key]);
  });

  xhr.onload = function () {
    if (xhr.status >= 200 && xhr.status <= 400) {
      cb(null, xhr.responseBody || JSON.parse(xhr.responseText));
    } else {
      cb(new Error(xhr.responseText));
    }
  };

  xhr.send(JSON.stringify(data));
}

//冒泡排序
export function bubbleSort(array, sortKey, sortType) {
  var temp;
  for (var i = 0; i < array.length - 1; i++) {
    for (var j = i + 1; j < array.length; j++) {
      var iElem = array[i], jElem = array[j], iElemVal = iElem[sortKey], jElemVal = jElem[sortKey];
      if (sortType == 'asc') {
        if (parseFloat(iElemVal) > parseFloat(jElemVal)) {
          temp = iElem;
          iElem = jElem;
          jElem = temp;
        }
      } else {
        if (parseFloat(iElemVal) < parseFloat(jElemVal)) {
          temp = iElem;
          iElem = jElem;
          jElem = temp;
        }
      }
    }
  }
}

export function bindThis(_this, fnNames) {
  fnNames.forEach(name => _this[name] = _this[name].bind(_this))
}

export function bindReducerToWindow(reducer, nodeName) {
  return (state, action) => {
    var newState = reducer(state, action);
    if (!window.s) window.s = {};
    window.s[nodeName] = newState;
    return newState;
  }
}

export function getRemainLocalStorageSpace() {
  var remainSpace = 1024 * 1024 * 5 - unescape(encodeURIComponent(JSON.stringify(localStorage))).length;
  return remainSpace / 1000 + 'Kb';
}

var path_tile_ = {
  '/today-task': '今日任务',
  '/contactsBook': '通讯录',
  '/talk-library': '话术库',
  '/home': '主页',
  '/new-contact': '新建客户',
  '/businessReport': '业务报表',
  '/test-ride-drive': '试驾登记',
  '/article-list': '内容营销',
  '/digital-card': '电子名片',
  '/follow-up-maintain': '跟进周期维护',
  '/content-leads-follow-up': '关注我的客户'
};
export function getPathTitle(path) {
  var title = path_tile_[path];
  if (title) return title;
  else return path;
}

/*
 判断是整数还是小数
 */
export function isFloat(number) {
  return parseInt(number) - number != 0
}

export const float100 = (num) => {
  return parseInt(parseFloat(num) * 100);
};

export const roundFloat100 = (num) => {
  return roundNumber(parseFloat(num) * 100);
};

//四舍五入
/*
 6.3 ---> 6
 6.8 ---> 7
 -6.3 ---> -6
 -6.8 ---> -7
 */
export const roundNumber = (number) => {
  var f = parseFloat(number);
  var i = parseInt(number);
  if (f > 0) {
    if (f - i >= 0.5) return i + 1;
    else return i;
  } else {
    if (f - i <= -0.5) return i - 1;
    else return i;
  }
};

export const commaInt = (number) => {
  return parseInt(number).toLocaleString();
};

export const commaFloat = (numberStr) => {
  if ((numberStr + '').indexOf(',') != -1) return numberStr;
  else if ((numberStr + '').indexOf('.') != -1) return parseFloat(numberStr).toLocaleString();
  else return parseInt(numberStr).toLocaleString();
};

//四舍五入后加千分符
export const roundAndComma = (number) => {
  return roundNumber(number).toLocaleString();
};

export const contains = (arr, obj) => {
  var i = arr.length;
  while (i--) {
    if (this[i] === obj) {
      return true;
    }
  }
  return false;
};

export const logout = () => {
  getCommonState().login.token = '';
  localStorage.removeItem(LS_LOGIN);
  //todo 异步地向服务器发出一个登出请求
};

//CONFIGURATION
var smsOptions = {
  replaceLineBreaks: false, // true to replace \n by a new line, false by default
  android: {
    intent: 'INTENT'  // send SMS with the native android SMS messaging
    //intent: '' // send SMS without open any other app
  }
};

/**
 * 发送短信
 * @param number {String|Array} 电话号码
 * @param message {String} 短信文案
 * @param cb|optional
 */
export const sendSMS = (number, message, cb) => {
  sms.send(number, message, smsOptions, (reply) => {
    Toast.info('done:' + reply, 1);
    if (cb) cb(null, reply)
  }, (err) => {
    if (err.indexOf('cancel') != -1)Toast.info('取消短信发送', 1);
    else Toast.info('error:' + err, 1);
    if (cb) cb(err)
  });
};

//@see https://github.com/xu-li/cordova-plugin-wechat
export const shareToWX = (shareBody, cb) => {
  //Wechat.auth((response)=> {}, (reason)=> {}); // if need auth
  Wechat.isInstalled(function (installed) {
    if (installed) {
      Wechat.share(shareBody, function () {
        if (cb) cb(null);
        else Toast.info('分享成功', 1);
      }, function (failReason) {
        if (cb) cb(failReason);
        else Toast.info('分享失败:' + reason, 1);
      });
    } else {
      Toast.info("分享失败，您的手机还未安装微信！", 3);
    }
  }, function (reason) {
    Toast.info("check installed failed: " + reason, 6);
  });
};

/**
 * 分享普通文本至微信好友会话
 * @param text
 * @param cb
 */
export const shareTextToWXSession = (text, cb) => {
  shareToWX({text, scene: Wechat.Scene.SESSION}, cb);
};

/**
 * 分享网页链接至微信好友会话
 * messageBody like: {title: "", description: "",thumb: "", webpageUrl: ""}
 * @param messageBody {Object}
 * @param messageBody.title {String} 标题
 * @param messageBody.webpageUrl {String} 网页的url
 * @param messageBody.thumb {String} 小图的url
 * @param messageBody.description|optional {String} 描述
 * @param messageBody.mediaTagName|optional {String}
 * @param cb|optional
 */
export const shareWebPageToWXSession = (messageBody, cb) => {
  var {title, webpageUrl, thumb = '', description = '', mediaTagName = ''} = messageBody;
  var shareBody = {
    message: {title, description, mediaTagName, thumb, media: {type: Wechat.Type.WEBPAGE, webpageUrl}},
    scene: Wechat.Scene.SESSION
  };
  shareToWX(shareBody, cb);
};

/**
 * 分享普通文本至我的朋友圈
 * @param text
 * @param cb
 */
export const shareTextToWXTimeline = (text, cb) => {
  shareToWX({text, scene: Wechat.Scene.TIMELINE}, cb);
};

/**
 * 分享网页链接至我的朋友圈
 * @param messageBody {Object}
 * @param messageBody.title {String} 标题
 * @param messageBody.webpageUrl {String} 网页的url
 * @param messageBody.thumb {String} 小图的url
 * @param messageBody.description|optional {String} 描述
 * @param messageBody.mediaTagName|optional {String}
 * @param cb|optional
 */
export const shareWebPageToWXTimeline = (messageBody, cb) => {
  var {title, webpageUrl, thumb = '', description = '', mediaTagName = ''} = messageBody;
  var shareBody = {
    message: {title, description, mediaTagName, thumb, media: {type: Wechat.Type.WEBPAGE, webpageUrl}},
    scene: Wechat.Scene.TIMELINE
  };
  shareToWX(shareBody, cb);
};

// @see https://www.npmjs.com/package/cordova-plugin-camera
const defaultCameraOptions = {
  quality: 50,// Some common settings are 20, 50, and 100
  allowEdit: true,
  correctOrientation: true //Corrects Android orientation quirks
};
if (window.Camera) {
  defaultCameraOptions.destinationType = Camera.DestinationType.FILE_URI;
  // In this app, dynamically set the picture source, Camera or photo gallery
  defaultCameraOptions.sourceType = Camera.DestinationType.CAMERA;
  defaultCameraOptions.encodingType = Camera.DestinationType.JPEG;
  defaultCameraOptions.mediaType = Camera.DestinationType.PICTURE;
}

/**
 * 调用设备的摄像头拍照
 * @param cb
 * @param options targetWidth,targetHeight
 */
export const takePhoto = (cb, options) => {
  var mergedOptions;
  if (options) mergedOptions = {...defaultCameraOptions, options};
  else mergedOptions = defaultCameraOptions;
  navigator.camera.getPicture(function cameraSuccess(imageUri) {
    cb(null, imageUri);
  }, function cameraError(error) {
    cb(error);
  }, mergedOptions);
};

export const downloadFile = (fileURL, path, cb, dispatch, reqSpec = {
  attachPrefix: true,
  hasReply: true,
  throwError: false
}) => {
  var fileName = '';
  if (fileURL) fileName = fileURL.substr(fileURL.lastIndexOf('/') + 1);
  var fileTransfer = new FileTransfer();
  var uri = encodeURI(fileURL);
  var targetUrl = path + fileName;

  fileTransfer.download(uri, targetUrl, function (reply) {
    if (dispatch) dispatch({type: HIDE_LOADING});
    cb(reply)
  }, function (err) {
    if (dispatch) dispatch({type: HIDE_LOADING});
    if (reqSpec.throwError) cb(null, err);
    else dlg.info(err.exception);
  });
}


/**
 * 提交设备上的指定了绝对路径的文件
 * @param fileURL
 * @param fieldName
 * @param fileName
 * @param body
 * @param path
 * @param cb
 * @param dispatch
 * @param reqSpec
 */
export const postDataWithFile = ({fileURL, fieldName, fileName = '', body = ''}, path, cb, dispatch, reqSpec = {
  attachPrefix: true,
  hasReply: true,
  throwError: false
}) => {
  var options = new FileUploadOptions();
  options.fileKey = fieldName;
  options.fileName = fileName;
  // options.mimeType = "text/plain";
  options.mimeType = "image/jpeg";

  if (!fileName) options.fileName = fileURL.substr(fileURL.lastIndexOf('/') + 1);
  else options.fileName = fileName;

  if (body) {
    options.params = body;
  }

  options.headers = {apiKey: __API_KEY__};
  var token = store.getState().common.login.token;
  if (token) options.headers.token = token;

  var ft = new FileTransfer();
  if (dispatch) dispatch({type: SHOW_LOADING});
  if (reqSpec.attachPrefix) apiURL = urlPrefix + apiURL;


  var fullPath;
  if (reqSpec.attachPrefix) fullPath = urlPrefix + path;
  else fullPath = path;
  ft.upload(fileURL, fullPath, (reply) => {
    if (dispatch) dispatch({type: HIDE_LOADING});
    //r.responseCode, r.response, r.bytesSent
    cb(reply)
  }, (err) => {
    if (dispatch) dispatch({type: HIDE_LOADING});
    if (reqSpec.throwError) cb(null, err);
    else dlg.info(err.exception);
  }, options);
};

/**
 * 提交input file里的文件
 * @param path
 * @param file
 * @param fieldName
 * @param postData
 * @param cb
 * @param dispatch
 * @param reqSpec
 */
export const postFormWithFile = (path, file, fieldName, postData, cb, dispatch, reqSpec = {
  attachPrefix: true,
  hasReply: true,
  throwError: false
}) => {
  var xhr = new XMLHttpRequest();
  var formData = new FormData();
  formData.append(fieldName, file, file.name);
  if (postData) formData.append('data', JSON.stringify(postData));

  var fullPath;
  if (reqSpec.attachPrefix) fullPath = urlPrefix + path;
  else fullPath = path;
  xhr.open('POST', fullPath, true);

  var token = store.getState().common.login.token;
  if (token) xhr.setRequestHeader("token", token);
  xhr.setRequestHeader("apiKey", __API_KEY__);

  xhr.onload = function () {
    if (dispatch) dispatch({type: HIDE_LOADING});
    if (xhr.status >= 200 && xhr.status <= 400) {
      cb(xhr.responseBody || JSON.parse(xhr.responseText));
    } else {
      if (reqSpec.throwError) cb(null, xhr.responseBody);
      else dlg.info(xhr.responseBody);
    }
  };

  xhr.onreadystatechange = function () {
    if (dispatch) dispatch({type: HIDE_LOADING});
    if (xhr.readyState === 4) {
      if (xhr.status == 0) {//net::ERR_INTERNET_DISCONNECTED
        if (reqSpec.throwError) cb(null, '您的网络不好,请稍后重试');
        else dlg.info('您的网络不好,请稍后重试');
      }
    }
  };

  if (dispatch) dispatch({type: SHOW_LOADING});
  xhr.send(formData);
};

/**
 * 获取ip地址，就算报错也返回127.0.0.1，为了不影响业务逻辑
 * @param cb
 */
export const getIP = (cb)=> {
  var url = 'https://freegeoip.net/json/';
  //var url = 'https://pv.sohu.com/cityjson?ie=utf-8';
  justGet(url, (reply)=> {
    if(reply === 'error'){
      cb('0.0.0.0');
    }else{
      cb(reply.ip);
    }
  }, null, {json: true,throwError:true});
};

export const print = (htmlStr)=> {
  cordova.plugins.printer.check(
    (avail, count)=> {
      if (avail) {
        cordova.plugins.printer.print(htmlStr, 'Document.html');
      } else {
        dlg.info('printer unavailable!')
      }
    }
  );
};

export const getDistrict = (level, data) => {
  var district = [];
  var parent = data.filter((item) => {
    return item.level == level;
  })
  console.log(parent.length)
  return parent.map((item) => {
    return {
      value: item.id,
      label: item.nameCn,
      children: _getChildren(item.id, data)
    }
  })

}

function _getChildren(parentId, data) {
  var parent = data.filter((item) => {
    return item.parentId == parentId;
  })

  return parent.map((item) => {
    return {
      value: item.id,
      label: item.nameCn,
      children: _getChildren(item.id, data)
    }
  });
}

export const checkPhone = (phone) => {
  if (!(/^1[34578]\d{9}$/.test(phone))) {
    return false;
  } else {
    return true;
  }
}
export const checkValue = (data, field) => {
  return data ? data[field] : '';
}

export const checkEmail = (phone) => {
  if (!/^([a-zA-Z0-9_-])+@([a-zA-Z0-9_-])+(.[a-zA-Z0-9_-])+/.test) {
    return false;
  } else {
    return true;
  }
}


export const printProtocol = (detail) => {
  return "<!doctype html> <html> <head> </head><style type='text/css'>*{padding: 0;margin:0;}.clearfix:after {content: '.';height: 0;display: block;visibility: hidden;clear: both;font-size: 0;}i{font-style: normal;}html{font-size: 50px;}ul{list-style: none;}.col-sm-5,.col-sm-7,.col-sm-12 {float: left;}.col-sm-5 {width: 41.66667%;}.col-sm-7 {width: 58.33333%;}.col-sm-12 {width: 100%;}.gStep3 {width: 100%;font-size: 14px;}.gStep3 .gProtocol{background: #fff;margin: 0.8rem 0.2rem 0.3rem;border:1px solid #979797;color: #333;}.gStep3 .gProtocol>h1{font-size: 0.28rem;text-align: center;}.gStep3 .gProtocol>h1+p{padding: 0 0.2rem;margin-bottom: 5px;}.gStep3 .gProtocol>h1+p img{width: 0.94rem;}.gStep3 .gProtocol ul{border-bottom: 1px solid #999;}.gStep3 .gProtocol ul li:not(.gSign){border-top: 1px solid #999;height: 0.52rem;line-height: 0.52rem;padding:0 0.2rem;}.gStep3 .gProtocol ul li>span:first-child{border-right: 1px solid #999;box-sizing: border-box;}.gStep3 .gProtocol ul li>span:last-child{padding-left: 15px;box-sizing: border-box;}.gStep3 .gProtocol article{margin:0.24rem 0;padding: 0 0.2rem;font-size: 0.24rem;line-height: 0.32rem;}.col-sm-5 {width: 41.66667%;}.gDriveLicense {text-align: center;margin: 10px 0 20px;} .gStep3 .gReaded{  position: relative;  padding-left: 30px;  height: 0.8rem;  line-height: 40px;  font-size: 0.28rem;  font-weight: bold;}.gStep3 .gReaded .showRight{  width: 25px;  position: absolute;  left:5px;  top:7px;}.gStep3 .popOperate{  margin:0px;  padding:0 10px 0.3rem;} .fr{  float: right;} .gSign {border-top: 1px solid #999;vertical-align: middle;padding:0 0.2rem;line-height: 0.52rem;text-align: center;}.gSign p{  text-align: left;}.gSign img{  width: 200px;}</style><body>   <div class='gStep3'><div class='gProtocol'><h1>试乘试驾协议书</h1><p><span>经销商代码:" + detail.dealerCode + "</span> <img class='fr' src='http://192.168.2.215/group1/M00/00/04/wKgC11lKGOeAZxzXAAAYnEpXF28320.png'/></p><ul><li class='clearfix'><span class='col-sm-5'> 试乘试驾车型选择</span><span class='col-sm-7'>" + detail.modelNameCn + "</span></li><li class='clearfix'><span class='col-sm-5'> 试乘试驾体验项目</span><span class='col-sm-7'>" + detail.type + "</span></li><li class='clearfix'><span class='col-sm-5'> 试驾路线选择</span><span class='col-sm-7'> " + detail.routeId + "</span></li><li class='clearfix'><span class='col-sm-5'> 试乘试驾登记时间</span><span class='col-sm-7'>" + detail.createdDate + "</span></li>          </ul>          <article class='clearfix'>本人于    " + detail.year + "      年  " + detail.month + "     月   " + detail.day + "    日参加试乘试驾活动，特此作如下陈述与声明：为保证试驾活动的规范性和顺利进行，本人同意将身份证和驾驶证复印件作为法定身份证明。<div><span class='col-sm-12'>A：对自驾同时作如下陈述与声明：</span><p style={ text-indent: 14px }> 本人声明至少具有一年以上汽车驾龄，同时拥有相等年限的实际驾驶经验，并有能力独自承担造成事故后的相应赔偿责任，本人承诺以上提供的信息完全属实（附驾驶证复印件）。</p><p style={text-indent: 14px }> 本人在试驾过程中，将严格遵守行车驾驶的一切法规和要求，并服从贵公司提出的一切指示和安排，做到安全、文明驾驶，不违规操作和尝试危险性动作，以尽最大努力和善意保护试乘试驾车辆的安全和完好。否则，因此造成对贵公司的一切损失和危害，将由本人全部独自承担和赔偿。</p></div><div><span class='col-sm-12'>B：对试乘同时作如下陈述与声明：</span><p style={{ textIndent: 14 }}>本人在试乘过程中，将服从贵公司提出的指示，以尽最大努力和善意保护试驾车辆的安全和完好，应严格遵守交通规则，如有交通事故，驾驶人依保险条款及相关法规承担相应责任。</p></div>          </article>          <div class='gReaded'><div class='checkboxOne checkedBorder gtimeCheckBox'><img class='showRight' src='http://192.168.2.215/group1/M00/00/04/wKgC11lKF-uASj6wAAADc3UR_FI076.png'></div><i>我已阅读并确认了解试乘试驾声明</i></div>          <ul><li> 试驾人详细信息</li> <li class='clearfix gSign'><div class='col-sm-12'><p> 客户(试驾人)签名</p><img src=" + detail.signatureUrl + " />             </div>          </li>            <li class='clearfix'><span class='col-sm-5'> 身份证／驾驶证号</span><span class='col-sm-7'>" + detail.drivingLicenseNo + "</span>            </li>            <li class='clearfix'><span class='col-sm-5'>手机／固定电话</span><span class='col-sm-7'>" + detail.mobile + "</span>            </li>            <li class='clearfix'><span class='col-sm-5'>日期</span><span class='col-sm-7'></span>            </li>            <li class='clearfix'><span class='col-sm-5'> 销售顾问／试驾专员</span><span class='col-sm-7'>" + detail.nameCn + "</span>            </li>          </ul>          <p style='padding: 10px'>驾照</p>          <div class='gDriveLicense'  ><img src=" + detail.drivingLicenseUrl + " />          </div>          <div>          </div>        </div>              </div> </body></html>";

}


export const formatDate = function (date, type) {
  var y = date.getFullYear();
  var m = date.getMonth() + 1;
  m = m < 10 ? '0' + m : m;
  var d = date.getDate();
  d = d < 10 ? ('0' + d) : d;
  if (type == 1) {
    return y + '年' + m + '月' + d + '日';
  } else if (type == 2) {
    return y + '/' + m + '/' + d;
  }
};


