/**
 * Created by zhongzhengkai on 2017/5/10.
 */

import {GET_BASE_DATA_VERSION} from '../constants/action-name';

function getInitialState() {
  return {
    books:[]
  };
}

export default (state = getInitialState(), action) => {
  var {type, payload} = action;
  switch(type){
    case 'SOME':
      return {...state};
    default:
      return state;
  }
}
