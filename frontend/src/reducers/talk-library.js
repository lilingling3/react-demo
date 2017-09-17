/**
 * Created by zhongzhengkai on 2017/5/27.
 */
import {GET_TALK_LIB} from '../constants/action-name';
import {getCommonState} from '../base/common-func';

function getInitialState() {
  return {
    DaQieNuoJiLib: {features: {}, talkWords: {}, messageText: {}},
    JeepFreeLightLib: {features: {}, talkWords: {}, messageText: {}},
    JeepFreeManLib: {features: {}, talkWords: {}, messageText: {}},
    JeepCompassLib: {features: {}, talkWords: {}, messageText: {}},
    commonLib: {talkWords: {}, messageText: {}}
  };
}

export default (state = getInitialState(), action) => {
  var {type, payload} = action;
  switch(type){
    case GET_TALK_LIB:
      var {DaQieNuoJiLib,JeepFreeLightLib,JeepFreeManLib,JeepCompassLib,commonLib} = getInitialState();//每次都用最新的state
      var productMap = getCommonState()._dictDataMap.product;
      payload.forEach(val=>{
        var {id, title, modelID, description, talkLibraryType, content} = val;

        //titleType: none | normal | expandable
        var targetLibs, targetCategory, titleType;
        if (modelID == 0) {
          targetLibs = commonLib;
          if (title)targetCategory = 'messageText', titleType = 'normal';//短信脚本
          else targetCategory = 'talkWords', titleType='none';//电话话术
          // if (talkLibraryType == 3)targetCategory = 'messageText', titleType = 'normal';//短信脚本
          // else targetCategory = 'talkWords', titleType='none';//电话话术
        } else {
          var product = productMap[modelID];
          if (product) {
            var nameCn = product.nameCn;
            if (nameCn.indexOf('大切诺基') != -1)targetLibs = DaQieNuoJiLib;
            else if (nameCn.indexOf('自由光') != -1)targetLibs = JeepFreeLightLib;
            else if (nameCn.indexOf('自由侠') != -1)targetLibs = JeepFreeManLib;
            else if (nameCn.indexOf('指南者') != -1)targetLibs = JeepCompassLib;

            /*
             talkLibraryType:1 产品卖点
             talkLibraryType:2 电话话术
             talkLibraryType:3 短信脚本
             */
            if (talkLibraryType == 1)targetCategory='features', titleType='expandable';
            else if (talkLibraryType == 2)targetCategory='talkWords', titleType='none';
            else if (talkLibraryType == 3)targetCategory='messageText', titleType='normal';
          }
        }

        if(targetLibs){
          if (targetCategory) {
            var tag = targetLibs[targetCategory][description];
            if (!tag)tag = targetLibs[targetCategory][description] = {description, items: []};
            tag.items.push({id, title, content, titleType, isContentHtml: targetCategory == 'talkWords'});
          } else console.log('%ctalkLibraryType,' + 'id:' + id + ',talkLibraryType:' + talkLibraryType, 'color:red');
        }else{
          console.log('%c无效的数据,'+'id:'+id+',modelID:'+modelID,'color:red');
        }
      });

      return {...state, DaQieNuoJiLib,JeepFreeLightLib,JeepFreeManLib,JeepCompassLib,commonLib};
    default:
      return state;
  }
}
