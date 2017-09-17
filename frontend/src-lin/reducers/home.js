/**
 * Created by zhongzhengkai on 2017/5/10.
 * 
 */

// 初始化state
function getInitialState() {
  return {
    books:[],
    bg:'red'
  }
}


export default (state = getInitialState(), action) => {
  var {type, payload} = action;
  switch(type){
    case 'GET_BOOKS':
      // var books = state.books;
      // books = books.concat(payload); 
      return {...state, books:payload};
    case 'CHANGE_COLOR':
      return {...state, bg:payload};
    default:
      return state;
  }
}

// homeReducer 包含state action 
