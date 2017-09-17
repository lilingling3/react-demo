/**
 * Created by guohuiru on 2017/6/06.
 */
import React, { Component } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import * as actions from '../../actions/contact-book';
import { contains, bindThis, getCurrentQuery } from '../../base/common-func';
import CreateCustomer from './../contacts-book/customer-detail/create-customer.js';
import './index.css';
import Modal from 'antd-mobile/lib/modal';
import { appHistory } from './../app'
import {buildLicenseInfoLink} from '../../reducers/common';

class NewContact extends Component {

  constructor(props, context) {
    super(props, context);
    this.state = {from: ''};
    var query = getCurrentQuery();
    if(query.from)this.state.from = query.from;
  }


  componentWillMount() {
    let { dealerId, role } = this.props.common.login;
    if (role.indexOf(2) > -1 || role.indexOf(1) > -1) {
      this.props.actions._getAccountRole(dealerId);
    }
  }

  componentWillReceiveProps(nextProps) {
    console.log('aaaa');
    let { opportunityId, contactDetail, insertMsg } = nextProps.newContact;
    if (parseInt(opportunityId) > 0) {
      if(contactDetail.status == 3){//是否已到店选择 '是'
        var common = this.props.common;
        var dealerId = common.login.dealerId;
        var license_info_LINK = common._dictDataMap.license_info_LINK;
        // alert(Object.keys(common._dictData.license_info));
        // alert(common._dictData.license_info['9']);
        if (Object.keys(license_info_LINK).length == 0)buildLicenseInfoLink(common._dictData.license_info, common._dictDataMap);
        if(license_info_LINK[dealerId]){
          Modal.alert('', '客户新建成功,赶快带客户试乘试驾吧', [
            { text: '完成', onPress: () => console.log('cancel') },
            { text: '立即试驾', onPress: () => appHistory.push('/test-ride-drive', { opportunityId, step: 2, contactDetail, from: 'create' }), style: { fontWeight: 'bold' } },
          ])
        }else{
          //!!! 创建好客后，要引导这个户口去试乘试驾的，但是如果这个经销商没有路线数据，就会这样
          Modal.alert('', '客户新建成功,dealerId:' + dealerId + ' 暂无路线信息，不能去试乘试驾!', [
            { text: '完成', onPress: () => console.log('cancel') },
          ])
        }
      }else{
        Modal.alert('', '客户新建成功', [
          { text: '完成', onPress: () => console.log('cancel') }
        ])
      }
    }
    nextProps.newContact.opportunityId = '';

    if (insertMsg) {
      Modal.alert(insertMsg);
      nextProps.newContact.insertMsg = '';
    }
  }

  //??? 顶层组件 props的传递与约束
  render() {
    let accountList = this.props.contactsBook.accountList;
    let from = this.state.from;
    var dom = <div></div>;
    if (accountList) {
      if (this.props.myCareCustomer == undefined) {
        dom = <CreateCustomer common={this.props.common} newContact={this.props.newContact}  mobilePhone={this.props.mobilePhone} accountList={accountList} from={from}
                              _checkDataStatus={this.props.actions._checkDataStatus} _insertCustomerInfo={this.props.actions._insertCustomerInfo} isCreate={true} />;
      } else {
        dom = <CreateCustomer myCareCustomer={this.props.myCareCustomer} myCareId={this.props.myCareId} mobilePhone={this.props.mobilePhone} common={this.props.common}
                              newContact={this.props.newContact} accountList={accountList} _checkDataStatus={this.props.actions._checkDataStatus}
                              _insertCustomerInfo={this.props.actions._insertCustomerInfo} isCreate={true} from={from} />;
      }
    }
    return (
      <div className='newContact'>
        {dom}
      </div>
    );
  }

}

export default connect(
  state => ({
    common: state.common,
    newContact: state.newContact,
    contactsBook: state.contactsBook
  }),
  dispatch => ({
    actions: bindActionCreators(actions, dispatch)
  })
)(NewContact)

