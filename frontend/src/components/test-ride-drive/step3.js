import React, { Component } from 'react';
import { connect } from 'react-redux';
import { bindThis, checkPhone, checkEmail, printProtocol, print } from '../../base/common-func';
import Modal from 'antd-mobile/lib/modal';
import Toast from 'antd-mobile/lib/toast';
import SelectIcon from './../common/selectIcon';
import moment from 'moment';
import {LS_EMAIL} from '../../constants';

const prompt = Modal.prompt;
export default class TestRideDriveStep3 extends Component {
  constructor(props, context) {
    super(props, context);
    this.state = {
      isRead: false,
      isShowSendEmail: false
    }
    bindThis(this, [ '_changeValue', '_sendEmail', '_showEmail', '_printProtocol', '_submitDate']);
  }


  componentWillReceiveProps(nextProps) {
    console.log('aaaaaaaaaaaaaaaa');
    if (JSON.stringify(nextProps.testDriveDetail) != JSON.stringify(this.state.testDriveDetail)) {
      this.state.testDriveDetail = JSON.parse(JSON.stringify(nextProps.testDriveDetail));
      this.setState({});
    }
  }
  // _submit() {
  //   let mobilePhone = this.state.mobilePhone;
  //   let login = this.props.login;
  //   if (!checkPhone(mobilePhone))
  //     return Modal.alert('请输入正确的电话号码!');
  //   let postData = ({ mobilePhone, dealerId: login.dealerId, dealerUserId: login.id });
  //   this.props._checkDataStatus(postData);

  // }

  _getType(code, type) {
    code = code.toString();
    let str = '';
    if(code){//!!! 新增试乘试驾跳过来时，是没有routeId的，所有提前拦截判断下
      if (type == 'type') {
        if (code.indexOf(1) > -1) str += '试驾  ';
        if (code.indexOf(2) > -1) str += '试乘';
      }else if (type == 'route') {//code 指的是routeId
        console.log('code--------->>',code);
        let license_info = this.props.common._dictDataMap.license_info;
        str = license_info[code].nameCn;
      }
    }

    return str;
  }


  _printProtocol() {
    let common = this.props.common;
    let { dealer, product } = common._dictDataMap;
    let { modelId, type, routeId, contractCreateDate, dealerUserId, dealerId, createDate, driveDate, drivingLicenseUrl,
      nameCn, mobile, drivingLicenseNo, signatureUrl, duserSignatureUrl} = this.state.testDriveDetail;

    let postData = {
      dealerCode: dealer[dealerId].dealerCode,
      modelNameCn: product[modelId] ? product[modelId].nameCn : '',
      type: this._getType(type, 'type'),
      routeId: this._getType(routeId, 'route'),
      createdDate: createDate,
      signatureUrl,
      drivingLicenseNo,
      drivingLicenseUrl,
      duserSignatureUrl,
      mobile: mobile,
      nameCn: this._getAccountName(common.login.account, dealerUserId),
      year: contractCreateDate.split('-')[0],
      month: contractCreateDate.split('-')[1],
      day: contractCreateDate.split('-')[2].substr(0, 2)
    };
    // console.log(printProtocol(postData));
    print(printProtocol(postData));
  }

  _changeValue(e) {
    this.setState({ mobilePhone: e.target.value })
  }

  componentWillMount() {
    this.state.testDriveDetail = JSON.parse(JSON.stringify(this.props.testDriveDetail));
    this.setState({});
  }

  _sendEmail() {
    let value = this.state.email;
    if (!checkEmail(value)) {
      Toast.info('请输入正确的邮箱格式');
    } else {
      let postData = JSON.parse(JSON.stringify(this.state.testDriveDetail));
      postData.routeDesc = this._getType(postData.routeId, 'route');
      postData.email = value;
      localStorage.setItem(LS_EMAIL, value);
      this.setState({ isShowSendEmail: false});
      // alert(JSON.stringify(postData));
      this.props._downloadPDF(postData);
        // this.props._updateTestDriveInfo(postData, 'sendEmail');
    }
  }

