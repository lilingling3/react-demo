/**
 * Created by zhongzhengkai on 2017/6/14.
 */
import * as api from '../base/api';

export const setUploadResult = (response)=>{
  return dispatch =>{
    dispatch({type:'UPLOAD_RESULT',payload:{response}});
  }
};

export const showUploadLoading = ()=>{
  return dispatch =>{
    dispatch({type: 'SHOW_LOADING'});
  }
};

export const hideUploadLoading = ()=>{
  return dispatch =>{
    dispatch({type: 'HIDE_LOADING'});
  }
};

