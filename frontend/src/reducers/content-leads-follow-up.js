/**
 * Created by lizz on 2017/6/6.
 */

function getInitialState() {
  return {
    UnFollow: [],
    HaveFollowed: [],
    contactDetail:{}
  };
}

export default (state = getInitialState(), action) => {
  var {type, payload}=action;
  var UnFollow, HaveFollowed;
  switch (type) {
    case 'GIVE_UP_CONTENT_LEADS':
      // var giveUpItem;
      state.UnFollow.map((item,index)=> {
        if (item.id == payload.id) {
          item.reservedStatus=payload.reservedStatus;
          // giveUpItem=item;
          state.UnFollow.splice(index,1);
        }
      });
      // state.HaveFollowed.unshift(giveUpItem);
      return {...state};
    case 'INSERT_CUSTOMER_INFO':
      if (!action.payload.message) 
        state.contactDetail = action.payload.contactDetail;
      return { ...state };
    case 'GET_UNFOLLOW_CONTENT_LEADS_LIST':
      UnFollow = payload;
      return {...state, UnFollow};
    case 'GET_FOLLOWED_CONTENT_LEADS_LIST':
      HaveFollowed = payload;
      return {...state, HaveFollowed};
    default:
      return state;
  }
}

