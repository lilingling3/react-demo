/**
 * Created by zhongzhengkai on 2017/5/20.
 */

import React,{Component} from 'react';
import {bindActionCreators} from 'redux';
import {bindThis, getCSSPixelHeight, getCSSPixelWidth, sendSMS, shareTextToWXSession, getSysPlatform} from '../../base/common-func';
import {sendCommunicationHistory} from '../../base/api';
import ActionSheet from 'antd-mobile/lib/action-sheet';
import {connect} from 'react-redux';
import * as actions from '../../actions/today-task';
import './msg-panel.css';
import Toast from 'antd-mobile/lib/toast';
import SidebarBox from '../common/side-bar-box';
import {appHistory} from '../app';
import moment from 'moment';

var tipWidth = parseInt(getCSSPixelWidth() / 3);
const tipItemActiveSt = {
  display: 'inline-block', boxSizing: 'border-box', width: tipWidth, lineHeight: '45px', height: 50,color:'black',
  borderBottom: '5px solid #515151', textAlign: 'center',overflowX:'hidden',verticalAlign:0
};
const tipItemSt = {
  display: 'inline-block', boxSizing: 'border-box', width: tipWidth, lineHeight: '45px', height: 50,
  textAlign: 'center',overflowX:'hidden',verticalAlign:0,borderBottom:'5px solid lightgray'
};


class TalkLibPanel extends Component{

  constructor(props, context) {
    super(props, context);
    this.state = {selectedCaption: '',  selectedTipIdx: -1,  selectedTipContent: ''};
    bindThis(this, ['switchTip', 'confirm'])
  }

  confirm(){
    var {selectedCaption, selectedTipIdx, selectedTipContent} = this.state;
    if(selectedCaption!='' && selectedTipIdx!=-1){
      this.props.onTipSelect(selectedTipContent);
      ActionSheet.close();
    }else{
      Toast.info('无选中内容',1)
    }
  }

  switchTip(e){
    this.setState({selectedCaption:e.currentTarget.getAttribute('data-tip'), selectedTipIdx: -1})
  }

  render() {
    console.log('%c@@@ TalkLibPanel', 'color:green');
    var {talkLibItems, modelId, common, type} = this.props;
    var {selectedTipIdx, selectedCaption} = this.state;
    var product = common._dictDataMap.product;

    var tipsView = '', tipContentView = '', len = talkLibItems.length;
    var wantedLen = len;
    if (len > 0) {
      if (!selectedCaption) {
        selectedCaption = talkLibItems[0].tipCaption;
        this.state.selectedCaption = selectedCaption;
      }
      tipsView = talkLibItems.map((val, itemIdx)=> {
        var {tipCaption, modelId_tips_} = val;
        var key = modelId;
        if (modelId && product[modelId].groupModel)key = product[modelId].groupModel;
        var tips = modelId_tips_[key];
        if(!tips && type == '3')tips = modelId_tips_['0'];//话术库找不到具体的可以使用默认的

        if (tips) {
          if (tipCaption == selectedCaption) {
            tipContentView = tips.map((tip, tipIdx)=> {
              var icon;
              if (selectedTipIdx == tipIdx) icon = <label className="iconfont icon-gou gou"/>;
              // if(selectedTipIdx==tipIdx) icon= <SelectIcon />;
              else icon = <label className="iconfont icon-yuan1 quan"/>;

              return (
                <div key={tipIdx} className="tipBox" onClick={()=> {
                  this.setState({selectedTipIdx: tipIdx, selectedTipContent: tip.content})
                }}>
                  <div className="tipSelectBox">
                    {icon}
                    <label style={{fontWeight: 800}}>{tip.title}</label>
                  </div>
                  <div className="tipContentBox">
                    <p>{tip.content}</p>
                  </div>
                </div>
              );
            });

            return <div key={itemIdx} data-tip={tipCaption} style={tipItemActiveSt} onClick={this.switchTip}>{tipCaption}</div>;
          } else return <div key={itemIdx} data-tip={tipCaption} style={tipItemSt} onClick={this.switchTip}>{tipCaption}</div>;
        } else {
          wantedLen--;
        }

      });
    }

    if (!tipContentView)tipContentView = this.props.defaultMessage;
    return (
      <div className="talkLibPanelBox">
        <div className="headerBox">
          <div style={{width: tipWidth * wantedLen, height: 55, overflowX: 'auto'}}>
            {tipsView}
          </div>
        </div>
        <div className="contentBox">
          {tipContentView}
        </div>
        <div className="footerBox">
          <a className="cancelBtn" onClick={()=>ActionSheet.close()}>取消</a>
          <a className="confirmBtn" onClick={this.confirm}>确认</a>
        </div>
      </div>
    );
  };

}

