/**
 * Created by zhongzhengkai on 2017/5/11.
 */

import React, { Component } from 'react';
import { getAppViewHeight, bindThis, logout, getSysPlatform, getPageLeaveHandler, getCurrentPath} from '../../base/common-func';
import { appHistory } from '../app';
// import Popover from 'antd-mobile/lib/popover';
import Popover from 'react-popover/build';
import Modal from 'antd-mobile/lib/modal';

var appH = getAppViewHeight();
var barTopH = 38,pTop1=0,pTop2=0;
if(getSysPlatform()=='IOS')barTopH =48,pTop1=10,pTop2=15;//需要给ios顶部状态栏预留位置
var barBottomH = 48;


const box = { position: 'relative', width: '100%', height: appH };
const headerBox = { position: 'absolute', top: 0, width: '100%', height: barTopH,lineHeight:barTopH+'px',textAlign:'center',fontSize:'.4rem',color:'white',backgroundColor: 'black', zIndex: 2 };
const headerLeftBox = {display:'inline-block',width:'33%'};
const headerCenterBox = {display:'inline-block',boxSizing:'border-box',width:'33%',height:barTopH,verticalAlign:'top',paddingTop:pTop1};
const headerRightBox = {display:'inline-block',boxSizing:'border-box',width:'33%',height:barTopH,textAlign:'right',paddingTop:pTop2,paddingRight:'.3rem',verticalAlign:'bottom'};
const iconBox = {display:'inline-block',width:'50%',height:'100%'};
const rightIconSt = {fontSize:'.5rem',color:'white'};

const popoverBodySt = {backgroundColor:'white',borderRadius:6, boxShadow:'0 1px 10px #888888'};
const popoverSt = {zIndex:9999};
const mineBoxSt = {width:100,height:38,lineHeight:'38px',fontSize:'.35rem',textAlign:'center',borderBottom:'1px solid grey'};
const exitBoxSt = {width:100,height:38,lineHeight:'38px',fontSize:'.35rem',textAlign:'center'};
const iconPadding = {paddingRight:6,fontSize:'.38rem'};

const contentSt = { position: 'absolute', top: barTopH, bottom: barBottomH, width: '100%', overflowY: 'auto' };
const footerSt = { position: 'absolute', bottom: 0, width: '100%', height:barBottomH, backgroundColor: '#c5c5c5' };

export default class NavBar extends Component {

  constructor(props, context) {
    super(props, context);
    this._redirect = this._redirect.bind(this);
    this.state = {visible:false};
    bindThis(this, ['_redirect','onSelect','handleVisibleChange','togglePopover',
      'onOuterAction','logoutDCCM','toSelfInfo','showHelp']);
  }

  _redirect(e) {
    var path = e.currentTarget.getAttribute('data-path');
    if(path != this.props.path){
      var curPath = getCurrentPath();
      var handleLeave = getPageLeaveHandler(curPath);
      var query = null;
      if (path == '/new-contact')query={from:'homeBtn'};
      if(handleLeave){
        handleLeave(shouldLeave=>{
          if (shouldLeave)appHistory.push(path, query);
        })
      }else{
        this.props.checkVersion();
        appHistory.push(path, query);
      }
    }
  }

  showHelp(e){
    e.preventDefault();
    Modal.alert(
      <div style={{textAlign:'left',lineHeight:'26px'}}>
        扫描下方二维码或直接微信搜索“Jeep数字营销中心”，直接在对话框中提交您的疑问或建议，将有专人为您提供相关解答。
        <br/>
        客服时间：9:00-18:00（周一至周日）
        <br/>
        <img src="assets/image/help.jpeg" style={{width:'90%',margin:'5%'}} />
      </div>
    );
    this.setState({visible: false});
  }

  onSelect(opt){
    // console.log(opt.props.value);
    console.log('onSelect');
    this.setState({
      visible: false,
      selected: opt.props.value,
    });
  }

  handleVisibleChange(visible){
    console.log('handleVisibleChange',visible);
    this.setState({
      visible,
    });
  }

  togglePopover(){
    this.setState({visible: !this.state.visible});
  }

  onOuterAction(e){
    e.preventDefault();
    this.setState({visible: false})
  }

  logoutDCCM(){
    logout();
    appHistory.push('/login')
  }

  toSelfInfo(){
    this.state.visible = false;
    appHistory.push('/self-info')
  }

  render() {
    var {title,children,path} = this.props;
    return (
      <div style={box}>
        <div style={headerBox}>
          <div style={headerLeftBox}></div>
          <div style={headerCenterBox}>{title}</div>
          <div style={headerRightBox}>
            <Popover placement="bottomRight" style={popoverSt}
                     isOpen={this.state.visible} preferPlace="right" place="below"
                     body={
                       <div style={popoverBodySt}>
                         <div key="1" style={mineBoxSt} onClick={this.toSelfInfo}>
                           <i className="iconfont icon-wode1" style={iconPadding}/>我的
                         </div>
                         <div key="2" style={mineBoxSt} onClick={this.showHelp}>
                           <i className="iconfont icon-wenhao" style={iconPadding}/>帮助
                         </div>
                         <div key="3" style={exitBoxSt} onClick={this.logoutDCCM}>
                           <i className="iconfont icon-tuichu1" style={iconPadding}/>退出
                         </div>
                       </div>
                     }
                     onOuterAction={this.onOuterAction}
            >
            <span style={iconBox} onClick={this.togglePopover}>
              <i className="iconfont icon-shenglvehao" style={rightIconSt}/>
            </span>
            </Popover>
          </div>
        </div>

        <div style={contentSt}>
          {children}
        </div>

        <div style={footerSt}>
          <ul className="navBar">
            <li className={path=='/home'?'active':''} data-path='/home' onClick={this._redirect}>
              <i className="iconfont icon-zhuye"/>
              <span >主页</span>
            </li>

            <li className={path=='/today-task'?'active':''} data-path='/today-task' onClick={this._redirect}>
              <i className="iconfont icon-renwu"/>
              <span>今日任务</span>
            </li>

            <li className={path=='/new-contact'?'active':''} data-path='/new-contact' onClick={this._redirect}>
              <i className="iconfont icon-xinzengyonghu"/>
              <span>新增客户</span>
            </li>

            <li className={path=='/contactsBook'?'active':''}  data-path='/contactsBook' onClick={this._redirect}>
              <i className="iconfont icon-tongxunlu" />
              <span>通讯录</span>
            </li>

            <li className={path=='/article-list'?'active':''} data-path='/article-list' onClick={this._redirect}>
              <i className="iconfont icon-neirong" />
              <span>内容营销</span>
            </li>
          </ul>
        </div>
      </div>
    );
  }

}
