/**
 * Created by zhongzhengkai on 2017/5/10.
 */

import * as api from '../base/api';
import {GET_TODAY_TASK_NUM, GET_TODAY_RECOMMEND_CONTENT} from '../constants/action-name';

export const listBooks = ()=>{
  return dispatch =>{
    api.listBooks((books)=>{
      dispatch({type:'LIST_BOOKS',payload:books});
    },dispatch)
  }
};

export const listBooks2 = ()=>{
  return dispatch =>{
    api.listBooks2((books)=>{
      dispatch({type:'LIST_BOOKS',payload:books});
    },dispatch)
  }
};

export const getTodayTaskNum = (userId)=>{
  return dispatch =>{
    api.getTodayTaskNum(userId,(reply)=>{
      dispatch({type:GET_TODAY_TASK_NUM,payload:reply});
    },dispatch)
  }
};

export const getTodayRecommendContent = ()=>{
  return dispatch =>{
    api.getTodayRecommendContent((articles)=>{
      dispatch({type:GET_TODAY_RECOMMEND_CONTENT,payload:articles});
    },dispatch)
  }
};