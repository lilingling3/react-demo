/**
 * Created by guohuiru on 2017/6/11.
 */

import React, {Component} from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { bindThis, getCurrentQuery, definePageLeaveHandler } from '../../base/common-func';
import Modal from 'antd-mobile/lib/modal';
import Popup from 'antd-mobile/lib/popup';

import './testRideDrive.css';
import * as actions from '../../actions/test-ride-drive';
import * as contactActions from '../../actions/contact-book';
import TestRideDriveStep1 from './step1';
import TestRideDriveStep2 from './step2';
import TestRideDriveStep3 from './step3';
import TestRideDriveStep4 from './step4';
import TestRideDriveStep5 from './step5';
import TestRideDriveStep6 from './step6';
import TestRideDriveStep9 from './step9';
import Toast from 'antd-mobile/lib/toast';


import { appHistory } from './../app'

function getInitialState() {
  return {
    id: '',
    opportunityId: '',
    dealerId: '',
    dealerUserId: '',
    dealerUserName: '',
    modelId: '',
    modelDesc: '',
    nameEn: '',
    nameCn: '',
    moblie: '',
    routeId: '',
    routeDesc: '',
    type: '1',
    typeDesc: '',
    drivingLicenseUrl: '',
    drivingLicenseNo: '',
    signatureUrl: '',
    durationTime: '',
    durationMileage: '',
    contractUrl: '',
    contractNewUrl: '',
    email: '',
    status: '',
    category: '',
    isFinish: 0,
    contractCreateDate: ''

  };
}

class TestRideDrive extends Component {

  constructor(props, context) {
    super(props, context);
    this.state = { step: 1, needLockNameAndPhone: false };
    if (props.step) this.state.step = props.step;
    bindThis(this, ['_setStep', 'onShow', 'onPageLeave']);
    definePageLeaveHandler('/test-ride-drive', this.onPageLeave);
  }

  onPageLeave(cb) {
    console.log('%c------ onPageLeave ------', 'color:red');
    Modal.alert('确定离开试乘试驾？', '', [{
      text: '确认', onPress: () => {
        cb(true);
      }
    }, {
      text: '取消', onPress: () => {
        cb(false);
      }
    }]);
  }

  componentWillReceiveProps(nextProps) {
    console.log('aaaa');//, mobile, opportunityId, modelId
    var testRideDrive = nextProps.testRideDrive;
    let { nameCn, opportunityId, status} = testRideDrive.driveDetail;

    if (testRideDrive.answerMsg || testRideDrive.scoreMsg) {//原来的逻辑，这个为true，表示答题完毕提交成功要跳转出去了
      // Modal.alert(nextProps.testRideDrive.answerMsg);
      // testRideDrive.answerMsg = '';
      // return this.onShow(opportunityId);
      if(testRideDrive.scoreMsg){
        testRideDrive.answerMsg = '';
        testRideDrive.scoreMsg = '';
        this.onShow(opportunityId);
      }else{
        this.state.step = 9;//打分面板
      }

    }else{

      if (testRideDrive.uploadMsg) {
        Modal.alert(testRideDrive.uploadMsg);
        if (testRideDrive.driveDetail.dealerId && this.state.step == 2) {

        } else {
          testRideDrive.uploadMsg = '';
        }
      }
      if (testRideDrive.sendEmailMsg) {
        Modal.alert(testRideDrive.sendEmailMsg);
        testRideDrive.sendEmailMsg = '';
      }
      let step = this.state.step;

      if (!nameCn && step == 1 && (!testRideDrive.isHasContact || testRideDrive.checkPhoneMsg)) {
        if (testRideDrive.checkPhoneMsg) {
          Toast.info(testRideDrive.checkPhoneMsg);
          return testRideDrive.checkPhoneMsg = '';
        } else if (!testRideDrive.isHasContact) {
          testRideDrive.isHasContact = true;
          var mobile = testRideDrive.driveDetail.mobile;
          Modal.alert('', '不存在该客户，是否立即建档？', [
            { text: '取消', onPress: () => console.log('cancel') },
            { text: '确定', onPress: () => appHistory.push('/new-contact', {from:'testDriveBtn'}, {mobilePhone: mobile}), style: { fontWeight: 'bold' } },
          ])
        }

      } else {
        /*
         signatureUrl: 客户签名
         duserSignatureUrl: 销售签名
         scoreSignatureUrl: 打分步骤客户签名
         scoreDuserSignatureUrl: 打分步骤销售签名
         */
        var driveDetail = testRideDrive.driveDetail;
        if (step == 1 && nameCn) {
          console.log('-------------------',status);
          this.state.needLockNameAndPhone = true;
          if(status != '10')this.state.step = 2;//!!! 判断10 很重要
          else Modal.alert('未到店客户不可试乘试驾，请先在跟进操作中更改潜客状态为首次到店后再试！');
        } else if (driveDetail.signatureUrl && (step == 4 || step == 4.1)) {
          if (!driveDetail.duserSignatureUrl || step == 4) {//处于第4步，也可以走4.1，有可能是继续中回退重签
            this.state.step = 4.1;//继续进行 销售签名
          } else {
            this.state.step = 3.1;
          }
        } else if (driveDetail.durationTime && step == 5) {
          this.state.step = 6;
        } else if (driveDetail.contractCreateDate && step == 3) {
          this.state.step = 4;//
        } else if (driveDetail.dealerId && step == 2) {
          if (testRideDrive.uploadMsg) {
            testRideDrive.uploadMsg = '';
          } else {
            this.state.step = 3;
          }
        }

      }
      if (this.props.testRideDrive.questions.toString() != testRideDrive.questions.toString()) {
        this.state.step = 6;
      }

    }

  }

