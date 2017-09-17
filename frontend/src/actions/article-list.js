/**
 * Created by zhongzhengkai on 2017/6/13.
 */

import * as api from '../base/api';
import {GET_CAR_GROUPS, GET_ARTICLE_TYPES, SEARCH_ARTICLE_LIST,GET_ARTICLE_DETAIL} from '../constants/action-name';
import {getIP} from '../base/common-func';

export const getCarGroups = ()=> {
  return dispatch=> {
    api.getCarGroups(carGroups=> {
      dispatch({type: GET_CAR_GROUPS, payload: carGroups})
    });
  }
};

export const getArticleType = ()=> {
  return dispatch=> {
    api.getArticleType(articleTypes=> {
      dispatch({type: GET_ARTICLE_TYPES, payload: articleTypes})
    });
  }
};

export const searchArticleList = (searchParams, isAppend=false)=>{
  // searchParams = {"search":{"dealerCode":"33251","words":"","source":[],"categoryId":1,"carGroups":[3],"recommendedOnly":false,"dealerSubscribe":true,"dealerWords":"","status":["PUBLISHED"],"terminals":["DCCM"],"enabledOnly":true},"page":{"size":10,"page":1,"sorts":[]}}
  return dispatch=> {
    api.searchArticleList(searchParams, searchResult=> {
      dispatch({type: SEARCH_ARTICLE_LIST, payload: {searchResult,isAppend}})
    },dispatch);
  }
};

export const getArticleDetail = (articleId)=>{
  return dispatch=> {
    api.getArticleDetail(articleId, result=> {
      dispatch({type: GET_ARTICLE_DETAIL, payload: result})
    },dispatch);
  }
};

export const addShareCount = (contentId, contentSource, userId, dealerId)=> {
  var postData = {contentId, contentSource, userId, dealerId, action: 'share', userAgent: navigator.userAgent};
  return dispatch=> {
    getIP(ip=> {
      postData.ip = ip;
      api.addShareCount(postData, result=> {

      });
    });
  }
};


