/**
 * Created by zhongzhengkai on 2017/5/10.
 */
import {GET_TODAY_TASK_NUM, GET_TODAY_RECOMMEND_CONTENT} from '../constants/action-name';

function getInitialState() {
  return {
    "followTasksNum": 0,// 首页 跟进任务数量
    "receptionTasksNum": 0,//首页 接待任务数量
    "contentMarketingOppNum": 0,//首页 内容营销线索数量
    "reservedInfoNum": 0,//内容营销 客户留资数
    "shareArticleNum": 0,//内容营销 分享文章数
    "vcarDexposureNum": 0,//内容营销 名片曝光量
    "reservedInfoNoProcessNum": 0,//内容营销—小图标 今日留资未处理数量
    "articles": []
  };
}

export default (state = getInitialState(), action) => {
  var {type, payload} = action;
  switch(type){
    case GET_TODAY_TASK_NUM:
      return {...state, ...payload};
    case GET_TODAY_RECOMMEND_CONTENT:
      return {...state, articles:payload};
    default:
      return state;
  }
}
