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

function parseJSON(response) {
  //checkStatus(response);
  return response.json();
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
    .then((response)=> parseJSON(response))
    .then(function (reply) {
      cb(null, reply);
    })
    .catch(function (error) {
      if (error.message == 'Unexpected end of JSON input') {
        if(!reqSpec.hasReply)cb(null, '');
        else{
          console.log('%c'+error.message,'color:red');
          error.message = 'no result to be returned';
          cb(error, null);
        }
      } else cb(error, null);
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
        } reject(err);
      });
  });
}
