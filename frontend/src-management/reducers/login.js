/**
 * Created by zhongzhengkai on 2017/5/10.
 */

function getInitialState() {
  return {
    forgetPassword:{
    }
  };
}

export default (state = getInitialState(), action) => {
  var {type, payload} = action;
  switch(type){
    case 'FORGET_PASSWORD':
      return {...state, forgetPassword:payload};
    default:
      return state;
  }
}
