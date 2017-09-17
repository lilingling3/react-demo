/**
 * Created by lizz on 2017/6/6.
 */
import * as api from '../base/api';

export const giveUpContentLeads = (leadsId,state) => {
  var postData = {
    "id": leadsId,
    "reservedStatus": state //"3"
  };
  return dispatch => {
    api.giveUpContentLeads(postData, (data) => {
      dispatch({type: 'GIVE_UP_CONTENT_LEADS', payload: postData});
    }, dispatch);
  }
};

export const getContentLeadsListByPost = (mobilePhoneLike, isHasFollowUp, dealerSetData) => {
  var statusStr = '1';
  var postData;
  if (isHasFollowUp == 0) {
    postData = {
      "mobilePhoneLike": mobilePhoneLike,
      "reservedStatusEquals": '1',
      "orderBys": {
        "createdDate":"DESC"
      }
    };
  } else {
    postData = {
      "mobilePhoneLike": mobilePhoneLike,
      "reservedStatusIn": ["2", "3", "4"],
      "orderBys": {
        "createdDate":"DESC"
      }
    };
  }
  return dispatch => {
    api.getContentLeadsListByPost(postData, (data) => {
      if (isHasFollowUp == 0) {
        dispatch({type: 'GET_UNFOLLOW_CONTENT_LEADS_LIST', payload: data});
      } else {
        dispatch({type: 'GET_FOLLOWED_CONTENT_LEADS_LIST', payload: data});
      }
    }, dispatch);
  }
};
