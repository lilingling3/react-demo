/**
 * Created by zhongzhengkai on 2017/5/10.
 */

import {
  GET_BASE_DATA_VERSION, GET_DICT_CHANNEL, GET_DICT_CUSTOMER_STATUS, GET_DICT_DEALER, GET_DICT_PRODUCT, GET_DICT_GEOGRAPHY,
  GET_DICT_DICTIONARY, GET_DICT_SYS_ROLE, GET_DICT_OPPORTUNITY_LEVEL, GET_DICT_PRODUCT_SKU, GET_DICT_DEALER_PRODUCT, GET_DICT_LICENSE_INFO
} from '../constants/action-name';
import {LS_DICT_DATA, LS_DICT_VERSION} from '../constants';
import {getCommonState} from '../base/common-func'
import {genDictDataMap} from './common';

function getInitialState() {
  return {
    needCheckStatus:false,
    checkStatusDone:false,
    getBaseDataDone:false,
    table_CheckStatus_:{},//标记各个表的检查状态
    updateTableStats : {
      channel:false,customer_status:false,dealer:false,product:false,geography:false,dictionary:false,sys_role:false,
      opportunity_level:false,product_sku:false,dealer_product:false,license_info:true
    }
  };
}
//,license_info:false

export default (state = getInitialState(), action)=> {
  var {type, payload} = action;
  var table_CheckStatus_ = state.table_CheckStatus_;
  switch (type) {
    case GET_BASE_DATA_VERSION:
      var updateTableStats = state.updateTableStats;
      var {forceSync, tableVersions} = payload;
      var {_dictVersion,_latestDictVersion} = getCommonState();
      tableVersions.forEach(val=> {
        var tableName = val.tableName;
        if(updateTableStats.hasOwnProperty(tableName)){//!!! 这里一定要判断包含的关系，要不然loading一直卡住
          if(forceSync){
            updateTableStats[tableName] = true, table_CheckStatus_[tableName] = false;
          }else{
            _latestDictVersion[tableName] = val.version;
            if (!_dictVersion[tableName])updateTableStats[tableName] = true, table_CheckStatus_[tableName] = false;
            else if (_dictVersion[tableName] < val.version)updateTableStats[tableName] = true, table_CheckStatus_[tableName] = false;
          }
        }
      });

      state.table_CheckStatus_ = table_CheckStatus_;
      state.getBaseDataDone = true;
      if (Object.keys(table_CheckStatus_).length == 0)state.checkStatusDone = true;//无任何需要跟新的基础数据，直接置为done
      else state.needCheckStatus = true;
      console.log('---------------------');
      return {...state};
    case GET_DICT_CHANNEL:
      return changeTableStatus(table_CheckStatus_, payload, 'channel', state);
    case GET_DICT_CUSTOMER_STATUS:
      return changeTableStatus(table_CheckStatus_, payload, 'customer_status', state);
    case GET_DICT_DEALER:
      return changeTableStatus(table_CheckStatus_, payload, 'dealer', state);
    case GET_DICT_PRODUCT:
      return changeTableStatus(table_CheckStatus_, payload, 'product', state);
    case GET_DICT_GEOGRAPHY:
      return changeTableStatus(table_CheckStatus_, payload, 'geography', state);
    case GET_DICT_DICTIONARY:
      return changeTableStatus(table_CheckStatus_, payload, 'dictionary', state);
    case GET_DICT_SYS_ROLE:
      return changeTableStatus(table_CheckStatus_, payload, 'sys_role', state);
    case GET_DICT_OPPORTUNITY_LEVEL:
      return changeTableStatus(table_CheckStatus_, payload, 'opportunity_level', state);
    case GET_DICT_PRODUCT_SKU:
      return changeTableStatus(table_CheckStatus_, payload, 'product_sku', state);
    case GET_DICT_DEALER_PRODUCT:
      return changeTableStatus(table_CheckStatus_, payload, 'dealer_product', state);
    case GET_DICT_LICENSE_INFO:
      return changeTableStatus(table_CheckStatus_, payload, 'license_info', state);
    default:
      return state
  }
};

function changeTableStatus(table_CheckStatus_, payload, table, state) {
  var common = getCommonState();
  common._dictData[table] = payload;
  table_CheckStatus_[table] = true;
  if (isAllCheckDone(table_CheckStatus_, common))return {...state,checkStatusDone:true};
  else return state;
}

function isAllCheckDone(table_CheckStatus_,common){
  var keys = Object.keys(table_CheckStatus_);
  var len = keys.length;
  var trueCount = 0;
  keys.forEach(key=> {
    if (table_CheckStatus_[key])trueCount++;
  });
  var done = trueCount == len;
  if(done){//将_latestDictVersion版本数据同步到_dictVersion里
    localStorage.setItem(LS_DICT_VERSION, JSON.stringify(common._latestDictVersion));
    localStorage.setItem(LS_DICT_DATA, JSON.stringify(common._dictData));
    common._dictDataMap = genDictDataMap(common._dictData,common._dictVersion,true);
  }
  return done;
}



