/**
 * Created by zhongzhengkai on 2017/5/11.
 */
import React, { Component } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import * as actions from '../../actions/today-task';
import * as contactActions from '../../actions/contact-book';
// import SwipeAction from 'antd-mobile/lib/swipe-action';
import Popup from 'antd-mobile/lib/popup';
import { bindThis, getCommonState, getCSSPixelWidth, getStore, getCSSPixelHeight, getCurrentQuery, getSidebarStyle} from '../../base/common-func';
import {TODAY_TASK_PAGE_SIZE} from '../../constants';
import './today-task.css';
import SwipeAction from '../common/swipe-action';
import PhonePanel from './phone-panel';
import MsgPanel from './msg-panel';
import Sidebar from 'react-sidebar';
import ContactDetail from './../contacts-book/customer-detail/contact-detail';

// TodayTask 1: n TaskItem
// TaskItem 1: n TagItem
var telImgHeight = 70;
var appW = getCSSPixelWidth();
if (appW == 320 || appW == 360) telImgHeight = 59;

const sideBarSt = getSidebarStyle();
const scopedState = {prevOpenedTagItem:-1};

const ClosedTagItem = ({ dataSource, tagKey, onClickHeader, noHeader = false }) => {
  if (noHeader) {
    return <div />;
  } else {
    return (
      <div className="tagHeader" onClick={() => onClickHeader(tagKey)}>
        <div className="tagHeaderLine" />
        <label className="tagHeaderLabel" >
          {dataSource.header}
          <i className="iconfont icon-demo03" />
        </label>
      </div>
    );
  }
};

// SMS.sendSMS('18600393748', 'HELLO', function(str){alert('1:'+str)}, function(str){alert(str);
class OpenedTagItem extends Component{
  constructor(props, context){
    super(props, context);
  }

  render(){
    var { dataSource, tagKey, onClickHeader, onTouchStart, onTouchEnd,openCustomerDetail, noHeader = false, callPhone, sendMsg, page} = this.props;
    var { opportunity_level: oppLevelMap, customer_status: cStatusMap } = getCommonState()._dictDataMap;
    var { header, items, startIdx } = dataSource;
    var offsetStart = startIdx + 1;
    var itemsView = items.slice(startIdx, startIdx + TODAY_TASK_PAGE_SIZE).map((item, idx) => {
      var { opportunityLevel, name,opportunityId, modelId, _timeLabel, status, _timeVal, phone,
        channelId_Label, modelId_Label,companyId,journeyId,nodeId,contactId, timerNum, gender, overdue
      } = item;

      var oppTitleEn = oppLevelMap[opportunityLevel].titleEn;
      var levelIconCorner = '';
      //今日接到标签是不会出现逾期这个角标的
      if (page != 'reception' && overdue)levelIconCorner = <div className="tagLevelIconCorner"><span>逾期</span></div>;

      return (
        <SwipeAction key={idx} ref={idx} refKey={idx} maxEndWidth={198} swipeContent={
          <div style={{ height: '100%', width: '100%' }}>
            <img data-phone={phone} data-modelid={modelId} data-name={name} data-optlevel={opportunityLevel} data-optid={opportunityId} data-status={status}
                 src={'assets/image/tel-bg.png'} style={{ width: '50%', height: '100%' }} onClick={callPhone} data-gender={gender} />
            <img data-phone={phone} data-modelid={modelId} data-name={name} data-optlevel={opportunityLevel} data-optid={opportunityId} data-status={status}
                 src={'assets/image/msg-bg.png'} style={{ width: '50%', height: '100%' }} onClick={sendMsg} data-gender={gender} />
          </div>} onOpen={(refKey)=>{var prevKey =scopedState.prevOpenedTagItem; scopedState.prevOpenedTagItem=refKey;if(this.refs[prevKey]){this.refs[prevKey].close()}}}
        >
          <div className="tagItem" key={idx} data-id={opportunityId} data-companyId={companyId} data-journeyId={journeyId}
               data-nodeId={nodeId} data-contactId={contactId} onClick={openCustomerDetail}>
            <div className="tagLevelIcon">
              <img style={{ width: '80%' }} src={'assets/image/intent-level/' + oppTitleEn + '.png'} />
            </div>
            {levelIconCorner}
            <div className="tagContent">
              <label className="userName">{name}</label>
              <label className="other">{modelId_Label}</label>
              <br />
              <label className="other2">来自{channelId_Label}</label>
              <br />
              <label className="other2">潜客状态 {cStatusMap[status].statusName}</label>
              <br />
              <label className="other2">{_timeLabel}</label>
              <label className="walkInDate">{_timeVal}</label>
              <div className="dot1"></div>
              <div className="dot2"></div>
              <div className="dot3">{offsetStart+idx}</div>
            </div>
          </div>
        </SwipeAction>
      );
    });

    var headerView = '';
    if (noHeader == false) {
      headerView = (
        <div className="tagHeader" onClick={() => onClickHeader(tagKey)}>
          <div className="tagHeaderLine" />
          <label className="tagHeaderLabel" >
            {header}
            <i className="iconfont icon-triangle-up" />
          </label>
        </div>
      );
    }

    var btnView = '';
    var needPrevBtn = startIdx > 0;
    var needNextBtn = startIdx + TODAY_TASK_PAGE_SIZE < items.length;
    if(needPrevBtn && needNextBtn){
      btnView = (
        <div className="tagBtnBox">
          <div className="tagBtn" data-tagkey={tagKey} onClick={this.props.prevPage}>上一页</div>
          <div className="tagBtn" data-tagkey={tagKey} onClick={this.props.nextPage}>下一页</div>
        </div>
      );
    }else if(needPrevBtn){
      btnView = (
        <div className="tagBtnBox">
          <div className="tagBtn" data-tagkey={tagKey} onClick={this.props.prevPage}>上一页</div>
        </div>
      );
    }else if(needNextBtn){
      btnView = (
        <div className="tagBtnBox">
          <div className="tagBtn" data-tagkey={tagKey} onClick={this.props.nextPage}>下一页</div>
        </div>
      );
    }


    return (
      <div onTouchEnd={onTouchEnd} onTouchStart={onTouchStart}>
        {headerView}
        {itemsView}
        {btnView}
      </div>
    );
  }
}

