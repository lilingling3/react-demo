/**
 * Created by zhongzhengkai on 2017/5/15.
 */

import {GET_TODAY_TASKS, GET_TODAY_TASKS_TALK_LIB, TODAY_TASKS_PREV_PAGE, TODAY_TASKS_NEXT_PAGE} from '../constants/action-name';
import {getCommonState} from '../base/common-func';
import {TODAY_TASK_PAGE_SIZE} from '../constants';
const ONE_PAGE_SIZE = 100;

function getInitialState() {
  return {
    followUpCount:0,
    receptionCount:0,
    levelData:{
      hLevel:{header: 'H级意向客户 0人', personCount:0, tagDetail:{
        tag1:{header: '离店跟进（0人待跟进）', items: [], startIdx:0},
        tag2:{header: '首次跟进（0人待跟进）', items: [], startIdx:0},
        tag3:{header: '二次跟进（0人待跟进）', items: [], startIdx:0},
        tag4:{header: '后续跟进（0人待跟进）', items: [], startIdx:0},
      }},
      aLevel:{header: 'A级意向客户 0人',personCount:0, tagDetail:{
        tag1:{header: '离店跟进（0人待跟进）', items: [], startIdx:0},
        tag2:{header: '首次跟进（0人待跟进）', items: [], startIdx:0},
        tag3:{header: '二次跟进（0人待跟进）', items: [], startIdx:0},
        tag4:{header: '后续跟进（0人待跟进）', items: [], startIdx:0},
      }},
      bLevel:{header: 'B级意向客户 0人',personCount:0, tagDetail:{
        tag1:{header: '离店跟进（0人待跟进）', items: [], startIdx:0},
        tag2:{header: '首次跟进（0人待跟进）', items: [], startIdx:0},
        tag3:{header: '二次跟进（0人待跟进）', items: [], startIdx:0},
        tag4:{header: '后续跟进（0人待跟进）', items: [], startIdx:0},
      }},
      cLevel:{header: 'C级意向客户 0人',personCount:0, tagDetail:{
        tag1:{header: '离店跟进（0人待跟进）', items: [], startIdx:0},
        tag2:{header: '首次跟进（0人待跟进）', items: [], startIdx:0},
        tag3:{header: '二次跟进（0人待跟进）', items: [], startIdx:0},
        tag4:{header: '后续跟进（0人待跟进）', items: [], startIdx:0},
      }},
      nLevel:{header: 'N级意向客户 0人',personCount:0, tagDetail:{
        tag1:{header: '离店跟进（0人待跟进）', items: [], startIdx:0},
        tag2:{header: '首次跟进（0人待跟进）', items: [], startIdx:0},
        tag3:{header: '二次跟进（0人待跟进）', items: [], startIdx:0},
        tag4:{header: '后续跟进（0人待跟进）', items: [], startIdx:0},
      }},
      oLevel:{header: 'O级意向客户 0人',personCount:0, tagDetail:{
        tag1:{header: '离店跟进（0人待跟进）', items: [], startIdx:0},
        tag2:{header: '首次跟进（0人待跟进）', items: [], startIdx:0},
        tag3:{header: '二次跟进（0人待跟进）', items: [], startIdx:0},
        tag4:{header: '后续跟进（0人待跟进）', items: [], startIdx:0},
      }},
      tomorrow:{header: '明日到店提醒 0人',personCount:0, tagDetail:{
        tag1:{header: 'H级意向客户（0人待跟进）', items: [], startIdx:0},
        tag2:{header: 'A级意向客户（0人待跟进）', items: [], startIdx:0},
        tag3:{header: 'B级意向客户（0人待跟进）', items: [], startIdx:0},
        tag4:{header: 'C级意向客户（0人待跟进）', items: [], startIdx:0},
        tag5:{header: 'N级意向客户（0人待跟进）', items: [], startIdx:0},
        tag6:{header: 'O级意向客户（0人待跟进）', items: [], startIdx:0}
      }}
    },
    todayReception:{
      invited: {header: '成功邀约未到店 0人', personCount: 0, tagDetail: {tag1: {items: [], startIdx:0}}},
      received: {header: '已接待客户 0人', personCount: 0, tagDetail: {tag1: {items: [], startIdx:0}}}
    },
    justReceiveTalkLibs: false,
    talkLibItems:[],
    talkLibItemsOfType3:[],
    talkLibItemsOfType1:[]
  };
}

