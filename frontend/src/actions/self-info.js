/**
 * Created by lizz on 2017/6/20.
 */

import * as api from '../base/api';
import * as cf from '../base/common-func';

export const getAndroidLastedVersionInfo = () => {
  return dispatch => {
    api.getAndroidLastedVersionInfo(data => {
      dispatch({type: 'GET_ANDROID_LASTED_VERSION_INFO', payload: data});
    });
  }
};

//从appstore获取app信息
export const getIosLastedVersionInfo = () => {
  return dispatch => {
    api.getIosLastedVersionInfo(data => {
      dispatch({type: 'GET_IOS_LASTED_VERSION_INFO', payload: data});
    });
  }
};

//获取ios版本更新的数据库信息
export const getIosLastedVersionDBInfo = () => {
  return dispatch => {
    api.getIosLastedVersionInfo(data => {
      dispatch({type: 'GET_IOS_LASTED_VERSION_INFO', payload: data});
    });
  }
};

export const setDispatch = ()=>{
  return dispatch =>{
    cf.setDispatch(dispatch);
  }
};

