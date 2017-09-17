/**
 * Created by zhongzhengkai on 2016/12/26.
 */


import { doRequest } from './tool/net';
import * as dlg from './tool/dlg';
import { SHOW_LOADING, HIDE_LOADING } from '../constants/action-name';
import { LS_LOGIN } from '../constants';
import React, { Component } from 'react';
import { store } from '../store/index';
import Toast from 'antd-mobile/lib/toast';

var appWidth = screen.width;
var appHeight = screen.height;//整个webview的高度
var appViewWidth = appWidth <= 768 ? appWidth : 768;//整个app显示区域的宽度
var appViewHeight = appHeight;//整个app显示区域的高度

if (navigator.userAgent.indexOf('Android') != -1)appViewHeight -= 24;

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

export const getCSSPixelWidth = () => {
  return appWidth;
};

export const getCSSPixelHeight = () => {
  return appHeight;
};
// 显示区域宽度
export const getAppViewWidth = ()=>{
  return appViewWidth;
};

export const getAppViewHeight = ()=>{
  return appViewHeight;
};

export const getCommonState = () => {
  return store.getState().common;
};

export const setQuery = (path, query) => {
  var common = store.getState().common;
  common.query[path] = query;
  common.currentPath = path;
};

export const getCurrentQuery = () => {
  var common = store.getState().common;
  return common.query[common.currentPath];
};

//mode属性用来决定是否允许跨域请求，以及哪些response属性可读。可选的mode属性值为same-origin，no-cors（默认）以及cors。
var mode = 'cors';
var urlPrefix = __API_HOST__;
// var headers = { 'Content-Type': 'application/json', apiKey: __API_KEY__ };


const defaultSpec = { attachPrefix: true, hasReply: true, throwError:false };
export const doGet = (path, cb, dispatch, inputReqSpec) => {
  //测试设置doGet 的header
  const __API_KEY__ = 'apiKey-DCCM-IOS';
  const token = '27de3312c5194d928c1a665f37e84e0b';
  var headers = {'Content-Type': 'application/json', apiKey: __API_KEY__,token:token};
  var reqSpec = {...defaultSpec, ...inputReqSpec};
  request(path, { method: 'GET', mode, headers }, cb, dispatch, reqSpec);
};


//请求特征设定 reqSpec: {noPrefix:true, hasReply:true}
// export const doGet = (path, cb, dispatch, inputReqSpec) => {
//   var token = store.getState().common.login.token;
//   if (token) headers.token = token;
//   var reqSpec = {...defaultSpec, ...inputReqSpec};
//   request(path, { method: 'GET', mode, headers }, cb, dispatch, reqSpec);
// };

export const doPost = (path, toPost, cb, dispatch, inputReqSpec) => {
  var token = store.getState().common.login.token;
  if (token) headers.token = token;
  var reqSpec = {...defaultSpec, ...inputReqSpec};
  request(path, { method: 'POST', body: toPost, mode, headers }, cb, dispatch, reqSpec);
};

export const justPost = (path, toPost, cb, dispatch, reqSpec = {}) => {
  var headers = {};
  if (reqSpec.headers) headers = reqSpec.headers;
  request(path, { method: 'POST', body: toPost, mode, headers }, cb, dispatch, {...reqSpec, attachPrefix: false });
};

export const justGet = (path, cb, dispatch, reqSpec = {}) => {
  const __API_KEY__ = 'apiKey-DCCM-IOS';
  const token = '27de3312c5194d928c1a665f37e84e0b';
  var headers = {'Content-Type': 'application/json', apiKey: __API_KEY__,token:token};
  // var headers = {};
  if (reqSpec.headers) headers = reqSpec.headers;
  request(path, { method: 'GET', mode, headers }, cb, dispatch, {...reqSpec, attachPrefix: false });
};

const requestReplyStatus = {};
const TIME_OUT = 38000;

