/**
 * Created by zhongzhengkai on 2017/6/14.
 */
import * as api from '../base/api';


export const changePassword = (param)=>{
  return dispatch =>{
    api.changePassword(param,(result)=>{
      dispatch({type:'CHANGE_PASSWORD',payload:result});
    },dispatch)
  }
};

