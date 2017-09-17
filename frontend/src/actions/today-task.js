/**
 * Created by zhongzhengkai on 2017/5/16.
 */
import * as api from '../base/api';
import {
  GET_TODAY_TASKS, GET_TODAY_TASKS_TALK_LIB, SEND_COMMUNICATION_HISTORY, TODAY_TASKS_PREV_PAGE, TODAY_TASKS_NEXT_PAGE
} from '../constants/action-name';

export const getTodayTask = (userId)=>{
  return dispatch =>{
    api.getTodayTask(userId,(tasks)=>{
      dispatch({type:GET_TODAY_TASKS,payload:tasks});
    },dispatch);
  }
};

export const getTodayTaskTalkLib = ()=>{
  return dispatch =>{
    api.getTalkLib((tasks)=>{
      dispatch({type:GET_TODAY_TASKS_TALK_LIB,payload:tasks});
    },dispatch);
  }
};

export const nextPage = (page, level, tag)=>{
  return {type:TODAY_TASKS_NEXT_PAGE,payload:{page, level, tag}};
};

export const prevPage = (page, level, tag)=> {
  return {type: TODAY_TASKS_PREV_PAGE, payload: {page, level, tag}};
};



