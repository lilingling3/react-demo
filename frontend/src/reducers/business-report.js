/**
 * Created by guohuiru on 2017/5/15.
 */

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
