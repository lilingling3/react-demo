/**
 * Created by guohuiru on 2017/5/15.
 */

import React, {
  Component
} from 'react';
import {
  connect
} from 'react-redux';
import {
  bindActionCreators
} from 'redux';
import * as actions from '../../../actions/home';
import { bindThis, checkValue, getStore, getSidebarStyle } from '../../../base/common-func';
import './contactDetail.css';
import KeepUp from './keep-up';
import TestDrive from './test-drive';
import LatentCustomer from './latent-customer';
import CommunicateHistory from './commnuicate-history'
import SelectIcon from './../../common/selectIcon';
import Modal from 'antd-mobile/lib/modal';
import { appHistory } from './../../app';
import Popup from 'antd-mobile/lib/popup';
import PhonePanel from '../../today-task/phone-panel';
import MsgPanel from '../../today-task/msg-panel';
import Sidebar from 'react-sidebar';
import Toast from 'antd-mobile/lib/toast';

const headerSt = {
  position: 'absolute', top: 0, width: '100%', height: 38, lineHeight: 2, textAlign: 'center',
  fontSize: '.4rem', color: 'white', backgroundColor: 'black', zIndex: 2
};
const sideBarSt = getSidebarStyle(20, 0);

export default class ContactDetail extends Component {

  constructor(props, context) {
    super(props, context);
    this.state = {
      customerDetail: {},
      tabType: 'keepUp',
      msgPanelOpen: false,
      slideVal: ''
    };
    bindThis(this, ['_getStatusDom', '_setType', '_callPhone', '_sendMsg', '_close', 'getSidebarDom', 'openMsgPanel',
      'closeMsgPanel','notYourContact']);
  }

  componentWillMount() {

    if (this.props.customerDetail.followUpMsg) {
      Modal.alert(this.props.customerDetail.followUpMsg);
      this.props.customerDetail.followUpMsg = '';
    }
    if (this.props.customerDetail.updateCustomerMsg) {
      Modal.alert(this.props.customerDetail.updateCustomerMsg);
      this.props.customerDetail.updateCustomerMsg = '';
      this.setState({ tabType: 'cusInfo' });
    }
    if (this.props.from == 'testDrive') {
      this.state.tabType = 'tryHistory';
    }
    this.setState({
      customerDetail: JSON.parse(JSON.stringify(this.props.customerDetail))
    });
    
    this.props._getAccountsRole(this.props.customerDetail.dealerId);
  }

  notYourContact(){
    Toast.info('你无权联系此联系人!',1);
  }

  _getStatusDom(customer_status, status) {
    var arrDom = [];
    var showIds = [1, 2, 3, 4, 8, 7, 6];
    showIds.forEach((i) => {
      arrDom.push(<div key={i}>
        <SelectIcon selected={status == i} className={'oppLevelCheckBox'} />
        <span>{i == 7 || i == 6 ? (i == 7 ? '成交' : '战败') : customer_status[i].statusName}</span>
      </div>)
    });
    return arrDom;
  }

  openMsgPanel() {
    this.setState({ msgPanelOpen: true, slideVal: 'slideInRight' });
  }

  closeMsgPanel() {
    this.setState({ msgPanelOpen: false, slideVal: 'slideOutRight' });
  }

