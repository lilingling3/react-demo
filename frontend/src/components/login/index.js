/**
 * Created by zhongzhengkai on 2017/2/9.
 */

import React, { Component } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import * as actions from '../../actions/login';
import './login.css';
import { appHistory } from '../app';
import { bindThis, checkPhone} from '../../base/common-func';
import { getApiHost, changeApiHost, getApiHostKey } from '../../base/api-host-conf';
import * as dlg from '../../base/tool/dlg';
import Progress from 'antd-mobile/lib/progress'
import { LS_LOGIN_USERNAME, LS_IS_REMEMBERED } from '../../constants';
import Modal from 'antd-mobile/lib/modal';

export class Login extends Component {

  constructor(props, context) {
    super(props, context);
    var loginName = props.common.loginUserName, password = '';
    if (__APP_ENV__ == 'dev') password = '123456';
    var isRemembered = false;
    if (props.common.isRemembered) isRemembered = true;

    //step: 1 welcome页面 2 显示检查基础数据页面 loading，3 显示检查基础数据页面 loaded
    this.state = {
      isRemembered, timer: null, loginName, password, phoneCodeLabel: '获取验证码', getBaseDataDone: false, checkStatusCount: 0,
      tickCount: 60, step: 1, checkStatusDone: false, percent: 0, percentAccum: 0, showHelp: false, clickCount: 0
    };
    bindThis(this, ['login', 'inputPhoneNumber', 'getPhoneCode', 'inputPassword', 'checkBaseData',
      'rememberMe', 'showHelp', 'tryChangeApiHost']);
  }

  componentWillUnmount() {
    clearInterval(this.state.timer);
  }

  componentDidMount() {
    // this.props.actions.getBaseDataVersion(true);
    this.props.actions.getBaseDataVersion();
  }

  tryChangeApiHost() {
    var clickCount = this.state.clickCount + 1;
    if (clickCount > 0 && clickCount % 10 == 0) {
      changeApiHost();
      Modal.alert('[' + getApiHostKey() + ']apiHost已被改变为:' + getApiHost(), '', [
        { text: '知道了' }, {
          text: '同步新域名数据', onPress: () => {
            this.state.step = 1;
            this.state.checkStatusCount = 0;
            this.state.percentAccum = 0;
            this.props.actions.getBaseDataVersion(true);
          }
        }
      ]);
    }
    this.state.clickCount = clickCount;
  }

  showHelp(e) {
    e.preventDefault();
    // this.setState({showHelp: !this.state.showHelp});
    Modal.alert(
      <div style={{ textAlign: 'left', lineHeight: '26px' }}>
        扫描下方二维码或直接微信搜索“Jeep数字营销中心”，直接在对话框中提交您的疑问或建议，将有专人为您提供相关解答。
        <br />
        客服时间：9:00-18:00（周一至周日
        <br />
        <img src="assets/image/help.jpeg" style={{ width: '90%', margin: '5%' }} />
      </div>
    );
  }

  checkBaseData() {
    var { checkStatusDone, getBaseDataDone, updateTableStats, needCheckStatus } = this.props.login;
    var checkStatusCount = this.state.checkStatusCount;
    // console.log(getBaseDataDone,needCheckStatus,checkStatusCount);
    if (getBaseDataDone) {
      if (needCheckStatus) {
        if (checkStatusCount == 0) {//保证只会调用一次
          this.setState({ step: 2, checkStatusCount: 1 });//需要显示loading条了
          var actions = this.props.actions;
          var { channel, customer_status, dealer, product, geography, dictionary, sys_role, opportunity_level, product_sku,
            dealer_product, license_info } = updateTableStats;
          if (channel) actions.getDictChannel();
          if (customer_status) actions.getDictCustomerStatus();
          if (dealer) actions.getDictDealer();
          if (product) actions.getDictProduct();
          if (geography) actions.getDictGeography();
          if (dictionary) actions.getDictDictionary();
          if (sys_role) actions.getDictSysRole();
          if (opportunity_level) actions.getDictOpportunityLevel();
          if (product_sku) actions.getDictProductSku();
          if (dealer_product) actions.getDictDealerProduct();
          if (license_info) actions.getDictAllLicense();

          var percentAccum = this.state.percentAccum;
          if (percentAccum == 0) {
            var timer = setInterval(() => {
              var { percentAccum, percent, checkStatusDone } = this.state;
              percentAccum += 10;
              this.checkBaseData();
              if (percentAccum >= 100) {
                if (percentAccum < 150) this.setState({ percent: 100, percentAccum });//累加值小于150前，进度条先走着
                else if (checkStatusDone) {
                  clearInterval(timer);
                  if (this.props.common.login.token) appHistory.push('/home');
                  else this.setState({ percentAccum, percent, step: 3 });
                }
              } else this.setState({ percent: percentAccum, percentAccum });
            }, 200);
          }
        } else {
          // do nothing
        }
      } else {
        var common = this.props.common;
        var step = this.state.step;
        if (step == 3 && common.login.token) appHistory.push('/home');
        else {
          if (checkStatusCount == 0) this.setState({ step: 3, checkStatusCount: 1 });
        }
      }
    }
    this.state.checkStatusDone = checkStatusDone;
    this.state.getBaseDataDone = getBaseDataDone;
  }

