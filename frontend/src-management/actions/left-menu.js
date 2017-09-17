/**
 * Created by zhongzhengkai on 2017/6/14.
 */
import * as api from '../base/api';


export const logout = ()=>{
  return dispatch =>{
    api.logout((logoutResult)=>{
      dispatch({type:'LOGOUT',payload:logoutResult});
    },dispatch)
  }
};

