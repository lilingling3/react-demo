/**
 * Created by zhongzhengkai on 2017/5/10.
 */

import {GET_BASE_DATA_VERSION} from '../constants/action-name';

function getInitialState() {
  return {
    page1:{
      a:1,
      b:2
    }
  };
}

export default (state = getInitialState(), action) => {
  var {type, payload} = action;
  switch(type){
    case 'SOME_ACTION':
      return {...state};
    default:
      return state;
  }
}
