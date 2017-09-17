/**
 * Created by bykj on 2017-6-6.
 */
import React, {Component} from 'react';
import {bindThis, getCSSPixelWidth, getCSSPixelHeight, getSidebarStyle} from '../../base/common-func';
import {connect} from 'react-redux';
import {bindActionCreators} from 'redux';
import {appHistory} from '../app';
import './test-drive-hp.css';
import Sidebar from 'react-sidebar';
import DriveRegister from "./drive-register";

const sideBarSt = getSidebarStyle();

class TestDrive extends Component {
  constructor(props, context) {
    super(props, context);
    this.state = {msgPanel: '', msgPanelOpen: false}
    bindThis(this,['openPanel','closePanel']);
  }

  openPanel(){
    this.setState({msgPanelOpen:true,msgPanel:<DriveRegister onLeftIconClick = {this.closePanel}/>});
  }

  closePanel(){
    this.setState({msgPanelOpen:false});
  }

  render() {
    return (
      <Sidebar sidebar={this.state.msgPanel} styles={sideBarSt}
               pullRight={true} touch={false} shadow={false}
               open={this.state.msgPanelOpen}
      >
        <div className="test-drive-hp">
          <input className="telephone" type="number" placeholder="- - - 手机号码 - - -"></input>
          <div className="describe">输入客户手机号码查找客户信息</div>
          <button className="button" onClick={this.openPanel}>
            新增试乘试驾
          </button>
        </div>
      </Sidebar>
    )
  }
}

export default connect(
  // state=> ({
  //
  // }),
  // dispatch => ({actions: bindActionCreators(actions, dispatch)})
)(TestDrive)