const journeyName_levelKey_ = {
  'H级意向客户': 'hLevel', 'A级意向客户': 'aLevel', 'B级意向客户': 'bLevel', 'C级意向客户': 'cLevel',
  'N级意向客户': 'nLevel', 'O级意向客户': 'oLevel',
};
const taskName_tagKey = {'离店回访': 'tag1', '首次跟进': 'tag2', '二次跟进': 'tag3', '后续跟进': 'tag4'};

//为明日到店提醒所用
const journeyName_tagKey_ = {
  'H级意向客户': 'tag1', 'A级意向客户': 'tag2', 'B级意向客户': 'tag3', 'C级意向客户': 'tag4',
  'N级意向客户': 'tag5', 'O级意向客户': 'tag6'
};

export default (state = getInitialState(), action) => {
  var {type, payload} = action;
  state.justReceiveTalkLibs = false;
  switch(type){
    case GET_TODAY_TASKS:
      var {channel,product} = getCommonState()._dictDataMap;
      var newState = getInitialState();
      var {levelData,todayReception} = newState;

      // ['hLevel', 'aLevel', 'bLevel', 'cLevel', 'nLevel', 'oLevel', 'tomorrow'].forEach(key=>levelData[key].personCount = 0);
      var followUpCount = 0;
      var receptionCount = 0;

      payload.forEach(val=>{
        var {journeyName, taskName, tasksDetails,companyId,journeyId,nodeId} = val;
        if (!tasksDetails) tasksDetails = [];
        var len = tasksDetails.length;

        var levelKey, tagKey, levelDetailHeaderPrefix, tagDetailHeaderPrefix, targetObj, setToReception = false, _timeLabel, _keyOfTimeVal;

        if (taskName == '明日到店提醒') {
          levelKey = 'tomorrow', tagKey = journeyName_tagKey_[journeyName], levelDetailHeaderPrefix = taskName, _timeLabel = '下次预约时间',_keyOfTimeVal='conventionWalkInDateStart';
          tagDetailHeaderPrefix = journeyName, targetObj = levelData;
        } else if(taskName == '成功邀约未到店'){//归属到今日接待标签下
          levelKey = 'invited', targetObj = todayReception, tagDetailHeaderPrefix='成功邀约未到店', setToReception = true, _timeLabel = '预约到店时间',_keyOfTimeVal='conventionWalkInDateStart';
          levelDetailHeaderPrefix = taskName;
        } else if(taskName == '已接待客户'){//归属到今日接待标签下
          levelKey = 'received', targetObj = todayReception, tagDetailHeaderPrefix='已接待客户', setToReception = true, _timeLabel = '到店时间',_keyOfTimeVal='walkInDate';
          levelDetailHeaderPrefix = taskName;
        } else{
          levelKey = journeyName_levelKey_[journeyName], tagKey = taskName_tagKey[taskName], _timeLabel = '下次预约时间',_keyOfTimeVal='conventionWalkInDateStart';
          levelDetailHeaderPrefix = journeyName, tagDetailHeaderPrefix = taskName, targetObj = levelData;
        }

        var levelDetail = targetObj[levelKey];
        if(len>0){
          var personCount = levelDetail.personCount + len;
          levelDetail.personCount = personCount;
          levelDetail.header = levelDetailHeaderPrefix + ' ' + personCount + '人';
        }

        // console.log(tagKey,journeyName,taskName,levelDetail.tagDetail,val)
        tasksDetails.forEach(val=> {
          val.channelId_Label = channel[val.channelId] ? channel[val.channelId].nameCn : val.channelId;
          val.dealerUserId_Label = '等待确认?';
          val.modelId_Label = product[val.modelId] ? product[val.modelId].nameCn : val.modelId;
          val._timeLabel = _timeLabel;
          val._timeVal = val[_keyOfTimeVal];
          val.companyId = companyId;
          val.journeyId = journeyId;
          val.nodeId = nodeId;
        });

        if(setToReception){//放置到"今日接待"标签下
          //!!! 这里必须用concat，和今日跟进的处理不一样
          levelDetail.tagDetail.tag1.items = levelDetail.tagDetail.tag1.items.concat(tasksDetails);
          levelDetail.tagDetail.tag1.startIdx = 0;
          receptionCount += tasksDetails.length;
        }else{
          var tagItem = levelDetail.tagDetail[tagKey];
          tagItem.header = tagDetailHeaderPrefix + '（' + len + '人待回访）';
          tagItem.items = tasksDetails;
          tagItem.startIdx = 0;
          followUpCount += tasksDetails.length;
        }
      });

      return {...newState,followUpCount,receptionCount};
    case GET_TODAY_TASKS_TALK_LIB:
      var product = getCommonState()._dictDataMap.product;

      /*
       talkLibraryType:1 (短信面板)*** 产品力
       talkLibraryType:2 (外呼面板) 离店回访，日常跟进，活动邀请
       talkLibraryType:3 (短信面板)请选择沟通话术
       */

      var description_item_ = {},description_item_t3 = {},description_item_t1 = {};
      payload.forEach(val=>{
        var {talkLibraryType, description, modelID, title, content} = val;
        if (talkLibraryType == 2) {//!!! optimize，后端只给talkLibraryType为2的数据就可以了
          var item = description_item_[description];
          if(!item) item = description_item_[description] = {tipCaption:description,modelId_tipContent_:{}};
          var modelId_tipContent_ = item.modelId_tipContent_;
          modelId_tipContent_[modelID] = content;
        }else if(talkLibraryType == 1){// (短信面板) *** 产品力
          var item = description_item_t1[description];
          if(!item) item = description_item_t1[description] = {tipCaption:description,modelId_tips_:{}};

          var groupModel = modelID;
          var productData = product[modelID];
          if (productData) {
            if (productData.groupModel)groupModel = productData.groupModel;
            else if (product[productData.parentId].groupModel)groupModel = product[productData.parentId].groupModel;
          }//modelId 可能指向groupModel

          var tips = item.modelId_tips_[groupModel];
          if(!tips) tips = item.modelId_tips_[groupModel] = [];
          tips.push({title,content});
        }else if(talkLibraryType == 3){// (短信面板) 请选择沟通话术
          var item = description_item_t3[description];
          if(!item) item = description_item_t3[description] = {tipCaption:description,modelId_tips_:{}};

          var groupModel = modelID;
          var productData = product[modelID];
          if (productData) {
            if (productData.groupModel)groupModel = productData.groupModel;
            else if (product[productData.parentId].groupModel)groupModel = product[productData.parentId].groupModel;
          }//modelId 可能指向groupModel

          var tips = item.modelId_tips_[modelID];
          if(!tips) tips = item.modelId_tips_[groupModel] = [];
          tips.push({title,content});
        }
      });

      var talkLibItems = Object.keys(description_item_).map(val=> description_item_[val]);
      var talkLibItemsOfType3 = Object.keys(description_item_t3).map(val=> description_item_t3[val]);
      var talkLibItemsOfType1 = Object.keys(description_item_t1).map(val=> description_item_t1[val]);
      return {...state, talkLibItems, talkLibItemsOfType3, talkLibItemsOfType1, justReceiveTalkLibs: true};
    case TODAY_TASKS_PREV_PAGE:
      var {page, level, tag} = payload;
      var tagData;
      if (page == 'followUp') {
        tagData = state.levelData[level].tagDetail[tag];
      }else{
        tagData = state.todayReception[level].tagDetail.tag1;
      }
      tagData.startIdx = tagData.startIdx - TODAY_TASK_PAGE_SIZE;
      if(tagData.startIdx < 0 ) tagData.startIdx = 0;
      return {...state};
    case TODAY_TASKS_NEXT_PAGE:
      var {page, level, tag} = payload;
      var tagData;
      if (page == 'followUp') {
        tagData = state.levelData[level].tagDetail[tag];
      }else{
        tagData = state.todayReception[level].tagDetail.tag1;
      }
      tagData.startIdx = tagData.startIdx + TODAY_TASK_PAGE_SIZE;
      return {...state};
    default:
      return state;
  }
}
