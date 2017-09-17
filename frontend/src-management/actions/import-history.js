/**
 * Created by zhongzhengkai on 2017/6/14.
 */
import * as api from '../base/api';

export const getHistory = (param)=>{
  return dispatch =>{
    api.getHistory(param,(history)=>{
      dispatch({type:'GET_HISTORY',payload:history});
    },dispatch)
  }
};

export const downloadHistory = (logId,type)=>{
  return dispatch =>{
    api.downloadHistory(logId,type,()=>{
      dispatch({type:'DOWNLOAD',payload:{}});
    },dispatch)
  }
}

