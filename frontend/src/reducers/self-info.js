/**
 * Created by lizz on 2017/6/20.
 */

import {APP_VERSION} from '../constants';
import {getCommonState} from '../base/common-func';

const arr = APP_VERSION.split('.');
const local = arr.map(val=> parseInt(val));

function getInitialState() {
  return {
    needUpdate: false,
    needForceUpdate:false,
    remoteVersion:'',
    releaseNote: '',
    trackViewUrl: ''
  }
}


// 按约定，只要远端的大版本号和小版本号都大于本地，就需要进行强制更新,
// 补丁号发生改变则只是表示是否需要更新，而非强制性更新
const isNeedUpdate = (remoteVersion)=> {
  remoteVersion = remoteVersion.replace(/V/g, '');
  remoteVersion = remoteVersion.replace(/v/g, '');
  var remote = remoteVersion.split('.');
  remote = remote.map(val=> parseInt(val));

  var needUpdate = false, needForceUpdate = false;
  var [remoteMajor,remoteMinor,remotePatch] = remote;
  var [localMajor,localMinor,localPatch] = local;
  if (remoteMajor > localMajor) {
    needUpdate = true, needForceUpdate = true;
  } else if (remoteMajor == localMajor) {
    if (remoteMinor > localMinor)needUpdate = true, needForceUpdate = true;
    else if (remoteMinor == localMinor) {
      if (remotePatch > localPatch)needUpdate = true;
    }
  }

  return [needUpdate, needForceUpdate]
};

export default (state = getInitialState(), action) => {
  var {type, payload}=action;
  switch (type) {
    case 'GET_ANDROID_LASTED_VERSION_INFO':
      var remoteVersion = payload.version;
      var [needUpdate, needForceUpdate] = isNeedUpdate(remoteVersion);
      var releaseNote = payload.updateContent ? payload.updateContent : '本次更新修复了一些bug,改善用户体验';
      if (needUpdate || needForceUpdate) {
        var common = getCommonState();
        var newState = { ...state, needUpdate, needForceUpdate, remoteVersion, trackViewUrl: payload.downloadUrl, releaseNote};
        common.appVersion = newState;
        return newState;
      } else return {...state, remoteVersion};
    case 'GET_IOS_LASTED_VERSION_INFO':
      if (payload.results.length > 0) {
        var result = payload.results[0];
        var remoteVersion = result.version;//按约定为 x.x.x
        var [needUpdate, needForceUpdate] = isNeedUpdate(remoteVersion);
        var trackViewUrl = result.trackViewUrl.replace('https', 'itms-apps');
        var releaseNote = result.releaseNote ? result.releaseNote : '本次更新修复了一些bug,改善用户体验';
        if (needUpdate || needForceUpdate) {
          var common = getCommonState();
          var newState = {...state, needUpdate, needForceUpdate, remoteVersion, trackViewUrl:trackViewUrl+Date.now(), releaseNote };
          common.appVersion = newState;//把版本信息同步到common
          return newState;
        } else return {...state, remoteVersion};
      } else return {...state};
    default:
      return state;
  }
}