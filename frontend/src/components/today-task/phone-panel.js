/**
 * Created by zhongzhengkai on 2017/5/19.
 */
import React, {Component} from 'react';
import {bindActionCreators} from 'redux';
import {getCSSPixelWidth, bindThis} from '../../base/common-func';
import * as api from '../../base/api';
import Popup from 'antd-mobile/lib/popup';
import {connect} from 'react-redux';
import * as actions from '../../actions/today-task';
import moment from 'moment';

var tipWidth = parseInt(getCSSPixelWidth() / 3);
const tipItemActiveSt = {
  display: 'inline-block', boxSizing: 'border-box', width: tipWidth, lineHeight: '45px', height: 50,
  borderBottom: '5px solid #515151', textAlign: 'center',overflowX:'hidden',verticalAlign:0
};
const tipItemSt = {
  display: 'inline-block', boxSizing: 'border-box', width: tipWidth, lineHeight: '45px', height: 50,
  textAlign: 'center',overflowX:'hidden',verticalAlign:0,borderBottom:'5px solid white'
};

class PhonePanel extends Component{

  constructor(props, context){
    super(props, context);
    var selectedTip = props.openTag == 'tag1' ? '离店回访' : '日常跟进';
    this.state = {selectedTip};
    bindThis(this,['switchTip', 'recordCommunication']);
  }

  componentWillReceiveProps(nextProps){
    console.log('------>nextProps',nextProps.openTag);
    var selectedTip = nextProps.openTag == 'tag1' ? '离店回访' : '日常跟进';
    this.state.selectedTip = selectedTip;
  }

  recordCommunication(){
    var {opportunityLevel, opportunityId, dealerUserId, status} = this.props.data;
    var dateStr = moment().format('YYYY-MM-DD HH:mm:ss');
    api.sendCommunicationHistory({
      opportunityId,
      followUpPersonId:dealerUserId,
      statusAfter:status,
      statusBefore:status,
      status,
      contactTime:dateStr,
      communicateStatus:1,
      communicateContent:'一键电话',
      salesConsultantId:dealerUserId,
      nextCommunicateDate:dateStr,
      nextCommunicateDateEnd:dateStr,
      opportunityLevel
    });
    // console.log('recordCommunication!!!!!!!');
  }

  componentDidMount() {
    var todayTask = this.props.todayTask;
    if (!todayTask.justReceiveTalkLibs || todayTask.talkLibItems.length == 0)
      this.props.actions.getTodayTaskTalkLib();
  }

  switchTip(e){
    this.setState({selectedTip:e.target.getAttribute('data-tip')});
  }

  render(){
    var {phone,modelId} = this.props.data;
    var {talkLibItems} = this.props.todayTask;
    var selectedTip = this.state.selectedTip;
    console.log('@@@ PhonePanel', talkLibItems, phone, modelId);

    var tipsView ='', tipContentView = '',len = talkLibItems.length;
    if(len > 0){
      if(!selectedTip) selectedTip = talkLibItems[0].tipCaption;//默认选中第一个
      tipsView = talkLibItems.map((val, idx)=> {
        var {tipCaption, modelId_tipContent_} = val;
        if(tipCaption == selectedTip){
          var content = modelId_tipContent_[modelId];
          if(!content)content = modelId_tipContent_['0'];
          tipContentView = <div className="tipContent" dangerouslySetInnerHTML={{__html:content}}></div>;
          return <div key={idx} data-tip={tipCaption} style={tipItemActiveSt} onClick={this.switchTip}>{tipCaption}</div>;
        } else return <div key={idx} data-tip={tipCaption} style={tipItemSt} onClick={this.switchTip}>{tipCaption}</div>;
      });
    }

    return (
      <div className="today-task-tp">
        <div className="tipWrapper">
          <div style={{width: tipWidth * len, height: 55, overflowY:'hidden'}}>
            {tipsView}
          </div>
        </div>
        {tipContentView}
        <div className="tipFooter">
          <a className="cancelBtn" onClick={()=>Popup.hide()}>取消</a>
          <a className="confirmBtn" href={"tel:"+phone} onClick={this.recordCommunication}>外呼</a>
        </div>
      </div>
    );
  }
}

export default connect(
  state=> ({
    todayTask: state.todayTask,
  }),
  dispatch => ({actions: bindActionCreators(actions, dispatch)})
)(PhonePanel)