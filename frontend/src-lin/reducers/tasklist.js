//初始化state  结构
function getInitialState() {
  return {
    //今日跟进数量
    followCount:0, 
    // 今日接待数量
    receptionCount:0,
    // 今日跟进数据结构
    levelData:{
      hLevel:{
        header: 'H级意向客户 0人', 
        personCount:0, 
        tagDetail:{
          tag1:{header: '离店跟进（0人待跟进）', items: [], startIdx:0},
          tag2:{header: '首次跟进（0人待跟进）', items: [], startIdx:0},
          tag3:{header: '二次跟进（0人待跟进）', items: [], startIdx:0},
          tag4:{header: '后续跟进（0人待跟进）', items: [], startIdx:0},
        }
      },
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
    // 今日接待数据结构
    todayReceptionData:{
      invited: {header: '成功邀约未到店 0人', personCount: 0, tagDetail: {tag1: {items: [], startIdx:0}}},
      received: {header: '已接待客户 0人', personCount: 0, tagDetail: {tag1: {items: [], startIdx:0}}}
    }
  };
}
  // 定义级别  
const journeyName_levelKey= {
  'H级意向客户': 'hLevel', 'A级意向客户': 'aLevel', 'B级意向客户': 'bLevel', 'C级意向客户': 'cLevel',
  'N级意向客户': 'nLevel', 'O级意向客户': 'oLevel',
};
// 定义tag
const taskName_tagKey = {'离店回访': 'tag1', '首次跟进': 'tag2', '二次跟进': 'tag3', '后续跟进': 'tag4'};

//明日提醒
const journeyName_tagKey= {
  'H级意向客户': 'tag1', 'A级意向客户': 'tag2', 'B级意向客户': 'tag3', 'C级意向客户': 'tag4',
  'N级意向客户': 'tag5', 'O级意向客户': 'tag6'
};
  
  export default (state = getInitialState(), action) => {
    var {type, payload} = action;
    var followCount =0,receptionCount=0;
    var newState = getInitialState();
    var {levelData,todayReceptionData} = newState;
    switch(type){
      case 'GET_LISTTASKS':
      // reducer 对获取的数据进行处理
      payload.forEach(val => {
        var {journeyName, taskName, tasksDetails,companyId,journeyId,nodeId} = val;
        if(!tasksDetails) tasksDetails = [];
        var len = tasksDetails.length;
        
        //levelKey 是levelData  todayReceptionData 属性
        // tagKey 是 journeyName_tagKey[journeyName]
        // tagDetailHeaderPrefix 表示二级
        // levelDetailHeaderPrefix 表示一级
        var levelKey, tagKey, levelDetailHeaderPrefix, tagDetailHeaderPrefix, targetObj, setToReception = false, _timeLabel, _keyOfTimeVal;
        if(taskName == '明日到店提醒'){
          // conventionWalkInDateStart 进行匹配
          levelKey = 'tomorrow', targetObj = levelData,tagKey = journeyName_tagKey[journeyName],levelDetailHeaderPrefix=taskName, _timeLabel = '下次预约时间',_keyOfTimeVal='conventionWalkInDateStart',
          tagDetailHeaderPrefix = journeyName;
          // console.log(tagDetailHeaderPrefix)
        }else if(taskName == '成功邀约未到店'){ // 今日接待
          levelKey = 'invited', targetObj = todayReceptionData, tagDetailHeaderPrefix='成功邀约未到店', setToReception = true, _timeLabel = '预约到店时间',_keyOfTimeVal='conventionWalkInDateStart';
          levelDetailHeaderPrefix = taskName;;
        }else if(taskName == '已接待客户'){ // 今日接待
          levelKey = 'received', targetObj = todayReceptionData, tagDetailHeaderPrefix='已接待客户', setToReception = true, _timeLabel = '到店时间',_keyOfTimeVal='walkInDate';
          levelDetailHeaderPrefix = taskName;
        }else{
          levelKey = journeyName_levelKey[journeyName], tagKey = taskName_tagKey[taskName], _timeLabel = '下次预约时间',_keyOfTimeVal='conventionWalkInDateStart';
          levelDetailHeaderPrefix = journeyName, tagDetailHeaderPrefix = taskName, targetObj = levelData;
          // console.log(targetObj)
        }
        var levelDetail = targetObj[levelKey];
        //  返回tasksDetails 数组的长度
        if(len>0){
          // 根据长度 更改 personCount 长度
          var personCount = levelDetail.personCount + len; // tagDetail的length
          levelDetail.personCount += len;
          levelDetail.header = levelDetailHeaderPrefix + ' ' + personCount + '人';
        }

        // console.log(tasksDetails)
        // 今日接待
        if(setToReception){
          // 今日接待
          levelDetail.tagDetail.tag1.items = levelDetail.tagDetail.tag1.items.concat(tasksDetails);
          levelDetail.tagDetail.tag1.startIdx = 0;
          receptionCount += tasksDetails.length;
        }else{
          // 今日跟进
          var tagItem = levelDetail.tagDetail[tagKey];
          tagItem.header = tagDetailHeaderPrefix + '（' + len + '人待回访）';
          tagItem.items = tasksDetails;
          tagItem.startIdx = 0;
          followCount += tasksDetails.length;
        }
      });
        return {...newState,followCount,receptionCount};
      default:
        return state;
    }
  }