  _showEmail() {
    var storedEmail = localStorage.getItem(LS_EMAIL);
    if(storedEmail)this.setState({ isShowSendEmail: true, email:storedEmail });
    else this.setState({ isShowSendEmail: true, email:'' });
  }
  _submitDate() {
    let postData = JSON.parse(JSON.stringify(this.props.testDriveDetail));
    postData.contractCreateDate = moment(this.state.contractCreateDate).format('YYYY-MM-DD HH:mm:ss');
    this.props._updateTestDriveInfo(postData);
  }

  _getAccountName(account, id) {
    var item = account.filter(v => { return v.id == id });
    return item.length > 0 ? item[0].nameCn : '';
  }

  render() {
    let { isRead, isShowSendEmail, email } = this.state;
    let { modelId, type, routeId, createDate, dealerId, contractCreateDate, dealerUserId, drivingLicenseUrl, nameCn,
      mobile, drivingLicenseNo, signatureUrl, duserSignatureUrl } = this.state.testDriveDetail;
    let common = this.props.common;
    let { dealer, product } = common._dictDataMap;
    let { account } = common.login;
    let { step, from, fromStep } = this.props;
    var now = '';
    if (!contractCreateDate) {
      now = this.state.contractCreateDate = moment(new Date()).format('YYYY-MM-DD HH:mm:ss');
    } else now = contractCreateDate;
    var year = now.split('-')[0];
    var month = now.split('-')[1];
    var day = now.split('-')[2].substr(0, 2);
    return (
      <div className='gStep3'>
        <ul className="gtime-horizontal">
          <li className='col-sm-6'><b><SelectIcon selected={true} className={'gtimeCheckBox'} />
          </b>试驾登记</li>
          <li className='col-sm-6'><b style={{ left: -18 }}><SelectIcon selected={false} className={'gtimeCheckBox'} /></b><span style={{ position: 'relative', left: -18 }}>试乘试驾</span>
            <b className='gtimeLastIcon'><SelectIcon selected={false} className='gtimeCheckBox' /></b><span className="glastTimeText">试驾反馈</span></li>
        </ul>
        <div className='gProtocol'>
          <h1>试乘试驾协议书</h1>
          <p><span>经销商代码:{dealer[dealerId].dealerCode}</span> <img className='fr' src={'assets/image/logo.png'} /></p>
          <ul>
            <li className='clearfix'>
              <span className='col-sm-5'> 试乘试驾车型选择</span>
              <span className='col-sm-7'>{product[modelId] ? product[modelId].nameCn : ''}</span>
            </li>
            <li className='clearfix'>
              <span className='col-sm-5'> 试乘试驾体验项目</span>
              <span className='col-sm-7'>{this._getType(type, 'type')}</span>
            </li>
            <li className='clearfix'>
              <span className='col-sm-5'> 试驾路线选择</span>
              <span className='col-sm-7'>{this._getType(routeId, 'route')}</span>
            </li>
            <li className='clearfix'>
              <span className='col-sm-5'> 试乘试驾登记时间</span>
              <span className='col-sm-7'>{createDate}</span>
            </li>
          </ul>
          <article className='clearfix'>
            本人于    {year}      年  {month}     月   {day}    日参加试乘试驾活动，特此作如下陈述与声明：
            为保证试驾活动的规范性和顺利进行，本人同意将驾驶证复印件作为法定身份证明。
            <div>
              <span className='col-sm-12'>A：对自驾同时作如下陈述与声明：</span>
              <p style={{ textIndent: 14 }}> 本人声明至少具有一年以上汽车驾龄，同时拥有相等年限的实际驾驶经验，并有能力独自承担造成事故后的相应赔偿责任，本人承诺以上提供的信息完全属实（附驾驶证复印件）。</p>
              <p style={{ textIndent: 14 }}> 本人在试驾过程中，将严格遵守行车驾驶的一切法规和要求，并服从贵公司提出的一切指示和安排，做到安全、文明驾驶，不违规操作和尝试危险性动作，以尽最大努力和善意保护试乘试驾车辆的安全和完好。否则，因此造成对贵公司的一切损失和危害，将由本人全部独自承担和赔偿。</p>
            </div>
            <div>
              <span className='col-sm-12'>B：对试乘同时作如下陈述与声明：</span>
              <p style={{ textIndent: 14 }}>本人在试乘过程中，将服从贵公司提出的指示，以尽最大努力和善意保护试驾车辆的安全和完好，应严格遵守交通规则，如有交通事故，驾驶人依保险条款及相关法规承担相应责任。</p>
            </div>
          </article>
          <div className='gReaded'><SelectIcon onSelect={() => { this.setState({ isRead: !isRead }) }} selected={isRead || this.props.testDriveDetail.contractCreateDate} className='gtimeCheckBox' /><i onClick={() => { this.setState({ isRead: !isRead }) }} >我已阅读并确认了解试乘试驾声明</i></div>
          <ul>
            <li> 试驾人详细信息</li>

            <li className='clearfix gSign'>
              <div className='col-sm-12'><p> 客户(试驾人)签名</p>
                {signatureUrl ? <img src={signatureUrl} /> : ''}
              </div>
            </li>

            <li className='clearfix gSign'>
              <div className='col-sm-12'><p>销售/试驾专员签名</p>
                {signatureUrl ? <img src={duserSignatureUrl} /> : ''}
              </div>
            </li>

            <li className='clearfix'>
              <span className='col-sm-5'>驾驶证号</span>
              <span className='col-sm-7'>{drivingLicenseNo}</span>
            </li>

            <li className='clearfix'>
              <span className='col-sm-5'>手机／固定电话</span>
              <span className='col-sm-7'>{mobile}</span>
            </li>
            <li className='clearfix'>
              <span className='col-sm-5'>日期</span>
              <span className='col-sm-7'> {year}/{month}/{day}</span>
            </li>
            <li className='clearfix'>
              <span className='col-sm-5'> 销售顾问／试驾专员</span>
              <span className='col-sm-7'>{this._getAccountName(account, dealerUserId)}</span>
            </li>
          </ul>
          <p style={{ padding: 10 }}>驾照</p>
          <div className='gDriveLicense' >{drivingLicenseUrl ? <img src={drivingLicenseUrl} /> : ''}
          </div>
          <div>

          </div>
        </div>
        <div className={!fromStep || fromStep < 7 ? '' : 'hid'}>
          <div className={(step == 3 ? '' : 'hid') + ' popOperate clearfix'}>
            <p className='col-sm-6'><span onClick={() => this.props._setStep(2)}>上一步</span></p>
            <p className='col-sm-6'>
              <span onClick={() => { isRead || this.props.testDriveDetail.contractCreateDate ? this._submitDate() : Toast.info('请先阅读协议') }} className='active'>
                签名
              </span>
            </p>
          </div>

          <div className={(step > 3 ? '' : 'hid') + ' popOperate clearfix'}>
            <p className='col-sm-6'><span onClick={() => this.props._setStep(3)}>上一步</span></p>
            <p className='col-sm-6'> <span className='active' onClick={this._printProtocol}>打印协议</span></p>
          </div>
          <div className={(step > 3 ? '' : 'hid') + ' popOperate clearfix'}>
            <p className='col-sm-6'><span className='active' onClick={this._showEmail}>下载PDF</span></p>
            <p className='col-sm-6'> <span className='active' onClick={() => { this.props._setStep(5) }}>开始试驾</span></p>
          </div>
        </div>
        <div className={(fromStep == 7 ? '' : 'hid') + ' popOperate clearfix'}>
          <p className='col-sm-6'><span className='active' onClick={this._showEmail}>下载PDF</span></p>
          <p className='col-sm-6'> <span className='active' onClick={this._printProtocol}>打印协议</span></p>
        </div>
        <div>
          <div className={isShowSendEmail ? 'sendEmail' : 'hid'}>
            <div className="am-modal-mask"></div>
            <div role="document" className="am-modal am-modal-transparent" style={{ width: '5.4rem', height: 'auto' }}>
              <div className="am-modal-content">
                <div className="am-modal-header"><div className="am-modal-title">邮箱填写</div></div><div className="am-modal-body"><div style={{ zoom: 1, overflow: 'hidden' }}><div>
                  <div><div className="am-modal-input">
                    <input type="text" value={email} onChange={(e) => { e.preventDefault(); this.setState({ email: e.target.value }) }} />
                  </div></div></div></div></div>
                <div className="am-modal-footer">
                  <div className="am-modal-button-group-h">
                    <span className="am-modal-button" onClick={() => { this.setState({ 'isShowSendEmail': false }) }}>取消</span>
                    <span className="am-modal-button" onClick={this._sendEmail}>提交</span></div></div></div>
            </div>
          </div>
        </div>
      </div>
    );
  }

}