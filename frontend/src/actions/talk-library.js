/**
 * Created by zhongzhengkai on 2017/5/26.
 */

import * as api from '../base/api';
import {GET_TALK_LIB} from '../constants/action-name';

export const getTalkLib = ()=>{
  return dispatch =>{
    api.getTalkLib((tasks)=>{
      dispatch({type:GET_TALK_LIB,payload:tasks});
    },dispatch);
  }
};