const record = (data, msgText, content)=>{
  var dateStr = moment().format('YYYY-MM-DD HH:mm:ss');
  if(Array.isArray(data)){
    data.forEach(val=>{
      var {opportunityId,dealerUserId,status,opportunityLevel} = val;
      sendCommunicationHistory({
        opportunityId,
        followUpPersonId:dealerUserId,
        statusAfter:status,
        statusBefore:status,
        status,
        contactTime:dateStr,
        communicateStatus:1,
        communicateContent:content,
        thisCommunicateDescription:msgText,
        salesConsultantId:dealerUserId,
        nextCommunicateDate:dateStr,
        nextCommunicateDateEnd:dateStr,
        opportunityLevel
      });
    })
  }else{
    var {opportunityId,dealerUserId,status,opportunityLevel} = data;
    sendCommunicationHistory({
      opportunityId,
      followUpPersonId:dealerUserId,
      statusAfter:status,
      statusBefore:status,
      status,
      contactTime:dateStr,
      communicateStatus:1,
      communicateContent:content,
      thisCommunicateDescription:msgText,
      salesConsultantId:dealerUserId,
      nextCommunicateDate:dateStr,
      nextCommunicateDateEnd:dateStr,
      opportunityLevel
    });
  }

};

class MsgPanel extends Component{

  constructor(props, context){
    super(props, context);
    this.state = {msgText:''};
    bindThis(this,['showTalkLibPanel','handleTipSelect','handleMsgTextChange','sendMsgText','sendWXText']);
  }

  componentWillUpdate(){
    this.state.msgText = '';
  }

  sendMsgText(e){
    e.preventDefault();
    var data = this.props.data;
    var phones = [];
    if(Array.isArray(data))data.forEach(val=> phones.push(val.phone));
    else phones = [data.phone];

    var {msgText} = this.state;
    // return record(data,msgText);
    // alert(JSON.stringify(data));
    if(msgText){
      //!!! 安卓和IOS分别要走这两种不同的方法
      if(getSysPlatform()=='IOS'){
        sendSMS(phones, msgText, (err, isSendSuccess)=>{
          if(isSendSuccess)record(data, msgText,'一键短信');
        });
      }else{
        var phoneStr = phones.join(',');
        this.refs.smsAnchor.href = 'sms:'+phoneStr+'?body='+msgText;
        this.refs.smsAnchor.click();
        record(data, msgText,'一键短信');
      }
    }else Toast.info('无发送内容',1);
  }

  sendWXText(){
    var {msgText} = this.state;
    if(msgText){
      shareTextToWXSession(msgText,(err)=>{
        if(!err){
          var data = this.props.data;
          record(data, msgText, '一键微信');
        }
      });
    }else Toast.info('无发送内容',1);
  }

  handleTipSelect(tipContent){
    var selectionStart = this.refs.inputArea.selectionStart;//光标位置
    var msgText = this.state.msgText;
    var part1 = msgText.substring(0,selectionStart);
    var part2 = msgText.substring(selectionStart,msgText.length);
    msgText = part1+tipContent+part2;
    var common = this.props.common;

    /*
     【客户姓名】
     【先生／女士】
     【销售顾问姓名】
     【销售顾问电话】
     【关注车型】
     【4S店名称】
     【4S店地址】
     */
    var {modelId, data} = this.props;
    if(!modelId) modelId = data.modelId;

    var name = '', gender = '', needReplaceGender = true;
    if (Array.isArray(data)) {
      needReplaceGender = false;
    } else {
      var {name, gender} = data;
    }

    let {dealer, sys_role, geography, product} = common._dictDataMap;

    if(name)msgText = msgText.replace(/【客户姓名】/gi,name);

    if(needReplaceGender){
      var genderLabel = gender=='1' ? '先生' : '女士';
      msgText = msgText.replace(/【先生／女士】/gi,genderLabel);
    }

    var dealerName = common.login.nameCn;
    msgText = msgText.replace(/【销售顾问姓名】/gi,dealerName);

    var modelData = product[modelId];
    if(modelId && modelData){
      msgText = msgText.replace(/【关注车型】/gi,modelData.nameCn);
    }

    var dealerTel = common.login.loginName;
    msgText = msgText.replace(/【销售顾问电话】/gi,dealerTel);

    var dealerInfo = dealer[common.login.dealerId];
    // var selfOccupation = sys_role[common.login.role[0]].nameCn;//职位
    var dealerAddress = geography[dealerInfo.provinceId].nameCn + ' '
      + geography[dealerInfo.cityId].nameCn + ' '
      + dealerInfo.addressCn;
    var dealerStoreName = dealerInfo.nameCn;//经销商所属的4S店地址

    msgText = msgText.replace(/【4S店名称】/gi,dealerStoreName);
    msgText = msgText.replace(/【4S店地址】/gi,dealerAddress);

    this.setState({msgText});
  }

