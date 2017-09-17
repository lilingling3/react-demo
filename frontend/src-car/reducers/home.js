/**
 * Created by zhongzhengkai on 2017/5/10.
 */


function getInitialState() {
  return {
    books:[]
  };
}

export default (state = getInitialState(), action) => {
  var {type, payload} = action;
  switch(type){
    case 'GET_BOOKS':
      return {...state, books:payload};
    default:
      return state;
  }
}