  login(e) {
    e.preventDefault();
    // var {loginName,password} = this.state;
    var loginName = this.phoneNumber.value;
    var password = this.phoneCode.value;
    // appHistory.push('/home');
    if (!checkPhone(loginName)) return dlg.info('电话号码格式不正确');
    if (!(/^\d{6}$/.test(password))) return dlg.info('验证码格式不正确');

    var { isRemembered } = this.state;
    if (isRemembered) {
      localStorage.setItem(LS_LOGIN_USERNAME, loginName);
      this.props.common.loginUserName = loginName;
    }
    this.props.actions.login(loginName, password, () => {
      appHistory.push('/home',{from:'login'});
    });
  }

  componentDidUpdate() {
    console.log('------------------------2222');
    this.checkBaseData();
  }

  inputPhoneNumber(e) {
    e.preventDefault();
    // e.stopPropagation();
    var loginName = e.target.value;
    if (this.state.isRemembered) localStorage.setItem(LS_LOGIN_USERNAME, loginName);
    this.setState({ loginName });
  }

  inputPassword(e) {
    e.preventDefault();
    // e.stopPropagation();
    var password = e.target.value;
    this.setState({ password });
  }

  getPhoneCode(e) {
    var { tickCount } = this.state;
    var loginName = this.phoneNumber.value;
    if (!checkPhone(loginName)) return dlg.info('电话号码格式不正确');
    if (tickCount == 60) {
      this.props.actions.getPhoneCode(loginName);
      var timer = setInterval(() => {
        var tickCount = this.state.tickCount;
        if (tickCount == 0) {
          clearInterval(timer);
          this.setState({ phoneCodeLabel: '获取验证码', tickCount: 60 });
        } else {
          this.setState({ phoneCodeLabel: tickCount, tickCount: tickCount - 1 });
        }
      }, 1000);
      this.state.timer = timer;
    }
  }

  rememberMe(e) {
    e.stopPropagation();
    var { isRemembered } = this.state;
    var loginName = this.phoneNumber.value;
    var curVal = !isRemembered;
    if (curVal) {
      localStorage.setItem(LS_LOGIN_USERNAME, loginName);
      localStorage.setItem(LS_IS_REMEMBERED, 1);
    } else {
      localStorage.setItem(LS_LOGIN_USERNAME, '');
      localStorage.setItem(LS_IS_REMEMBERED, 0);
    }
    this.setState({ isRemembered: !this.state.isRemembered });
  }

  render() {
    console.log('%c@@@ Login', 'color:green;border:1px solid green');


    //<div style={Trow3}> <input type="checkbox" checked={isRemembered?'checked':''} onChange={this.rememberMe}/>记住我 </div>
    var { phoneCodeLabel, loginName, password, step, percent, isRemembered} = this.state;
    var view;
    if (step == 1) {
      view = <div className="welcome-page"> </div>
    } else if (step == 2) {
      view = (
        <div className="welcome-page">
          <div style={{ width: '80%', margin: '0 auto' }}>
            <Progress percent={percent} position="normal" />
          </div>
        </div>
      );
    } else {
      var rememberBtnClazz = ' notremember', bd = ' bd2';
      var isPhoneOk = false;
      if (isRemembered)isPhoneOk = true;
      if (isPhoneOk) rememberBtnClazz = ' remember', bd = ' bd1';

      var rIcon = <i className="iconfont icon-point"/>;
      if (isRemembered) rIcon = <i className="iconfont icon-gou"/>;

      view = (
        <div className="login-page">
          <div className="title">
            <div className="clickArea" onClick={this.tryChangeApiHost}></div>
          </div>

          <div className="row grayBottom">
            <label className="label">手机号</label>
            <input className="phoneNumber" type="text" value={loginName} ref={(input) => { this.phoneNumber = input }}
                   onClick={(e) => { e.preventDefault(); this.phoneNumber.focus() }} onChange={(e)=> this.setState({loginName:e.currentTarget.value})}/>
          </div>
          <div className="rowGap" />
          <div className="row grayBottom">
            <label className="label">验证码</label>
            <input className="phoneCode" type="text" ref={(input) => { this.phoneCode = input }} onClick={(e) => { e.preventDefault(); this.phoneCode.focus() }} />
            <button className="codeBtn" onClick={this.getPhoneCode}>{phoneCodeLabel}</button>
          </div>
          <div className="rowGap" />
          <div className="row">
            <button className="loginBtn" onClick={this.login}>登录</button>
          </div>
          <div className="row" onClick={this.rememberMe}>
            <div className={'rememberBox' + bd}>
              <i className={'iconfont icon-gou' + rememberBtnClazz} />
            </div>
            <label className="label">记住我</label>
          </div>
          <div className="row hasProblem" onClick={this.showHelp}>
            登录遇到问题?
          </div>
        </div>
      );
    }


    return view;
  }

}

export default connect(state => ({
  login: state.login,
  common: state.common
}), dispatch => ({
  actions: bindActionCreators(actions, dispatch)
}))(Login)

//<input className="phoneNumber" type="text" value={loginName} onChange={this.inputPhoneNumber} />
//<input type="text" className="phoneCode" value={password} onChange={this.inputPassword} />