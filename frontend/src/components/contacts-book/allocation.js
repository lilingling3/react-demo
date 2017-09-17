import React, { Component } from 'react';
import { connect } from 'react-redux';
import './allocation.css';
import { bindThis, getAppViewHeight } from '../../base/common-func';
import Modal from 'antd-mobile/lib/modal';
export default class Allocation extends Component {
  constructor(props, context) {
    super(props, context);
    this.state = {
      inputValue: {}
    }
    bindThis(this, ['_Clear', '_getSum', '_submit', '_getList', '_changeValue']);
  }

  _Clear() {
    let inputValue = this.state.inputValue;
    for (var i in inputValue) {
      delete inputValue[i];
    }
    this.setState({});
  }

  _submit() {
    let sum = this._getSum();
    if (sum != this.props.selectList.length) {
      return Modal.alert('分配数量应和可分配数量一致');
    } else {
      let inputValue = this.state.inputValue;
      var distributeeAndCountList = [];
      for (var i in inputValue) {
        distributeeAndCountList.push({ distributionPeopleId: i, count: inputValue[i] });
      }
      //distributionType SP 代表店销员
      this.props._allocationAccount({ distributeeAndCountList: distributeeAndCountList, distributionSupervisorId: this.props.common.login.id,
        distributionType: 'SP', distributionOpportunityIds: this.props.selectList.toString() });
    }
  }
  _getSum() {
    var inputValue = this.state.inputValue;
    var sum = 0;
    for (var i in inputValue) {
      if (inputValue[i]) sum += inputValue[i];
    }
    return sum;
  }

  _changeValue(e) {
    console.log('2222222ashdbwhdsj');
    var value = e.target.value;
    var id = e.target.dataset.id;
    if (value == '' || parseInt(value) == value) {
      this.state.inputValue[id] = parseInt(value);
    }
    this.setState({});
  }


  _getList(accountList) {
    return accountList.map((item, idx) => {
      return (<li key={idx} className='clearfix'><span className='col-sm-4'>{item.nameCn}</span><input data-id={item.id} value={this.state.inputValue[item.id] ? this.state.inputValue[item.id] : ''} onChange={this._changeValue} className='col-sm-5' type='text' /></li>)
    })
  }
  _getAccountForRole(account, role) {
    role = role.toString();
    var accountList = [];
    if (role.indexOf(2) > -1) {
      account.forEach((item) => {
        if (item.role.indexOf(2) > -1 || item.role.indexOf(4) > -1) {
          accountList.push(item);
        }
      })

    }
    else if (role.indexOf(1) > -1)
      accountList = account;

    return accountList;

  }

  render() {
    let { selectList, _popHid } = this.props;
    let { account, role } = this.props.common.login;
    let accountList = this._getAccountForRole(account, role);
    return (
      <div className='allocation' style={{ height: getAppViewHeight(), overflowY: 'auto' }}>
        <p>可分配的销售线索：{this._getSum()}/{selectList.length} <span onClick={_popHid}>关闭</span></p>
        <p>请输入想要分配的销售线索数量</p>
        <div className='gAccountBox'>
        <ul>
          {this._getList(accountList)}
          <div className='popOperate clearfix'>
            <p className='col-sm-6'><span onClick={this._Clear}>清空</span></p>
            <p className='col-sm-6'> <span onClick={this._submit} className='active'>确认</span></p>
          </div>

        </ul>
        </div>
      </div>
    );
  }

}