/**
 * Created by bykj on 2017-6-16.
 */
import React, {Component} from 'react';
import {connect} from 'react-redux';
import {bindActionCreators} from 'redux';
import * as Actions from '../../actions/change-password';
import './change-password.css';
import {bindThis} from '../../base/common-func';
import {appHistory} from '../app';
import {Modal, message} from 'antd';

class ChangePassword extends Component {
  constructor(props, context) {
    super(props, context);
    this.state = {
      username: '',
      oldPassword: '',
      newPassword1: '',
      newPassword2: ''
    }
    bindThis(this, ['changePassword','setUserName','setOldPassword','setNewPassword1','setNewPassword2']);
  }

  changePassword() {
    var {username, oldPassword, newPassword1, newPassword2} = this.state;
    if (username.length == 0) {
      message.error("请填写邮箱");
    } else if (oldPassword.length == 0) {
      message.error("请填写密码");
    } else if (newPassword1.length == 0) {
      message.error("请填写新密码");
    } else if (newPassword2.length == 0) {
      message.error("请再次填写新密码");
    } else if (newPassword1 !== newPassword2) {
      message.error("两次新密码输入不一致");
    } else {
      var param = {
        "loginName": username,
        "newPassword": newPassword1,
        "confirmNewPassword": newPassword2
      }
      this.props.actions.changePassword(param);
    }
  }

  setUserName(e) {
    var userName = e.target.value;
    this.setState({username: userName});
  }

  setOldPassword(e) {
    var password = e.target.value;
    this.setState({oldPassword: password});
  }

  setNewPassword1(e) {
    var password = e.target.value;
    this.setState({newPassword1: password});
  }

  setNewPassword2(e) {
    var password = e.target.value;
    this.setState({newPassword2: password});
  }

  render() {
    var {username, oldPassword, newPassword1, newPassword2} = this.state;
    var changePasswordProps = this.props.changePassword;
    if (changePasswordProps.getResult) {
      if (changePasswordProps.result.status == 200) {
        message.success(changePasswordProps.result.message);
        this.setState({
          username: '',
          oldPassword: '',
          newPassword1: '',
          newPassword2: ''
        })
      } else {
        message.error(changePasswordProps.result.message);
      }
      this.props.changePassword.getResult = false;
    }
    return (
      <div className="changePassword">
        <div className="tabLayout">
          <div className="tab tabSelect fontRegular">修改密码</div>
        </div>
        <div className="content">
          <input className="input" type="text" placeholder="登录名(公司邮箱)" value={username} onChange={this.setUserName}/>
          <input className="input" type="password" placeholder="密码" value={oldPassword} onChange={this.setOldPassword}/>
          <input className="input" type="password" placeholder="新密码" value={newPassword1} onChange={this.setNewPassword1}/>
          <input className="input" type="password" placeholder="确认新密码" value={newPassword2} onChange={this.setNewPassword2}/>
          <button className="button fontRegular" onClick={this.changePassword}>确认修改</button>
        </div>
      </div>
    )
  }
}
export default connect(
  state=> ({
    changePassword: state.changePassword
  }),
  dispatch => ({actions: bindActionCreators(Actions, dispatch)})
)(ChangePassword)