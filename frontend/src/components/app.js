import React, {Component, PropTypes} from 'react';
import '../styles/app.css';
import '../styles/antd-mobile.css';
import '../styles/animate.min.css';
import '../styles/slick.css';
import '../styles/slick-theme.css';
import {REQUEST_START, LOADED} from '../constants/net-status';
import {setQuery, getPathTitle, getCurrentProps, bindThis, getSysPlatform, setTokenExpireMessageCountZero} from '../base/common-func';
import * as dlg from '../base/tool/dlg';
import {connect} from 'react-redux';
import {bindActionCreators} from 'redux';
import Icon from 'antd-mobile/lib/icon';
import NavBar from '../components/common/nav-bar';
import * as selfActions from '../actions/self-info';
import Modal from 'antd-mobile/lib/modal';

export const appHistory = {
  push: () => {
  }, getPath: () => {
  }
};
const maskSt = {
  position: 'absolute', width: 60, height: 60, left: 0, top: 0, right: 0, bottom: 0, margin: 'auto',
  backgroundColor: 'transparent', borderRadius: 16, textAlign: 'center', zIndex: 9999
};

const justReceiveUpdateSignal = {value:false};

class MyApp extends Component {

  constructor(props) {
    super(props);
    var defaultPath = props.path ? props.path : '/';
    this.state = {path: defaultPath, RequestStatus: LOADED, timer:''};
    this.changePath = this.changePath.bind(this);
    this.getPath = this.getPath.bind(this);
    appHistory.push = this.changePath;
    appHistory.getPath = this.getPath;
    bindThis(this, ['checkAppVersion']);
  }

  componentWillMount(){
    justReceiveUpdateSignal.value = false;
    this.props.actions.setDispatch();
  }

  componentDidMount() {
    this.checkAppVersion();
  }

  componentWillUnmount(){
    clearInterval(this.state.timer);
  }

  checkAppVersion() {
    // return this.props.actions.getAndroidLastedVersionInfo();
    if (getSysPlatform() == 'Android') {
      this.props.actions.getAndroidLastedVersionInfo();
    } else {
      this.props.actions.getIosLastedVersionInfo();
    }
  }


  componentWillReceiveProps(nextProps){
    console.log('componentWillReceiveProps!!!!!!!!!!!!!!!');
    var {needUpdate}=nextProps.selfInfo;
    if (needUpdate) {
      if(!justReceiveUpdateSignal.value){
        justReceiveUpdateSignal.value = true;
        // nextProps.selfInfo.needUpdate = false;
        var {needForceUpdate, remoteVersion, releaseNote, trackViewUrl}=nextProps.selfInfo;
        var releaseNoteView = <div dangerouslySetInnerHTML={{__html:releaseNote}} />;
        //强制更新
        if(needForceUpdate){
          // nextProps.selfInfo.needForceUpdate = false;
          Modal.alert('发现新版本:'+remoteVersion, releaseNoteView, [
            {text: '确定',onPress: () => {justReceiveUpdateSignal.value = false; window.location=trackViewUrl;},style: {fontWeight: 'bold'}},
          ]);
        }else { //非强制更新
          Modal.alert('发现新版本:'+remoteVersion, releaseNoteView, [
            { text: '取消'},
            {text: '确定',onPress: () => {justReceiveUpdateSignal.value = false; window.location=trackViewUrl; },style: {fontWeight: 'bold'}},
          ]);
        }
      }
    }
  }

  // componentWillReceiveProps(nextProps) {
  //   var {needUpdate}=this.props.common;
  //   if (needUpdate) {
  //     nextProps.selfInfo.needUpdate = false;
  //     var {needForceUpdate, remoteVersion, releaseNote, trackViewUrl}=this.props.common;
  //     console.log('%ctrackViewUrl:'+trackViewUrl,'color:red');
  //     var releaseNoteView = <div dangerouslySetInnerHTML={{__html:releaseNote}} />;
  //     //强制更新
  //     if(needForceUpdate){
  //       nextProps.selfInfo.needForceUpdate = false;
  //       Modal.alert('发现新版本:'+remoteVersion, releaseNoteView, [
  //         { text: '取消'},
  //         {text: '确定',onPress: () => {window.location=trackViewUrl;},style: {fontWeight: 'bold'}},
  //       ]);
  //     }else { //非强制更新 ,暂时不做任何处理吧
  //       // Modal.alert('发现新版本:'+remoteVersion, releaseNoteView, [
  //       //   { text: '取消'},
  //       //   {text: '确定',onPress: () => {window.location=trackViewUrl; },style: {fontWeight: 'bold'}},
  //       // ]);
  //     }
  //   }
  // }

  changePath(path, query, props) {
    setQuery(path, query, props);
    if(path == '/home' && query && query.from == 'login'){
      justReceiveUpdateSignal.value = false;
      this.checkAppVersion();
    }
    this.setState({path});
  }

  // componentWillUpdate(){
  //   var path = this.state.path;
  //   history.pushState({},'',path);
  // }

  componentDidUpdate(){
    var tokenErrorLabel = this.props.common.tokenErrorLabel;
    if (tokenErrorLabel) {
      dlg.info(tokenErrorLabel,()=>{
        setTokenExpireMessageCountZero();
      });
      this.props.common.tokenErrorLabel = '';
      // appHistory.push('/login');
    }
  }

  getPath() {
    return this.state.path;
  }

  render() {
    var path = this.state.path;
    console.log('%c@@@ App ' + path, 'color:darkred;border:1px solid darkred');

    let loader = '';
    if (this.props.requestStatus.requestStatus == REQUEST_START) {
      loader =
        <div className='mk'>
          <div style={maskSt}>
            <div className="spinner">
              <div className="rect1"></div>
              <div className="rect2"></div>
              <div className="rect3"></div>
              <div className="rect4"></div>
              <div className="rect5"></div>
            </div>
          </div>
        </div>;
    }

    var displayContent, content;
    var Component = this.props.pathComponentMap[path];
    if (!Component) content = <div className="content"><h1>页面暂时未开发</h1></div>;
    else {
      if (path == '/login') content = <Component />;
      else {
        var props = getCurrentProps();
        if (props) content = <div className="content"><Component {...props}/></div>;
        else content = <div className="content"><Component /></div>;
      }
    }

    var title = getPathTitle(path);
    if (path == '/login') displayContent = content;
    else displayContent = (<NavBar path={path} title={title} checkVersion={this.checkAppVersion}>{content}</NavBar>);

    return (
      <div style={{height: '100%'}}>
        {loader}
        {displayContent}
      </div>
    );
  }

}

export const Link = ({to, children}) => {
  return <a onClick={() => {
    appHistory.push(to)
  }}>{children}</a>
};

export default connect(
  state => ({
    selfInfo: state.selfInfo,
    requestStatus: state.requestStatus,
    common: state.common,
  }),
  dispatch => ({actions: bindActionCreators(selfActions, dispatch)})
)(MyApp)


// export default MyApp;