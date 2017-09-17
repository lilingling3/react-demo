/**
 * Created by zhongzhengkai on 2016/12/26.
 */

import {SHOW_LOADING,HIDE_LOADING} from '../constants/action-name';
import {LS_DICT_DATA, LS_DICT_VERSION, LS_LOGIN, LS_LOGIN_USERNAME, LS_IS_REMEMBERED} from '../constants';

//Channel表 level1:channelId, level2:sourceId

//license_info from _dataDict
//license_info_LINK from _dataDictMap
export const buildLicenseInfoLink = function buildLicenseInfoLink(license_info , _dictDataMap){
  var license_info_LINK = _dictDataMap.license_info_LINK;
  var licenseNo_LINK = _dictDataMap.licenseNo_LINK;
  if(license_info){
    license_info.forEach(routeData=>{
      var {licenseInfos, id:routeId, nameCn, nameEn}  = routeData;
      if(licenseInfos){
        licenseInfos.forEach(info=>{
          var {id,dealerId,dealerCode,dealerName,licenseNo} = info;
          if(dealerId){
            var targetDealer = license_info_LINK[dealerId];
            if(!targetDealer) targetDealer = license_info_LINK[dealerId] = {};
            var targetRoute = targetDealer[routeId];
            if(!targetRoute) targetRoute = targetDealer[routeId] = {};
            targetRoute[id] = {id, routeId, nameCn, nameEn, dealerId, dealerCode, dealerName, licenseNo};
            licenseNo_LINK[licenseNo] = id;
          }
        });
      }
    });
  }
};


export const genDictDataMap = function genDictMap(_dictData, _dictVersion, forceBuild = false){
  var _dictDataMap = {channel_LINK: {}, product_LINK: {}, license_info_LINK:{}, licenseNo_LINK:{}};
  Object.keys(_dictData).forEach(tableName=>{
    var list = _dictData[tableName];
    var _map = {};
    list.forEach(val=> _map[val.id]=val);
    _dictDataMap[tableName] = _map;
  });

  var channelMap = _dictDataMap.channel;
  _dictData.channel.forEach(val=>{
    var {parentId} = val;
    if(parentId && channelMap[parentId]){//确保parentId在map里存在
      var _link = _dictDataMap.channel_LINK[parentId];
      if(_link == null)_link = _dictDataMap.channel_LINK[parentId] = [];
      _link.push(val);
    }
  });

  var productMap = _dictDataMap.product;
  _dictData.product.forEach(val=>{
    var {parentId,level,id} = val;
    if(parentId){
      if(level==1){
        let _linkLevel1 = _dictDataMap.product_LINK[id];
        if(_linkLevel1 == null) _dictDataMap.product_LINK[id] = {};
      }else if(level==2){
        let _linkLevel1 = _dictDataMap.product_LINK[parentId];
        if(_linkLevel1 == null)_linkLevel1 = _dictDataMap.product_LINK[parentId] = {};
        if(_linkLevel1[id])_linkLevel1[id] = [];
      }else if(level==3){
        if(productMap[parentId]){//!!! 先判断下，可能会出现undefined，按道理每一个parentId都应该有值
          let level1Id = productMap[parentId].parentId;
          let _linkLevel1 = _dictDataMap.product_LINK[level1Id];
          if(_linkLevel1 == null)_linkLevel1 = _dictDataMap.product_LINK[_linkLevel1] = {};
          var _linkLevel2 = _linkLevel1[parentId];
          if( _linkLevel2 == null)_linkLevel2 = _linkLevel1[parentId] = [];
          _linkLevel2.push(val);
        }else{
          console.log(id,parentId)
        }
      }
    }
  });

  //一个dealerId对多个路线routeId
  //一个路线routeId对多个车牌号信息licenseId
  // if (_dictVersion.license_info > 2 && forceBuild) {
    buildLicenseInfoLink(_dictData.license_info, _dictDataMap);
  // }

  return _dictDataMap;
};

function getInitialState() {
  var storedLogin = {};
  var storedLoginStr = localStorage.getItem(LS_LOGIN);
  if(storedLoginStr)storedLogin = JSON.parse(storedLoginStr);

  var storedLoginUserName = localStorage.getItem(LS_LOGIN_USERNAME) || '';
  var isRemembered = localStorage.getItem(LS_IS_REMEMBERED) == '1' ? true: false;

  var _dictVersion = {};
  var dictVerStr = localStorage.getItem(LS_DICT_VERSION);
  if(dictVerStr){
    _dictVersion = JSON.parse(dictVerStr);
  }

  var _dictData = {};
  var _dictDataStr = localStorage.getItem(LS_DICT_DATA);
  var _dictDataMap = {channel_LINK: {}, product_LINK: {}};
  if(_dictDataStr){
    _dictData = JSON.parse(_dictDataStr);
    _dictDataMap = genDictDataMap(_dictData, _dictVersion)
  }

  return {
    currentAction: {},
    query: {},
    queryBak: {},
    props:{},
    propsBak:{},
    currentPath: '',
    login: storedLogin,
    loginUserName: storedLoginUserName,
    isRemembered: isRemembered,
    _dictVersion,// common/_dictVersion
    _dictData,
    _dictDataMap,
    _latestDictVersion: {},//翻遍login reducer里做完更新后，取各个表的版本号更新到_dictVersion里
    appVersion:{
      needUpdate: false,
      needForceUpdate:false,
      remoteVersion:'',
      releaseNote: '',
      trackViewUrl: ''
    },
    tokenErrorLabel:''
  };
}

var initialState = getInitialState();//!!! 这样写才会只被调用一次，奇怪....
export default (state = initialState, action) => {
  var {type, payload} = action;
  if (type != SHOW_LOADING && type != HIDE_LOADING)state.currentAction = action;
  switch(type){
    case 'LOGIN_DCCM':
      state.login = payload;
      return state;
    case 'TOKEN_EXPIRE_ERROR':
      state.tokenErrorLabel = payload;
      return {...state};
    default:
      return state;
  }
}