/**
 * Created by zhongzhengkai on 2017/5/10.
 */

import {GET_CAR_GROUPS, GET_ARTICLE_TYPES, SEARCH_ARTICLE_LIST,GET_ARTICLE_DETAIL} from '../constants/action-name';

function getInitialState() {
  return {
    searchResult:{page:0, size:0, result:[], total:0},
    brandList: [{label: '无', value: '无'}],
    brandValue_label_: {'品牌车系': '品牌车系'},
    articleTypeList: [{label: '无', value: '无'}],
    articleTypeValue_label_: {'文章类型': '文章类型'},
    articleDetail: {
      contentId: '',
      dealerUserId: '',
      title: '',
      content: '',
      publishDate: '',
    }
  };
}

/** carGroups:
 [
 {
   "id": "3",
   "groupName": "全新Jeep自由侠",
   "seriesImg": "http://cdn.boldseas.com/image/shop/dev/pc/dp/Bsuv_car.png",
   "slogan": "专业家庭SUV",
   "caption": "全新Jeep自由侠，新车预订",
   "parent": null
 }
 ]
 */

export default (state = getInitialState(), action) => {
  var {type, payload} = action;
  switch(type){
    case GET_CAR_GROUPS:
      var brandValue_label_ = state.brandValue_label_;
      var brandList = [{label:'无',value:'无'}];
      payload.forEach(val=>{
        brandList.push({label: val.groupName, value: val.id});
        brandValue_label_[val.id] = val.groupName;
      });
      return {...state, brandList};
    case GET_ARTICLE_TYPES:
      var articleTypeList = [{label:'无',value:'无'}];
      var articleTypeValue_label_ = state.articleTypeValue_label_;
      payload.forEach(val=>{
        articleTypeList.push({label:val.name, value:val.id});
        articleTypeValue_label_[val.id] = val.name;
      });
      return {...state, articleTypeList};
    case GET_ARTICLE_DETAIL:
      return {...state, articleDetail:payload};
    case SEARCH_ARTICLE_LIST:
      var {isAppend, searchResult} = payload;
      if(isAppend){
        state.searchResult.result = state.searchResult.result.concat(searchResult.result);
        return {...state};
      }else{
        return {...state, searchResult};
      }
    default:
      return state;
  }
}