  handleMsgTextChange(e){
    this.setState({msgText:e.target.value});
  }

  componentDidMount(){
    var {justReceiveTalkLibs,talkLibItemsOfType1,talkLibItemsOfType3} = this.props.todayTask;
    if (justReceiveTalkLibs && talkLibItemsOfType1.length != 0 && talkLibItemsOfType3.length != 0) {
    } else {
      this.props.actions.getTodayTaskTalkLib();
    }
  }

  showTalkLibPanel(e){
    var type = e.currentTarget.getAttribute('data-type');
    var tackLibPanel;
    var {todayTask, modelId, common, data} = this.props;
    if (!modelId)modelId = data.modelId;
    if (type == '1') {
      tackLibPanel = <TalkLibPanel type="1" common={common} talkLibItems={todayTask.talkLibItemsOfType1} modelId={modelId}
                                   defaultMessage="无产品力" onTipSelect={this.handleTipSelect} />;
    } else {
      tackLibPanel = <TalkLibPanel type="3" common={common} talkLibItems={todayTask.talkLibItemsOfType3} modelId={modelId}
                                   defaultMessage="无话术库" onTipSelect={this.handleTipSelect} />;
    }

    ActionSheet.showActionSheetWithOptions({
      options: [],
      message: tackLibPanel,
      maskClosable: false
    });
  }

  render(){
    var {common,modelId} = this.props;

    // var {talkLibItemsOfType1,talkLibItemsOfType3} = this.props.todayTask;
    console.log('@@@ MsgPanel');

    var productObj = common._dictDataMap.product[modelId];
    var modelLabel = '';
    if(productObj) modelLabel = productObj.nameCn;

    var footer = '',herderTitle = '一键短信/微信';
    if(this.props.msgOnly){
      herderTitle = '一键短信';
      footer = (
        <div className="footer">
          <label className="iconfont icon-unselectduanxin msgIconOnly" onClick={this.sendMsgText}>
            <label className="iconText">短信发送</label>
          </label>
          <a ref="smsAnchor"/>
        </div>
      );
    }else{
      footer = (
        <div className="footer">
          <label className="iconfont icon-weixin2 weixinIcon" onClick={this.sendWXText}>
            <label className="iconText">微信发送</label>
          </label>
          <label className="iconfont icon-unselectduanxin msgIcon" onClick={this.sendMsgText}>
            <label className="iconText">短信发送</label>
          </label>
          <a ref="smsAnchor"/>
        </div>
      );
    }

    return (
      <SidebarBox onHeaderClick={this.props.onHeaderClick} headerTitle={herderTitle}>
        <div className="today-task-mp">
          <div className="selector-box">
            <label className={"selector-item active"}>
              话术库素材
            </label>
            <label className={"selector-item"} onClick={()=>appHistory.push('/article-list')}>
              内容营销素材
            </label>
          </div>
          <div className="selector" data-type="3" onClick={this.showTalkLibPanel}>
            请选择话术库 <i className="iconfont icon-xiangyou" />
          </div>
          <div className="selector" data-type="1" onClick={this.showTalkLibPanel}>
            添加{modelLabel}产品力 <i className="iconfont icon-xiangyou" />
          </div>
          <textarea ref="inputArea" className="inputArea" placeholder="信息预览" value={this.state.msgText} onChange={this.handleMsgTextChange} />
          {footer}
        </div>
      </SidebarBox>
    );
  }
}

export default connect(
  state=> ({
    todayTask: state.todayTask,
    common: state.common
  }),
  dispatch => ({actions: bindActionCreators(actions, dispatch)})
)(MsgPanel)
