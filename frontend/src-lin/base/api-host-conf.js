/**
 * Created by zhongzhengkai on 2017/3/30.
 */

var defaultHostKey = 'testHost';
if(__APP_ENV__=='prod')defaultHostKey='prodHost';

const apiHost = {
  testHost:'localhost:3222',
  prodHost:'localhost:3222',
  hostKey:defaultHostKey
};

export const changeApiHost = ()=>{
  apiHost.hostKey = apiHost.hostKey == 'testHost' ? 'prodHost':'testHost';
};

export const getApiHost = ()=>{
  return apiHost[apiHost.hostKey];
};

export const getApiHostKey = ()=>{
  return apiHost.hostKey;
};