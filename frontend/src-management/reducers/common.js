/**
 * Created by zhongzhengkai on 2017/5/10.
 */

function getInitialState() {
  return {
    login:{},
    clickLogin:false
  };
}

export default (state = getInitialState(), action) => {
  var {type, payload} = action;
  switch(type){
    case 'LOGIN':
      state.login = payload;
      state.clickLogin = true;
      return {...state};
    default:
      return state;
  }
}
