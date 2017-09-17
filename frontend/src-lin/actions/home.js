/**
 * Created by zhongzhengkai on 2017/6/14.
 * 
 */
import * as api from '../base/api';

export const getBooks = ()=>{
  return dispatch =>{
    api.getBooks((books)=>{
      console.log(books)
      // dspatch 一个action 更改store 里面的 state
      dispatch({type:'GET_BOOKS',payload:books});   //dispatch 跟reducer中定义的type保持一致
    },dispatch)
  }
};

// export const getBooks = ()=> {
//   return {type: 'GET_BOOKS', payload: [{name:1,age:222}]};
// };

export const changeColor = ()=> {
  return {type: 'CHANGE_COLOR', payload:'yellow'};
};

export const getListTasks = () =>{
  return dispatch => {
      api.testListTasks((listTasks)=>{
          dispatch({type:'GET_LISTTASKS',payload:listTasks})
      },dispatch)
  }
}