class TaskItem extends Component {

  constructor(props, context) {
    super(props, context);
    this.state = { openTag: '', clientY1: 0, clientY2: 0, startL: 0, endL: 0 ,sidebarKey:Date.now()};
    bindThis(this, ['handleClickHeader', 'toggleTag', 'handleTouchTagEnd', 'handleTouchTagStart', 'callPhone', 'sendMsg']);
  }

  toggleTag(tagKey) {
    // tagKey = e.currentTarget.getAttribute()
    console.log('toggleTag' + tagKey);
    if (this.state.openTag == tagKey) this.setState({ openTag: '' });
    else this.setState({ openTag: tagKey });
  }

  callPhone(e) {
    var currentTarget = e.currentTarget;
    var {phone,modelid:modelId,optlevel:opportunityLevel,optid:opportunityId,status} = currentTarget.dataset;
    //触发父组件打开外呼提示面板
    this.props.openCallPhonePanel({phone,modelId,opportunityLevel,opportunityId,status},this.state.openTag);
  }

  sendMsg(e) {
    var currentTarget = e.currentTarget;
    var {phone, modelid:modelId, name, optlevel:opportunityLevel, optid:opportunityId, status, gender} = currentTarget.dataset;
    //触发父组件打开短信提示面板
    this.props.openMsgPanel({phone, modelId, name, opportunityLevel, opportunityId, status, gender});
  }

  handleTouchTagStart(e) {
    var touches = e.nativeEvent.touches;
    if (touches.length > 1) {
      var [touch1, touch2] = touches;
      this.state.clientY1 = touch1.clientY;
      this.state.clientY2 = touch2.clientY;
    }
    // this.setState({startL:touches.length+' '+ e.nativeEvent.changedTouches.length});
  }

  handleTouchTagEnd(e) {
    // var touches = e.nativeEvent.changedTouches;
    var touches = e.nativeEvent.touches;
    if (touches.length > 1) {
      var [touch1, touch2] = touches;
      var clientY1 = touch1.clientY;
      var clientY2 = touch2.clientY;
      var { clientY1: prevClientY1, clientY2: prevClientY2 } = this.state;
      alert(`${clientY1}-${clientY2}-----${prevClientY1}+${prevClientY2}`);
      if (clientY1 - prevClientY1 > 100 && prevClientY2 - clientY2 > 100) this.setState({ openTag: '' });
    }
    // this.setState({endL:touches.length+' '+ e.nativeEvent.changedTouches.length});
  }

