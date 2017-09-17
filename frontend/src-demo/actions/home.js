/**
 * Created by zhongzhengkai on 2017/6/14.
 */
import * as api from '../base/api';

export const getBooks = ()=>{
  return dispatch =>{
    api.getBooks((books)=>{
      dispatch({type:'GET_BOOKS',payload:books});
    },dispatch)
  }
};

// export const getBooks = ()=> {
//   return dispatch=>dispatch({type: 'GET_BOOKS', payload: [{name:1,age:222}]});
// };