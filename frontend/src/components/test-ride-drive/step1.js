import React, { Component } from 'react';
import { connect } from 'react-redux';
import { bindThis, checkPhone } from '../../base/common-func';
import Modal from 'antd-mobile/lib/modal';
export default class TestRideDriveStep1 extends Component {

  constructor(props, context) {
    super(props, context);
    this.state = {
      mobilePhone: ''
    };
    bindThis(this, ['_submit', '_changeValue']);
  }

  _submit() {
    let mobilePhone = this.state.mobilePhone;
    let login = this.props.login;
    if(mobilePhone)mobilePhone = mobilePhone.replace(/-/g,'');//允许复制过来的带-的电话也能提交
    if (!checkPhone(mobilePhone))
      return Modal.alert('请输入正确的电话号码!');
    let postData = ({ mobilePhone, dealerId: login.dealerId, dealerUserId: login.id });
    this.props._checkDataStatus(postData);
  }

  _changeValue(e) {
    this.setState({ mobilePhone: e.target.value })
  }

  render() {
    return (
      <div className='gStep1'>
        <div className='selectInput clearfix'>
          <input type='text' value={this.state.mobilePhone} onChange={this._changeValue} placeholder='- - - 手机号码 - - -' data-type='mobilePhone' className='col-sm-12' />
          <span className='col-sm-12' > 输入客户手机号查找客户信息</span>
        </div>
        <span className='gSearchBtn' onClick={this._submit} >新增试乘试驾</span>
      </div>
    );
  }

}