  handleClickHeader() {
    console.log('-----', this.props.level);
    this.props.onHeaderClick(this.props.level);
  }

  render() {
    console.log('@@@ TaskItem');
    var { openTag} = this.state;
    var { dataSource, noTagHeader,openCustomerDetail, page} = this.props;
    var { header, tagDetail } = dataSource;
    var tagItemsView = '';

    if (this.props.open) {
      tagItemsView = Object.keys(tagDetail).map((tagKey, idx) => {
        var tag = tagDetail[tagKey];
        if (openTag == tagKey || noTagHeader) {//!!! 接到noTagHeader参数传入，就可以展开了，表示来自于今日接待
          return (
            <OpenedTagItem key={idx} tagKey={tagKey} openCustomerDetail={openCustomerDetail} dataSource={tag} onClickHeader={this.toggleTag}
                           callPhone={this.callPhone} sendMsg={this.sendMsg} onTouchStart={this.handleTouchTagStart} onTouchEnd={this.handleTouchTagEnd}
                           noHeader={noTagHeader} nextPage={this.props.nextPage}  prevPage={this.props.prevPage} page={page}
            />
          );
        } else {
          return <ClosedTagItem key={idx} tagKey={tagKey} dataSource={tag} onClickHeader={this.toggleTag} noHeader={noTagHeader} />
        }
      });
    }

    return (
      <div className="taskItemBox">
        <div className="levelHeader" ref="gogogo" onClick={this.handleClickHeader} >{header}</div>
        {tagItemsView}
      </div>
    );
  }

}

class TodayTask extends Component {

  constructor(props, context) {
    super(props, context);
    var query = getCurrentQuery();
    var page = 'followUp';//page: followUp | reception
    if (query && query.page) page = query.page;
    this.state = {
      page, sidebarType: '', openLevel: '', msgPanel: '', msgPanelOpen: false, phoneOfMsgPanel: '', opportunityLevel:'',slGender:'',
      opportunityId:'', status:'', modelIdOfMsgPanel: '', customerId: '', companyId: '', journeyId: '', nodeId: '', contactId: ''
    };
    bindThis(this, ['toggleTask', 'switchPage', 'openCallPhonePanel', 'openMsgPanel', 'closeMsgPanel',
      '_openCustomerDetail', 'nextPage', 'prevPage']);
  }

  componentDidMount() {
    this.props.actions.getTodayTask(this.props.common.login.id);
    this.props.actions._getAccountsRole(this.props.common.login.dealerId);
  }

  nextPage(e){
    this.props.actions.nextPage(this.state.page, this.state.openLevel, e.currentTarget.dataset.tagkey)
  }

  prevPage(e){
    this.props.actions.prevPage(this.state.page, this.state.openLevel, e.currentTarget.dataset.tagkey)
  }

  openCallPhonePanel({phone,modelId,opportunityLevel,opportunityId,status}, openTag) {
    var dealerUserId = this.props.common.login.id;
    Popup.show(<PhonePanel data={{phone,modelId,opportunityLevel,opportunityId,dealerUserId,status}} store={getStore()} openTag={openTag} />, { animationType: 'slide-up' });
  }

  closeMsgPanel() {
    this.setState({ msgPanelOpen: false });
    this.props.actions.getTodayTask(this.props.common.login.id);//关掉面板的同时要刷新页面数据
  }

  openMsgPanel({phone, modelId, name, opportunityLevel, opportunityId, status, gender}) {
    this.setState({
      sidebarType: 'msgPanel',
      msgPanelOpen: true,
      phoneOfMsgPanel: phone,
      modelIdOfMsgPanel: modelId,
      nameOfMsgPanel: name,
      slOpportunityLevel: opportunityLevel,
      slOpportunityId: opportunityId,
      slStatus: status,
      slGender:gender
    });
  }

  _openCustomerDetail(e) {
    let {id:customerId,companyid:companyId,journeyid:journeyId,nodeid:nodeId,contactid:contactId} = e.currentTarget.dataset;
    this.props.actions._getCustomerInfo(customerId, (err)=>{
      if(!err)this.setState({ sidebarKey: Date.now(), sidebarType: 'contactDetail',  msgPanelOpen: true, customerId: customerId,companyId,journeyId,nodeId,contactId});
    });
  }

