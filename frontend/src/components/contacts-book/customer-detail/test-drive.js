import React, { Component } from 'react';
import { connect } from 'react-redux';
import { bindThis, bubbleSort } from '../../../base/common-func';
import './commnuicate-history.css'
import { appHistory } from './../../app'
import Toast from 'antd-mobile/lib/toast';
import Modal from 'antd-mobile/lib/modal';
import {buildLicenseInfoLink} from '../../../reducers/common';

export default class TestDrive extends Component {
  constructor(props, context) {
    super(props, context);
    this.state = {
      openTab: []
    };
    bindThis(this, ['_setOpen', '_getHistoryDom', '_toTestDrive']);
  }

  componentWillMount() {

  }

  _getType(code, type) {
    code = code ? code.toString() : '';
    let str = '';
    if (type == 'type') {
      if (code.indexOf(1) > -1) str += '试驾 ';
      if (code.indexOf(2) > -1) str += '试乘 ';
    }else if (type == 'route') {//code 指的是routeId
      let license_info = this.props.common._dictDataMap.license_info;
      str = license_info[code].nameCn;
    }
    return str;
  }

  _getStep(testDrive) {
    var step = 1;
    if (testDrive.isFinish == '1') {
      step = 7;
    } else {
      // alert(JSON.stringify(testDrive));
      if(testDrive.score == null){
        step = 9;
      }else step = 3;

      if (!testDrive.feedbackList || !testDrive.feedbackList.questionAnswerList || testDrive.feedbackList.questionAnswerList.length == 0) {
        step = 6
      }
      if (!testDrive.durationMileage) {
        step = 5;
      }

      if (!testDrive.signatureUrl) {
        step = 4;
      } else if (!testDrive.duserSignatureUrl) {
        step = 4.1;//第二次签名
      }

      if (!testDrive.signatureUrl && testDrive.contractCreateDate) {
        step = 3.1;
      }
      if (!testDrive.contractCreateDate) {
        step = 3;
      }

    }

    return step;
  }

  _toTestDrive(e) {
    var step = e.currentTarget.dataset.step;
    var common = this.props.common;
    var detail = {}, contactDetail = {};
    if (step != '2')
      detail = JSON.parse(e.currentTarget.dataset.detail);
    else {
      contactDetail = JSON.parse(JSON.stringify(this.props.customerDetail));
    }

    //!!! 做个安全检查，要不然跳转过去会报错
    var license_info_LINK = common._dictDataMap.license_info_LINK;
    //对license_info_LINK多做一道检查
    if(Object.keys(license_info_LINK).length == 0 )buildLicenseInfoLink(common._dictData.license_info,common._dictDataMap);
    var dealerId = common.login.dealerId;
    if(!license_info_LINK[dealerId]){
      return Modal.alert('dealerId:'+dealerId+'暂无路线数据，不能添加为该线索新增试乘试驾!');
    }

    //沟通历史里至少一条记录是首次到店，即statusAfter = 3, 就能够去试乘试驾
    var containsStatus3 = this.props.communicateHistory.some(val=> val.statusAfter == 3);

    //未到店，不能去试乘试驾的,或者 当前为5前一刻为10
    if (contactDetail.status == '10'
      || (contactDetail.status == '5' && contactDetail.statusBefore == '10')
      || (contactDetail.status == '1' && contactDetail.statusBefore == '10')
      || !containsStatus3
    ) {
      Modal.alert('未到店客户不可试乘试驾，请先在跟进操作中更改潜客状态为首次到店后再试！');
    } else {
      appHistory.push('/test-ride-drive', {'from': 'cusDetail', step, 'driveDetail': detail, contactDetail})
    }
  }

  _getHistoryDom(testDriveHistory) {
    let product = this.props.common._dictDataMap.product;
    let {openTab} = this.state;

    //!!! ios不认默认的sort，只能调用自己的sort函数了
    testDriveHistory = testDriveHistory.sort((a, b) => {
      return new Date(b.createDate).getTime() - new Date(a.createDate).getTime()
    });
    // bubbleSort(testDriveHistory, 'createDate', 'desc', (val)=>new Date(val).getTime());

    return testDriveHistory.map((item, idx) => {
      if (item.routeId) {//!!! 有些item值脏掉了,可能没有routeId值，后端的问题
        let step = this._getStep(item);
        var itemStr = JSON.stringify(item);
        return (
          <li key={idx}><b><i></i></b>
            <p>{item.createDate.substr(0, 10)} <span>来自：卖车宝</span></p>
            <div className='testDriveContent'>
              <p>体验项目：{this._getType(item.type, 'type')} </p>
              <p>试驾车型：{product[item.modelId].nameCn} </p>
              <p>试驾路线：{this._getType(item.routeId, 'route')} </p>
              <p>试驾打分：{item.score == null? '无':item.score } </p>
              {step == 7 ?
                <p><span onClick={this._toTestDrive} data-detail={itemStr} data-step={7}>查看试驾协议</span></p> : ''}
              {step == 7 ?
                <p><span onClick={this._toTestDrive} data-detail={itemStr} data-step={8}>查看试驾反馈</span></p> : ''}
              {step != 7 ? <p><span onClick={this.props.isMySelfContact ? this._toTestDrive : ()=> {
                Toast.info('你没有权限操作此数据')
              }} data-detail={JSON.stringify(item)} data-step={step}>继续</span></p> : ''}

            </div>
          </li>
        )
      } else {
        return '';
      }
    })
  }

  _setOpen(e) {
    let id = parseInt(e.currentTarget.dataset.id);
    let openTab = this.state.openTab;
    let idx = openTab.indexOf(id);
    if (idx > -1) {
      openTab.splice(idx, 1);
    } else openTab.push(id);
    this.setState({ openTab });
  }
  render() {
    let { testDriveHistory, common } = this.props;
    return (
      <div className="times gTestDriveHis">
        <ul className='testDriveHistory'>
          {this._getHistoryDom(testDriveHistory)}
        </ul>
        {this.props.isMySelfContact?<span className='gSearchBtn' data-step='2' onClick={this._toTestDrive}>新增试乘试驾</span>:''}
      </div>
    );
  }

}