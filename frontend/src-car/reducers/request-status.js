/**
 * Created by zhongzhengkai on 2017/2/22.
 */

import {REQUEST_START,REQUEST_END} from '../constants/net-status';
import {SHOW_LOADING,HIDE_LOADING} from '../constants/action-name';


function getInitialState() {
  return {
    requestStatus: REQUEST_END,
    lastAction:'',
    path:'/login'
  };
}

export default (state = getInitialState(), action) => {
  var payload = action.payload;
  var actionType = action.type;
  state.lastAction = actionType;

  switch (actionType) {
    case 'CHANGE_PATH':
      return {...state, path: payload.path, lastPath: state.path};
    case 'LOGIN_SUCCESS':
      return {...state, path:'/home', lastPath: state.path};
    case SHOW_LOADING:
      return {...state, requestStatus: REQUEST_START};
    case HIDE_LOADING:
      return {...state, requestStatus: REQUEST_END};
    default:
      return state;
  }
}