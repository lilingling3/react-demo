/**
 * Created by zhongzhengkai on 2017/5/10.
 */

function getInitialState() {
  return {
    result:{},
    getResult:false
  };
}

export default (state = getInitialState(), action) => {
  var {type, payload} = action;
  switch(type){
    case 'CHANGE_PASSWORD':
      state.getResult = true;
      return {...state, result:payload};
    default:
      return state;
  }
}
