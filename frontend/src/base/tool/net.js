/**
 * Created by zhongzhengkai on 2016/11/8.
 */

import 'whatwg-fetch'

function checkStatus(response) {
  var status = response.status;
  if (status >= 400) {
    var message = '';
    if (status == 404)message = response.url + ' not found';
    else {
      if(response.statusText) message = response.statusText;
      else message = response.url + ' status:'+status;
    }
    var error = new Error(message);
    error.response = response;
    error.status = response.status;
    throw error;
  }
}

function parseJSON(response, reqSpec) {
  //checkStatus(response);
  if (reqSpec.json === false)return response.text();
  else return response.json();
}

function checkReplyError(reply){
  // reply.error = '授权过期!';
  if(reply && reply.message){
    var message = reply.message;
    switch(message){
      case 'User name or password error!:用户名或密码错误!':
        reply.message = '用户名或密码错误';
        break;
      case 'Verify code error, please re - obtain!:验证码错误, 请重新获取!':
        reply.message = '验证码错误, 请重新获取!';
        break;
      case 'The user role is illegal!:该用户角色不合法!':
        reply.message = '该用户角色不合法!';
        break;
      case 'Server internal error!:服务器内部错误!':
        reply.message = '服务器内部错误!';
        break;
      case 'not found user!:不存在此用户!':
        reply.message = '不存在此用户!';
        break;
      case '授权过期':
        reply.message = '授权过期!';
        break;
      default:
        if (message.indexOf('不存在此用户') > -1)reply.message = '不存在此用户!';
        break;
    }
  }
}

//method - 使用的HTTP动词， GET , POST , PUT , DELETE , HEAD
//url - 请求地址，URL of the request
//headers - 关联的Header对象
//referrer - referrer
//mode - 请求的模式，主要用于跨域设置， cors , no-cors , same-origin
//credentials - 是否发送Cookie omit , same-origin
//redirect - 收到重定向请求之后的操作， follow , error , manual
//integrity - 完整性校验
//cache - 缓存模式( default , reload , no-cache )

/**
 *
 * @param path
 * @param options {object}
 * @param reqSpec {object}
 * @param options.method {string}
 * @param options.body {object} 当method为POST时,要提交的数据
 * @param cb
 * @returns {*}
 */
export function doRequest(path, options, reqSpec, cb) {
  options.body = JSON.stringify(options.body);

  fetch(path, options)
    .then((response)=> {
      return parseJSON(response,reqSpec)
    })
    .then(function (reply) {
      checkReplyError(reply);
      cb(null, reply);
    })
    .catch(function (error) {
      if(error instanceof Error){
        if (error.message.indexOf('Unexpected end') >=0
          || error.message.indexOf('The string did not match the expected pattern') >= 0
          || error.message.indexOf('Unexpected EOF') >= 0
          || error.message.indexOf('Unexpected token') >= 0
          || error.message.indexOf('JSON Parse error') >= 0
        ) {
          if (!reqSpec.hasReply)cb(null, '');
          else {
            console.log('%c' + error.message, 'color:red');
            error.message = '服务器端返回空对象';
            cb(error, null);
          }
        } else if (error.message && error.message.indexOf('Type error') != -1) {//!!! ios里设置不允许使用无线网络权限时，会报此错误
          cb('应用程序没有使用无线网络的权限，请去设置里重新授权', null);
        } else if (error.message && error.message.indexOf('Network request failed') != -1) {//!!! ios里设置不允许使用无线网络权限时，会报此错误
          cb('网络请求失败，请确保你的手机已正确接入网络', null);
        } else cb(error, null);
      }else{
        cb(error, null);
      }
    });
}

export function doPromisedRequest(path, options, reqSpec) {
  options.body = JSON.stringify(options.body);
  return new Promise((resovle, reject)=>{
    fetch(path, options)
      .then((response)=> {
        if (!reqSpec.hasReply) {
          return '';
        } else {
          return parseJSON(response);
        }
      })
      .then(function (reply) {
        resovle(reply);
      })
      .catch(function (err) {
        if (err.message == 'Unexpected end of JSON input') {
          err.message = 'no result to be returned';
          reject(err);
        } else if (err.message && err.message.indexOf('Type error') != -1) {
          reject('应用程序没有使用无线网络的权限，请去设置里重新授权', null);
        } else reject(err);
      });
  });
}