  getSidebarDom() {
    let { mobilePhone:phone, name, status, opportunityId, opportunityLevel, dealerUserId, gender, modelId} = this.props.customerDetail;
    if(this.state.slideVal){
      return (
        <div className={"animated " + this.state.slideVal} style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, zIndex: 9999 }}>
          <MsgPanel key={Date.now()} data={{
            phone, name, status, opportunityId, opportunityLevel, dealerUserId:this.props.common.login.id, gender }}
                    modelId={modelId} store={getStore()} onHeaderClick={this.closeMsgPanel}
          />
        </div>
      );
    }else return '';
  }

  _setType(e) {
    this.setState({ tabType: e.currentTarget.dataset.type });
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.customerDetail.updateCustomerMsg) {
      Modal.alert(nextProps.customerDetail.updateCustomerMsg);
      nextProps.customerDetail.updateCustomerMsg = '';
    }

    if (nextProps.customerDetail.followUpMsg) {
      Modal.alert(nextProps.customerDetail.followUpMsg);
      nextProps.customerDetail.followUpMsg = '';
    }

    if (JSON.stringify(nextProps.customerDetail) != JSON.stringify(this.state.customerDetail)) {
      this.setState({ customerDetail: nextProps.customerDetail });
    }
  }

  _callPhone() {
    let {opportunityId,opportunityLevel,mobilePhone:phone,status} = this.props.customerDetail;
    Popup.show(<PhonePanel data={{opportunityId,opportunityLevel,phone,status,dealerUserId:this.props.common.login.id}} store={getStore()} openTag="tag2" />, { animationType: 'slide-up' });
  }

  _sendMsg() {
    let mobilePhone = this.props.customerDetail.mobilePhone;
    console.log(mobilePhone);
  }

  _close() {
    // if (this.props.from == 'testDrive')
    //   appHistory.push('/contactsBook');
    this.props._onPanelClose();
  }

  render() {
    let { customerDetail, tabType } = this.state;
    let {
      product,
      customer_status,
      opportunity_level,
      channel,
      product_sku,
    } = this.props.common._dictDataMap;
    let isMySelfContact = this.props.common.login.id == customerDetail.dealerUserId;

    //channelId 可能会是空的
    var channelTypeLabel = channel[customerDetail.channelId] ? channel[customerDetail.channelId].nameCn : '';

    return (
      <div className='contactDetail'>
        {this.getSidebarDom()}
        <div className='top' onClick={this._close}
          style={headerSt}>
          <span className="iconfont icon-xiangzuo2" style={{ fontSize: '.5rem' }} />
          <span>客户详情</span>
        </div>
        <div className='detail'>
          <section className='baseInfo clearfix'>
            <div className='col-sm-3'>
              <img src={'assets/image/intent-level/' + opportunity_level[customerDetail.opportunityLevel].titleEn + '.png'} />
              <span className='name'>{customerDetail.name}</span>
            </div>
            <div className='col-sm-9 oppInfo'>
              <p><span>意向车型：</span><span>{checkValue(product[customerDetail.modelId], 'nameCn')}</span></p>
              <p><span>意向车款：</span><span>{checkValue(product[customerDetail.styleId], "nameCn")}</span></p>
              <p><span>意向车型颜色：</span><span>{customerDetail.carColorId ? product_sku[customerDetail.carColorId].nameCn : ''}</span></p>
              <p><span>来源渠道类型：</span><span>{channelTypeLabel}</span></p>
            </div>
          </section>
          <section className='chat'>
            <div className='clearfix'>
              <p className='col-sm-4 iconfont icon-dianhua' onClick={isMySelfContact?this._callPhone:this.notYourContact}>电话</p>
              <p className='col-sm-4 iconfont icon-duanxin1' onClick={isMySelfContact?this.openMsgPanel:this.notYourContact}>短信</p>
              <p className='col-sm-4  iconfont icon-weixin' onClick={isMySelfContact?this.openMsgPanel:this.notYourContact}>微信</p>
            </div>
          </section>
          <section className='status'>
            {this._getStatusDom(customer_status, customerDetail.status)}
          </section>
          <section className='cusTab clearfix'>
            <span onClick={this._setType} data-type="keepUp" className={(tabType == 'keepUp' ? 'active' : '') + ' col-sm-3'}>跟进操作</span>
            <span onClick={this._setType} data-type="cusInfo" className={(tabType == 'cusInfo' ? 'active' : '') + ' col-sm-3'}> 潜客信息</span>
            <span onClick={this._setType} data-type="comHistory" className={(tabType == 'comHistory' ? 'active' : '') + ' col-sm-3'}>沟通历史</span>
            <span onClick={this._setType} data-type="tryHistory" className={(tabType == 'tryHistory' ? 'active' : '') + ' col-sm-3'}>试驾历史</span>
          </section>

          {tabType == 'keepUp' ? <KeepUp isMySelfContact={isMySelfContact} from={this.props.from} customerDetail={customerDetail} common={this.props.common} _keepUp={this.props._keepUp} /> : ''}
          {tabType == 'comHistory' ?
            <CommunicateHistory communicateHistory={customerDetail.communicateHistory} common={this.props.common} /> : ''
          }
          {tabType == 'tryHistory' ?
            <TestDrive isMySelfContact={isMySelfContact} communicateHistory={customerDetail.communicateHistory}
                       testDriveHistory={customerDetail.testDriveHistory} customerDetail={customerDetail} common={this.props.common} /> : ''
          }
          {tabType == 'cusInfo' ? <LatentCustomer isMySelfContact={isMySelfContact} _updateCustomerInfo={this.props._updateCustomerInfo} customerDetail={customerDetail} common={this.props.common} /> : ''}

        </div>
      </div>
    );
  }

}

