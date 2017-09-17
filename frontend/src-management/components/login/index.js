/**
 * Created by bykj on 2017-6-16.
 */
import React, {Component} from 'react';
import {connect} from 'react-redux';
import {bindActionCreators} from 'redux';
import * as Actions from '../../actions/login';
import './login.css';
import {bindThis} from '../../base/common-func';
import {appHistory} from '../app';
import {Modal, message} from 'antd';

class Login extends Component {
  constructor(props, context) {
    super(props, context);
    this.state = {userName: '', password: '', dialogVisible: false};
    bindThis(this, ['setUserName', 'setPassword', 'login', 'showForgetPasswordDialog', 'forgetPassword']);
  }

  componentDidUpdate() {
    var common = this.props.common;
    if (common.login != null && common.login.role != null && common.clickLogin) {
      if (common.login.role.findIndex((value) => value == 177) > -1) {
        if (common.login.token)appHistory.push('/home');
      } else {
        message.error('该角色无法登录');
      }
      this.props.common.clickLogin = false;
    }
  }

  setUserName(e) {
    var userName = e.target.value;
    this.setState({userName: userName});
  }

  setPassword(e) {
    var password = e.target.value;
    this.setState({password: password});
  }

  login() {
    var {userName, password} = this.state;
    if (userName.length == 0) {
      message.error('用户名不能为空');
    } else if (password.length == 0) {
      message.error('密码不能为空');
    } else {
      var param = {loginName: userName, password: password};
      this.props.actions.login(param);
    }
  }

  forgetPassword() {
    var userName = this.state.userName;
    this.setState({dialogVisible: false});
    this.props.actions.forgetPassword(userName, ()=> {
      message.info("邮件已发送到您的邮箱中，请注意查收");
    });
  }

  showForgetPasswordDialog() {
    var userName = this.state.userName;
    if (userName.length == 0) {
      message.error("请输入邮箱账号");
    } else {
      // var reg = /^\w+((-\w+)|(\.\w+))*\@[A-Za-z0-9]+((\.|-)[A-Za-z0-9]+)*\.[A-Za-z0-9]+$/;
      // if (reg.test(userName)) {
      //   this.setState({dialogVisible: true});
      // } else {
      //   message.error("邮箱格式不正确");
      // }
      this.setState({dialogVisible: true});
    }
  }

  render() {
    var {userName, password} = this.state;
    return (
      <div className="login">
        <div className="title fontRegular">卖车宝经销商管理平台</div>
        <div className="body">
          <input className="input" type="text" placeholder="登录名" value={userName} onChange={this.setUserName}/>
          <input className="input" type="password" placeholder="密码" value={password} onChange={this.setPassword}/>
          <button className="loginButton fontRegular" type='submit' onClick={this.login}>登录</button>
          <u className="forgetPassword" onClick={this.showForgetPasswordDialog}>忘记密码？</u>
        </div>

        <Modal ref="modal"
               width='370'
               visible={this.state.dialogVisible}
               footer={[]}>
          <div className="dialog">
            <div className="text">
              确认重置密码后，新密码将以邮件形式发送到您公司账户邮箱中。
            </div>
            <div>
              <button className="dialogButton fontRegular" onClick={()=>this.setState({dialogVisible: false})}>取消
              </button>
              <button className="dialogButton fontRegular" onClick={this.forgetPassword}>确认重置密码</button>
            </div>
          </div>
        </Modal>
      </div>
    );
  }
}

export default connect(
  state=> ({
    common: state.common,
    login: state.login
  }),
  dispatch => ({actions: bindActionCreators(Actions, dispatch)})
)(Login)