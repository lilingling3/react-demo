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
import {ANDROID_API_KEY, IOS_API_KEY} from '../constants';
import testDriveTemplate from './test-drive-template';
import {getApiHost} from './api-host-conf';

var appWidth = screen.width;
var appHeight = screen.height;//整个webview的高度
var appViewWidth = appWidth <= 768 ? appWidth : 768;//整个app显示区域的宽度

//整个app显示区域的高度, 这样计算是为了防止有些机型的底部虚拟按键条占用了webview
// var appViewHeight =window.innerHeight+(screen.height- window.innerHeight)/window.devicePixelRatio;
var appViewHeight =appHeight;

export const getSysPlatform = ()=>{
  if(navigator.userAgent.indexOf('Android')!=-1)return 'Android';
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

const sidebarStyle = { position: 'fixed', width: '100%', bottom: 0, zIndex: 888, overflowY: 'auto', background: '#fff' };
if(getSysPlatform()=='IOS')sidebarStyle.top = 10;
export const getSidebarStyle = (zIndex=888,top) => {
  var newStyle = {sidebar:{...sidebarStyle,zIndex}};
  if(top!==null)newStyle.top = top;
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

export const setQuery = (path, query, props) => {
  var common = store.getState().common;
  common.prevPath = common.currentPath;
  common.currentPath = path;
  if (query)common.query[path] = query;
  if (props)common.props[path] = props;
};

//query 由子组件内部自己调用
export const getCurrentQuery = () => {
  var common = store.getState().common;
  var result = common.query[common.currentPath] || {};
  common.query[common.currentPath] = null;//!!! 调用一次就清理掉
  common.queryBak[common.currentPath] = result;// 仅仅做记录，方便核查
  return result;
};

//props 由顶层App组件实例化某个页面组件时调用
export const getCurrentProps = () => {
  var common = store.getState().common;
  var result = common.props[common.currentPath];
  common.props[common.currentPath] = null;//!!! 调用一次就清理掉
  common.propsBak[common.currentPath] = result;// 仅仅做记录，方便核查
  return result;
};

const pageLeaveEventManager = {};
export const definePageLeaveHandler = (pagePath, handlerFn)=>{
  pageLeaveEventManager[pagePath] = handlerFn;
};

export const getPageLeaveHandler = (pagePath)=>{
  return pageLeaveEventManager[pagePath];
};

export const getCurrentPath = ()=>{
  var common = store.getState().common;
  return common.currentPath;
};

/**
 * @see https://github.com/apache/cordova-plugin-device
 * device {<uuid>,<version> ...}
 * 目前我们的版本号写在 constants/index.js里，保证和app上架的版本一致就可以了
 */
export const getDeviceInfo = ()=>{
  return window.device ? window.device:{uuid:'no-device-plugin'};
};
var uuid = 'test-device-from-browser';
if(window.device)uuid = window.device.uuid;

//mode属性用来决定是否允许跨域请求，以及哪些response属性可读。可选的mode属性值为same-origin，no-cors（默认）以及cors。
var mode = 'cors';
var apiKey = getSysPlatform() == 'IOS' ? IOS_API_KEY : ANDROID_API_KEY;
var headers = {'Content-Type': 'application/json', apiKey, uuid};

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
  request(path, {method: 'GET', mode, headers}, cb, dispatch, {...reqSpec, attachPrefix: false});
};

var dispatchRef = null;
export const setDispatch = dispatch=> {
  dispatchRef = dispatch;
};

var requestReplyStatus = {};
const TIME_OUT = 38000;
var tokenExpireMessageCount = 0;

export const setTokenExpireMessageCountZero = ()=> {
  tokenExpireMessageCount = 0;
  getCommonState().login.token = '';
  localStorage.removeItem(LS_LOGIN);
};

export const request = function request(path, options, cb, dispatch, reqSpec = {
  attachPrefix: true,
  hasReply: true, //false 可能没结果
  json:true,
  throwError: false
}) {
  var urlPrefix = getApiHost();
  if (dispatch) dispatch({type: SHOW_LOADING});
  var fullPath;
  if (reqSpec.attachPrefix) fullPath = urlPrefix + path;
  else fullPath = path;
  console.log(' request url:' + fullPath);

  // alert(fullPath);
  if (__APP_ENV__ != 'prod')console.log('------>request data:', fullPath, options);
  var requestReply;
  var timerId = setTimeout(() => {
    if (!requestReply) dlg.toast('网络请求超时!');
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
      if (__APP_ENV__ != 'prod')console.debug('<------ request reply:' + path, JSON.parse(JSON.stringify(reply)));
      if (err) {
        // if (err.message == 'Failed to fetch') dlg.toast('no network signal',6);
        if (err.message == 'Failed to fetch') dlg.toast('当前服务器连接不可用，请稍后再试！',6);
        else {
          if (reqSpec.throwError) {
            if(cb)cb(requestReply);
            else dlg.info(requestReply);
          }else dlg.info(err.message);
        }
      } else {
        if (requestReply.error) {
          var errText = requestReply.message ? requestReply.message : requestReply.error;
          if (reqSpec.throwError) {
            if(cb)cb(requestReply, errText);
            else {
              if(dispatchRef)dispatchRef({type:HIDE_LOADING});
              dlg.info(errText);
            }
          }else{
            if(errText=='授权过期!' || errText=='服务器端返回空对象'){
              tokenExpireMessageCount++;
              if (tokenExpireMessageCount == 1) {
                var displayLabel = getErrMessageDisplayLabel(errText);
                if (dispatchRef)dispatchRef({type: 'TOKEN_EXPIRE_ERROR', payload: displayLabel});
                else{
                  dlg.info(displayLabel, ()=> setTokenExpireMessageCountZero());
                }
              }
            }else{
              if(dispatchRef)dispatchRef({type:HIDE_LOADING});
              dlg.info(errText);
            }
          }
        } else {
          if(cb){
            if (requestReply.data) cb(requestReply.data);//同时兼容我们的后端返回格式
            else cb(requestReply);
          }
        }
      }
    } else {
      console.debug('REQUEST_TIMEOUT for path:' + path);
    }
    if (timerId % 100 == 0)requestReplyStatus = {};//防止requestReplyStatus 越来越大

  });
};