export const request = function request(path, options, cb, dispatch, reqSpec = { attachPrefix: true, hasReply: true, throwError:false }) {
  if (dispatch) dispatch({ type: SHOW_LOADING });
  var fullPath;
  if (reqSpec.attachPrefix) fullPath = urlPrefix + path;
  else fullPath = path;
  console.log(' request url:' + fullPath);

  console.log('------>request data:', fullPath, options);
  var requestReply;
  var timerId = setTimeout(() => {
    if (!requestReply) dlg.toast('http request timeout!');
    if (dispatch) dispatch({ type: HIDE_LOADING });
    requestReplyStatus[timerId] = 'REQUEST_TIMEOUT';
    console.debug('------>REQUEST_TIMEOUT:', timerId, requestReplyStatus)
  }, TIME_OUT);
  requestReplyStatus[timerId] = 'REQUEST_START';

  callRequest(fullPath, options, reqSpec, (err, reply) => {
    requestReply = reply;
    clearTimeout(timerId);

    if (requestReplyStatus[timerId] != 'REQUEST_TIMEOUT') {
      requestReplyStatus[timerId] = 'REQUEST_END';
      if (dispatch) dispatch({ type: HIDE_LOADING });
      console.debug('<------ request reply:' + path, reply, err);
      if (err) {
        if (err.message == 'Failed to fetch') dlg.toast('no network signal');
        else {
          if(reqSpec.throwError)cb(requestReply);
          else dlg.info(err.message);
        }
      } else {
        if (requestReply.error) {
          var errText = requestReply.message ? requestReply.message : requestReply.error;
          if (reqSpec.throwError) cb(requestReply, errText);
          else dlg.info(errText);
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
    var newState = reducer(state, action); //返回一个新的state
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
  '/new-contact': '新建客户页',
  '/businessReport':'业务报表',
  '/test-ride-drive':'试驾登记'
};
export function getPathTitle(path) {
  var title = path_tile_[path];
  if (title) return title;
  else return path;
}

export function setPathTitle(path,title) {
 path_tile_[path] = title;
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
    Toast.info('error:' + err, 1);
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
      }, function (reason) {
        if (cb) cb(reason);
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
  shareToWX({ text, scene: Wechat.Scene.SESSION }, cb);
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
  var { title, webpageUrl, thumb = '', description = '', mediaTagName = '' } = messageBody;
  var shareBody = {
    message: { title, description, mediaTagName, thumb, media: { type: Wechat.Type.WEBPAGE, webpageUrl } },
    scene: Wechat.Scene.SESSION
  };
  Wechat.share(shareBody, cb);
};

/**
 * 分享普通文本至我的朋友圈
 * @param text
 * @param cb
 */
export const shareTextToWXTimeline = (text, cb) => {
  shareToWX({ text, scene: Wechat.Scene.TIMELINE }, cb);
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
  var { title, webpageUrl, thumb = '', description = '', mediaTagName = '' } = messageBody;
  var shareBody = {
    message: { title, description, mediaTagName, thumb, media: { type: Wechat.Type.WEBPAGE, webpageUrl } },
    scene: Wechat.Scene.TIMELINE
  };
  Wechat.share(shareBody, cb);
};

// @see https://www.npmjs.com/package/cordova-plugin-camera
const defaultCameraOptions = {
  quality: 50,// Some common settings are 20, 50, and 100
  allowEdit: true,
  correctOrientation: true //Corrects Android orientation quirks
};
if(window.Camera){
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
export const takePhoto = (cb, options)=>{
  var mergedOptions;
  if(options) mergedOptions = {...defaultCameraOptions, options};
  else mergedOptions = defaultCameraOptions;
  navigator.camera.getPicture(function cameraSuccess(imageUri) {
    cb(null, imageUri);
  }, function cameraError(error) {
    cb(error);
  }, mergedOptions);
};

/**
 *
 * @param fileURL
 * @param fieldName
 * @param fileName
 * @param body
 * @param apiURL
 * @param cb
 * @param dispatch
 * @param reqSpec
 */
export const postDataWithFile = ({fileURL, fieldName, fileName='', body=''}, apiURL, cb, dispatch, reqSpec = { attachPrefix: true, hasReply: true, throwError:false })=>{
  var options = new FileUploadOptions();
  options.fileKey = fieldName;
  options.fileName = fileName;
  // options.mimeType = "text/plain";
  options.mimeType = "image/jpeg";

  if(!fileName) options.fileName = fileURL.substr(fileURL.lastIndexOf('/') + 1);
  else options.fileName = fileName;

  if (body) {
    options.params = body;
  }

  var ft = new FileTransfer();
  if (dispatch) dispatch({ type: SHOW_LOADING });
  if (reqSpec.attachPrefix) apiURL = urlPrefix + apiURL;
  alert(JSON.stringify(options.params));
  ft.upload(fileURL, apiURL, (reply)=>{
    if (dispatch) dispatch({ type: HIDE_LOADING });
    //r.responseCode, r.response, r.bytesSent
    cb(reply)
  }, (err)=>{
    if (dispatch) dispatch({ type: HIDE_LOADING });
    if (reqSpec.throwError) cb(null, err);
    else dlg.info(err.exception);
  }, options);
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
  }else{
    return true;
  }
}
export const checkValue = (data,field) => {
return data?data[field]:'';
}


