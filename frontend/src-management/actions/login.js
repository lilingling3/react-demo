/**
 * Created by zhongzhengkai on 2017/6/14.
 */
import * as api from '../base/api';


export const login = (param)=>{
  return dispatch =>{
    api.login(param,(loginResult)=>{
      dispatch({type:'LOGIN',payload:loginResult});
    },dispatch)
  }
};

export const forgetPassword = (account,cb)=>{
  return dispatch =>{
    api.forgetPassword(account,(result)=>{
      dispatch({type:'FORGET_PASSWORD',payload:result});
      cb();
    },dispatch)
  }
};
