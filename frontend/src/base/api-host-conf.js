/**
 * Created by zhongzhengkai on 2017/3/30.
 * 大家注意一点，默认连接的是生产服务器，如果想连接测试服务器，请点击左上角切换
 */

import {LS_API_HOST_KEY} from '../constants';

var defaultHostKey = 'prod';
// var defaultHostKey = 'test';
// var defaultHostKey = __APP_ENV__;
// if(__APP_ENV__=='prod')defaultHostKey='prod';

// if(localStorage.getItem(LS_API_HOST_KEY)) defaultHostKey = localStorage.getItem(LS_API_HOST_KEY);

const apiHost = {
  prod:'https://dccmapi.boldseas.com',
  test:'https://dccmtest.boldseas.com',
  dev:'https://dccmtest.boldseas.com',
  hostKey:defaultHostKey
};

const key_nextKey = {dev: 'test', test: 'prod', prod: 'dev'};

export const changeApiHost = ()=> {
  var key = key_nextKey[apiHost.hostKey];
  localStorage.setItem(LS_API_HOST_KEY, key);
  apiHost.hostKey = key;
};

export const getApiHost = ()=> {
  return apiHost[apiHost.hostKey];
};

export const getApiHostKey = ()=>{
  return apiHost.hostKey;
};