function getErrMessageDisplayLabel(messge){
  if(messge=='授权过期!')return '登录会话已超时，请退出重新登录！';
  else if(messge=='服务器端返回空对象!')return '服务器正在维护中，请稍后重试！';
  else return messge;
}

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
export function bubbleSort(array, sortKey, sortType, valueHandler) {
  var temp;
  for (var i = 0; i < array.length - 1; i++) {
    for (var j = i + 1; j < array.length; j++) {
      var iElem = array[i], jElem = array[j], iElemVal = iElem[sortKey], jElemVal = jElem[sortKey];
      if(valueHandler)iElemVal = valueHandler(iElemVal),jElemVal = valueHandler(jElemVal);

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
  '/new-contact': '新增客户',
  '/business-report':'业务报表',
  '/test-ride-drive':'试驾登记',
  '/article-list':'内容营销',
  '/digital-card':'电子名片',
  '/follow-up-maintain':'跟进周期维护',
  '/content-leads-follow-up':'关注我的客户',
  '/self-info':'我的信息',
  '/my-report':'我的报表',
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
  doLogout();
};

const doLogout=()=>{
  doGet('/api/sps/logout',null,null,{hasReply: false, throwError: true});
}

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
    Toast.info('短信发送完毕', 2);
    if (cb) cb(null, reply)
  }, (err) => {
    var isSendSuccess = true;
    if (err) {
      isSendSuccess = false;
      if(err.indexOf('cancel') != -1)Toast.info('取消短信发送', 1);
      else Toast.info('error:' + err, 1);
    }
    if (cb) cb(err, isSendSuccess)
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
  quality: 20,// Some common settings are 20, 50, and 100
  allowEdit: false,
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
  var urlPrefix = getApiHost();
  var options = new FileUploadOptions();
  options.fileKey = fieldName;
  options.fileName = fileName;
  // options.mimeType = "text/plain";
  options.mimeType = "image/jpeg";

  if (!fileName) options.fileName = fileURL.substr(fileURL.lastIndexOf('/') + 1);
  else options.fileName = fileName;

  if (body) options.params = body;

  options.headers = {apiKey};
  var token = store.getState().common.login.token;
  if (token) options.headers.token = token;

  var ft = new FileTransfer();
  if (dispatch) dispatch({type: SHOW_LOADING});

  var fullPath;
  if (reqSpec.attachPrefix) fullPath = urlPrefix + path;
  else fullPath = path;
  ft.upload(fileURL, fullPath, (r) => {
    if (dispatch) dispatch({type: HIDE_LOADING});
    //r.responseCode, r.response, r.bytesSent
    cb(JSON.parse(r.response))
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
  var urlPrefix = getApiHost();
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
  xhr.setRequestHeader("apiKey", apiKey);
  xhr.onload = function () {
    if (dispatch) dispatch({type: HIDE_LOADING});
    if (xhr.status == 200) {
      if(xhr.responseBody)cb(xhr.responseBody);
      else if(xhr.responseText)cb(JSON.parse(xhr.responseText));
      else{cb({status:'ok'})}
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
      }else {
        // dlg.info('onreadystatechange:'+xhr.status);
      }
    }else {
      // dlg.info('onreadystatechange:'+xhr.readyState);
    }
  };

  if (dispatch) dispatch({type: SHOW_LOADING});
  xhr.send(formData);
};

/**
 * 旋转base64图片
 * @param base64data
 * @param givenDegrees
 * @param callback
 */
export const rotateBase64Image = (base64data, givenDegrees, callback)=> {
  const degrees = givenDegrees % 360;
  if (degrees % 90 !== 0 || degrees === 0) {
    callback(base64data);
    return;
  }

  const canvas = document.createElement('canvas');
  const ctx = canvas.getContext("2d");

  const image = new Image();
  image.src = base64data;
  image.onload = function () {
    if (degrees === 180) {
      canvas.width = image.width;
      canvas.height = image.height;
    } else {
      canvas.width = image.height;
      canvas.height = image.width;
    }
    ctx.rotate(degrees * Math.PI / 180);
    if (degrees === 90) {
      ctx.translate(0, -canvas.width);
    } else if (degrees === 180) {
      ctx.translate(-canvas.width, -canvas.height);
    } else if (degrees === 270) {
      ctx.translate(-canvas.height, 0);
    }
    ctx.drawImage(image, 0, 0);
    callback(canvas.toDataURL());
  };
}

/**
 * 获取ip地址，就算报错也返回127.0.0.1，为了不影响业务逻辑
 * @param cb
 */
export const getIP = (cb)=> {
  justGet('https://pv.sohu.com/cityjson?ie=utf-8', (reply)=> {
    //reply:    var returnCitySN = {"cip": "116.90.81.14", "cid": "110000", "cname": "北京市"};
    var jsonStr = reply.substring(reply.indexOf('{'), reply.indexOf('}') + 1).replace(/ /ig,'');
    var jsonRet = JSON.parse(jsonStr);
    cb(jsonRet.cip)
  }, null, {json: false});
};

export const print = (htmlStr)=>{
  cordova.plugins.printer.check(
    (avail,count)=> {
      if(avail){
        // alert(count);
        // if(count==-1)dlg.info('在当前局域网内找不到打印机,请确保你的手机无线网络功能打开，并且你的手机和打印机处于同一个局域网内');
        // else cordova.plugins.printer.print(htmlStr, 'Document.html');
        cordova.plugins.printer.print(htmlStr, 'Document.html');
      }else{
        dlg.info('打印机不可用!')
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

export const checkEmail = (email) => {
  if (!/^([a-zA-Z0-9_.-])+@([a-zA-Z0-9_-])+(.[a-zA-Z0-9_-])+/.test(email)) {
    return false;
  } else {
    return true;
  }
}

export const printProtocol = (detail) => {
  return testDriveTemplate(detail);
};

export const saveImgToLocal=(url, myAlbum,cb)=>{
  cordova.plugins.photoLibrary.saveImage(url, 'myAlbum', function () {
    cb(null);
  }, function (err) {
    if (err.startsWith('Permission')) {
      cordova.plugins.photoLibrary.requestAuthorization(
        function () {
          // User gave us permission to his library, retry reading it!
          cordova.plugins.photoLibrary.saveImage(url, 'myAlbum', function () {
            cb(null);
          }, function (err) {
            cb(err);
          })
        },
        function (err) {
          // User denied the access
          cb(err);
        }, // if options not provided, defaults to {read: true}.
        {
          read: true,
          write: true
        }
      );
    } else {
      cb("err");
    }
  });
};


