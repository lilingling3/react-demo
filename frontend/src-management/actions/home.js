/**
 * Created by zhongzhengkai on 2017/6/14.
 */
import * as api from '../base/api';
import {
  getIP
} from '../base/common-func';
import 'babel-polyfill';

export const getData = (dealerId)=> {
  return dispatch => {
    api.getStaff(dealerId,(staff)=> {
      api.getRoles((roles)=> {
          dispatch({type: 'GET_DATA', payload: {staff ,roles}});
        },
        dispatch)
    }, dispatch)
  }
}

export const operate = (param) => {
  var p = param;
  return dispatch => {
    getIP((ip)=>{
      p.ip = ip;
      api.operate(param,(result)=> {
        dispatch({type:'GET_OPERATE_RESULT',payload:{result}});
      }, dispatch)
    })
  }
}

export const getBooks = ()=> {
  return dispatch => {
    api.getBooks((books)=> {
      dispatch({type: 'GET_BOOKS', payload: books});
    }, dispatch)
  }
};

export const testPost = ()=> {
  return dispatch => {
    api.testPost((books)=> {
      dispatch({type: 'GET_BOOKS', payload: books});
    }, dispatch)
  }
};

export const getInfo = ()=> {
  return dispatch => {
    api.getInfo((result)=> {
      dispatch({type: 'GET_INFO', payload: result});
    }, dispatch)
  }
};

// export const getBooks = ()=> {
//   return dispatch=>dispatch({type: 'GET_BOOKS', payload: [{name:1,age:222}]});
// };