  switchPage(e) {
    var selectedPage = e.currentTarget.getAttribute('data-page');
    if (this.state.page != selectedPage) this.setState({ page: selectedPage });
    else this.setState({ openLevel: '' });//关闭打开的level视图
  }

  toggleTask(levelKey) {
    if (this.state.openLevel == levelKey) this.setState({ openLevel: '' });
    else this.setState({ openLevel: levelKey });
  }

   getSidebarDom() {
     if(this.state.msgPanelOpen){
       var { sidebarType, customerId, sidebarKey, phoneOfMsgPanel, modelIdOfMsgPanel, nameOfMsgPanel,
         slOpportunityLevel, slOpportunityId, slStatus, slGender
       } = this.state;
       if (sidebarType == 'msgPanel')
         return <MsgPanel key={sidebarKey}  modelId={modelIdOfMsgPanel} data={{
           phone: phoneOfMsgPanel, modelId: modelIdOfMsgPanel, name: nameOfMsgPanel,opportunityLevel: slOpportunityLevel, dealerUserId:this.props.common.login.id,
           opportunityId: slOpportunityId, status: slStatus, gender:slGender}} store={getStore()} onHeaderClick={this.closeMsgPanel}
         />;
       else if (sidebarType == 'contactDetail') {
         var {companyId,journeyId,nodeId,contactId} = this.state;
         var { customerDetail, accountList } = this.props.contactsBook;
         if (customerId && JSON.stringify(customerDetail) != '{}')
           return (
             <ContactDetail _updateCustomerInfo={this.props.actions._updateCustomerInfo} _getAccountsRole={this.props.actions._getAccountsRole} accountList={accountList}
                            _keepUp={this.props.actions._keepUp} _update common={this.props.common}
                            customerDetail={customerDetail} key={this.state.sidebarKey}
                            _onPanelClose={this.closeMsgPanel} from={{page:'today-task',data:{companyId,journeyId,nodeId,contactId}}} />
           );
         else return '';
       } else return '';
     }else{
       return '';
     }
   }

  render() {
    console.log('%c@@@ TodayTask', 'color:green;border:1px solid green');
    var { openLevel, page,sidebarKey } = this.state;
    var { levelData, todayReception, followUpCount, receptionCount } = this.props.todayTask;
    var taskItemsView;
    if (page == 'reception') {
      taskItemsView = Object.keys(todayReception).map((levelKey, idx) => {
        return <TaskItem key={idx} level={levelKey} dataSource={todayReception[levelKey]} open={openLevel == levelKey} openCustomerDetail={this._openCustomerDetail} openMsgPanel={this.openMsgPanel}
          onHeaderClick={this.toggleTask} noTagHeader={true} openCallPhonePanel={this.openCallPhonePanel} nextPage={this.nextPage} prevPage={this.prevPage} page={page}/>
      });
    } else {
      taskItemsView = Object.keys(levelData).map((levelKey, idx) => {
        return <TaskItem key={idx} level={levelKey} dataSource={levelData[levelKey]} open={openLevel == levelKey} openCustomerDetail={this._openCustomerDetail} openMsgPanel={this.openMsgPanel}
          onHeaderClick={this.toggleTask} openCallPhonePanel={this.openCallPhonePanel}  nextPage={this.nextPage} prevPage={this.prevPage} page={page}/>
      });
    }

    return (
      <Sidebar sidebar={this.getSidebarDom()}  styles={sideBarSt} key={sidebarKey}
        pullRight={true} touch={false} shadow={false}
        open={this.state.msgPanelOpen}
      >
        <div className="today-task">
          <div className="selector-box">
            <label data-page="followUp" className={"selector-item " + ('followUp' == page ? 'active' : '')} onClick={this.switchPage}>
              今日跟进({followUpCount})
            </label>
            <label data-page="reception" className={"selector-item " + ('reception' == page ? 'active' : '')} onClick={this.switchPage}>
              今日接待({receptionCount})
            </label>
          </div>
          <div className="levelContent">
            {taskItemsView}
          </div>
        </div>
      </Sidebar>
    );
  }

}



export default connect(
  state => ({
    todayTask: state.todayTask,
    common: state.common,
    contactsBook:state.contactsBook
  }),
  dispatch => ({ actions: bindActionCreators({...actions,...contactActions},dispatch), })
)(TodayTask)