  onShow(customerId) {
    appHistory.push('/contactsBook', { from: 'testRideDrive', customerId });
    // Popup.show(<div className='testDriveDetail' style={{ height: getAppViewHeight(), overflowY: 'auto' }}><ContactDetail _updateCustomerInfo={this.props.actions._updateCustomerInfo} from='testDrive' _keepUp={this.props.actions._keepUp} common={this.props.common} customerDetail={customerDetail} _onPanelClose={() => Popup.hide()} /></div>);
  }

  componentWillMount() {
    console.log(2222);
    let parms = getCurrentQuery();
    let { id, dealerId } = this.props.common.login;

    if (parms && (parms.from == 'create' || parms.step == 2)) {
      let detail = getInitialState();
      if (parms.step == 2) {
        this.state.from = 'cusDetail';
        this.state.needLockNameAndPhone = true;
      }
      let { mobilePhone, name, modelId, opportunityId, status } = parms.contactDetail;
      detail.mobile = mobilePhone;
      detail.nameCn = name;
      detail.modelId = modelId;
      detail.opportunityId = parms.opportunityId ? parms.opportunityId : opportunityId;
      detail.dealerUserId = id;
      detail.dealerId = dealerId;
      detail.status = status;//这个值很重要，要来判断是否真的能够开始走试驾协议流程
      this.props.testRideDrive.driveDetail = detail;
      this._setStep(2);
    }
    if (parms && parms.from == 'cusDetail') {
      let { driveDetail, step } = parms;
      if (step != 2) {
        this.props.testRideDrive.driveDetail = driveDetail;
        this.state.from = 'cusDetail';
        this.state.fromStep = step;
        if (step == 7) step = 3.1;
        if (step == 8) step = 6;
        this._setStep(step);
      }
    }
  }

  componentWillUnmount() {
    console.log('-------------------->componentWillUnmount');
    this.props.testRideDrive.driveDetail = getInitialState();
    this.props.testRideDrive.cardTimes = 0;
    this.props.testRideDrive.questionAnswerList = {};
    this.props.testRideDrive.questions = [];
  }

  _setStep(num) {
    var step = this.state.step;
    if (num < step){//!!! 防止回退后，下一步逻辑直接跳到第9步
      this.props.testRideDrive.answerMsg = '';
      this.props.testRideDrive.scoreMsg = '';
    }
    this.setState({ step: num });
  }

  render() {
    console.log('%cTestRideDrive', 'color:green');
    let { step, from, fromStep, needLockNameAndPhone } = this.state;
    let testRideDrive = this.props.testRideDrive;
    let { common, actions, contactsBook } = this.props;
    var driveDetail = JSON.parse(JSON.stringify(testRideDrive.driveDetail));

    return (
      <div className='gTestDrive' >
        <i className={from == 'cusDetail' ? "iconfont icon-xiangzuo2 headerIconForTestDrive" : 'hid'} onClick={() => { this.onShow(driveDetail.opportunityId) }} />
        {step == 1 ? <TestRideDriveStep1 _checkDataStatus={actions._getContactInfoByPhone} login={common.login} /> : ''}
        {step == 2 ? <TestRideDriveStep2 actions={actions} cardTimes={testRideDrive.cardTimes} testDriveDetail={driveDetail} common={common} _setStep={this._setStep} needLockNameAndPhone={needLockNameAndPhone} /> : ''}
        {step == 3 || step == 3.1 ? <TestRideDriveStep3 _downloadPDF={actions._downloadPDF} from={from} fromStep={fromStep} testDriveDetail={driveDetail} _updateTestDriveInfo={actions._updateTestDriveInfo} common={common} _setStep={this._setStep} step={step} /> : ''}
        {step == 4 || step == 4.1? <TestRideDriveStep4 testDriveDetail={driveDetail} common={common} _updateTestDriveInfo={actions._updateTestDriveInfo} _setStep={this._setStep} step={step} /> : ''}
        {step == 5 ? <TestRideDriveStep5 _updateTestDriveInfo={actions._updateTestDriveInfo} testDriveDetail={driveDetail} _setStep={this._setStep} /> : ''}
        {step == 6 ? <TestRideDriveStep6 from={from} step={step} fromStep={fromStep} _getCustomerInfo={actions._getCustomerInfo} questions={testRideDrive.questions} actions={actions} testRideDrive={testRideDrive} _setStep={this._setStep} /> : ''}
        {step == 9 ? <TestRideDriveStep9 testRideDrive={testRideDrive} step={step} _updateTestDriveInfo={actions._updateTestDriveInfo}  _setStep={this._setStep} /> : ''}
      </div>
    );
  }

}

export default connect(
  state => ({
    common: state.common,
    home: state.home,
    contactsBook: state.contactsBook,
    testRideDrive: state.testRideDrive
  }),
  dispatch => ({
    actions: bindActionCreators({ ...actions, ...contactActions }, dispatch)
  })
)(TestRideDrive)


