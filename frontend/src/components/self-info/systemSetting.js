/**
 * Created by lizz on 2017/5/30.
 */
import React, {Component} from 'react';
import {bindActionCreators} from 'redux';
import {bindThis, getDeviceInfo,getSysPlatform} from '../../base/common-func';
import {getApiHost} from '../../base/api-host-conf';
import {connect} from 'react-redux';
import * as actions from '../../actions/self-info';
import './systemSetting.css';
import {APP_VERSION} from '../../constants';
import Modal from 'antd-mobile/lib/modal';

class SystemSetting extends Component {
  constructor(props) {
    super(props);
    this.state = {
      openTab: false,
    };
    bindThis(this, ['_setOpen']);
  }

  componentDidMount() {
    if (getSysPlatform() == 'Android') {
      this.props.actions.getAndroidLastedVersionInfo();
    } else {
      this.props.actions.getIosLastedVersionInfo();
    }
  }

  // componentWillReceiveProps(nextProps){
  //   console.log('componentWillReceiveProps!!!!!!!!!!!!!!!');
  //   var {needUpdate}=nextProps.selfInfo;
  //   if (needUpdate) {
  //     // nextProps.selfInfo.needUpdate = false;
  //     var {needForceUpdate, remoteVersion, releaseNote, trackViewUrl}=nextProps.selfInfo;
  //     var releaseNoteView = <div dangerouslySetInnerHTML={{__html:releaseNote}} />;
  //     //强制更新
  //     if(needForceUpdate){
  //       // nextProps.selfInfo.needForceUpdate = false;
  //       Modal.alert('发现新版本:'+remoteVersion, releaseNoteView, [
  //         {text: '确定',onPress: () => {window.location=trackViewUrl;},style: {fontWeight: 'bold'}},
  //       ]);
  //     }else { //非强制更新
  //       Modal.alert('发现新版本:'+remoteVersion, releaseNoteView, [
  //         { text: '取消'},
  //         {text: '确定',onPress: () => {window.location=trackViewUrl; },style: {fontWeight: 'bold'}},
  //       ]);
  //     }
  //   }
  // }

  _setOpen() {
    this.setState({openTab: !this.state.openTab});
  }

  render() {
    console.log('%cSystemSetting','color:green');
    var {remoteVersion, releaseNote, trackViewUrl, needUpdate}=this.props.selfInfo;

    return (
      <div className='self-info-ss'>
        <div className="header" onClick={() => this.props.onLeftIconClick()}>
          <i className="iconfont icon-xiangzuo2 headerIcon"/>
          系统
        </div>
        <div className="appIcon"><img src={'assets/image/Icon.png'}/></div>
        <div className="versionCompare">
          <label className="left">当前版本</label>
          <label className="right">{APP_VERSION}</label>
        </div>
        <div className="versionCompare">
          <label className="left">最新版本</label>
          <label className="right">{remoteVersion}</label>
        </div>
        <div className="versionCompare">
          <label className="left">构建时间</label>
          <label className="right">{__BUILD_TIME__}</label>
        </div>
        <div className="versionCompare">
          <label className="left">设备uuid</label>
          <label className="right">{getDeviceInfo().uuid}</label>
        </div>
        <div className="versionCompare">
          <label className="left">apiHost</label>
          <label className="right">{getApiHost()}</label>
        </div>
        <div className="versionCompare">
          <label className="left">角色值</label>
          <label className="right">{JSON.stringify(this.props.common.login.role)}</label>
        </div>
        <div className={needUpdate ? "versionIntroduce" : "dontUpdate"}>
          <div onClick={this._setOpen}>
            <label className="left">更新介绍</label>
            <i className={(this.state.openTab == true ? 'active' : '') + ' iconfont icon-gengduo '}></i>
          </div>
          <div className={this.state.openTab == true ? 'comDetail' : 'hid'}>
            {releaseNote}
          </div>
        </div>
        <div className={needUpdate ? "versionDownload" : "dontUpdate"}>
          {/*<input className="downloadApp" type="button" onClick={()=>{}} value="下载更新"/>*/}
          <a className="downloadApp" href={trackViewUrl}>下载更新</a>
        </div>
      </div>
    );
  }
}


export default connect(
  state => ({
    selfInfo: state.selfInfo,
    common: state.common
  }),
  dispatch => ({actions: bindActionCreators(actions, dispatch)})
)(SystemSetting)