/**
 * Created by zhongzhengkai on 2017/5/11.
 */

import React, {Component} from 'react';
import {connect} from 'react-redux';
import {bindActionCreators} from 'redux';
import './self-info.css';
import {bindThis, getStore, getCSSPixelWidth, getCSSPixelHeight, getSidebarStyle} from '../../base/common-func';
import Sidebar from 'react-sidebar';
import SystemSetting from './systemSetting';

const sideBarSt = getSidebarStyle();

class SelfInfo extends Component {

  constructor(props, context) {
    super(props, context);
    this.state = {panel: '', panelOpen: false}
    bindThis(this, ['closePanel', 'openPanel']);
  }

  closePanel() {
    this.setState(
      {panelOpen: false}
    );
  }

  openPanel(index) {
    if (index == 1) {
      this.setState({
        panelOpen: true,
        panel: <SystemSetting onLeftIconClick={this.closePanel}/>
      });
    }
  }

  render() {
    console.log('%c@@@ SelfInfo', 'color:green;border:1px solid green')
    var {panel, panelOpen} = this.state;
    let selfInfo = this.props.common.login;
    let {dealer, sys_role, geography} = this.props.common._dictDataMap;

    let dealerInfo = dealer[selfInfo.dealerId];
    let selfPosition = sys_role[selfInfo.role[0]].nameCn;

    let dealerAddress = geography[dealerInfo.provinceId].nameCn + ' '
      + geography[dealerInfo.cityId].nameCn + ' '
      + dealerInfo.addressCn;

    // var panel = <div style={{backgroundColor: 'white', height: getCSSPixelHeight()}}>
    //   <button onClick={() => this.setState({panelOpen: false})}>gogogo</button>
    //   in panel
    // </div>

    return (
      <Sidebar sidebar={panel} styles={sideBarSt}
               pullRight={true} touch={false} shadow={false}
               open={panelOpen}
      >
        <div className="self-info">
          <div className="self-item">
            <img src={'assets/image/self-info/account_username.png'}/>
            <label className="self-name">姓名：</label>
            <label className="self-value">{selfInfo.nameCn+' ('+ selfInfo.loginName+')'}</label>
          </div>
          <div className="self-item">
            <img src={'assets/image/self-info/account_position.png'}/>
            <label className="self-name">职位：</label>
            <label className="self-value">{selfPosition}</label>
          </div>
          <div className="self-item">
            <img src={'assets/image/self-info/account_dealer.png'}/>
            <label className="self-name">所在经销商：</label>
            <label className="self-value">{dealerInfo.nameCn}</label>
          </div>
          <div className="self-item-address">
            <img src={'assets/image/self-info/account_address.png'}/>
            <label className="self-name">经销商地址：</label><br/>
            <label className="self-value">{dealerAddress}</label>
          </div>
          <br/>
          <div style={{height: '15px', backgroundColor: '#f1f1f1'}}></div>
          <div className="self-item" onClick={this.openPanel.bind(this, 1)}>
            <img src={'assets/image/self-info/account_setting.png'}/>
            <label className="self-name">系统</label>
            <a className="right-arrow"></a>
          </div>
         {/* {selfInfo.role.indexOf(1) > -1 ?
            <div className="self-item" onClick={this.openPanel.bind(this, 2)}>
              <img src={'assets/image/self-info/account_followtime.png'}/>
              <label className="self-name">跟进周期维护</label>
              <a className="right-arrow"></a>
            </div>
            : ''
          }*/}

          {/*<div className="self-item" onClick={this.openPanel.bind(this, 1)}>
            <div className="left" ></div>
            <div className="center">
              <div className="label">gogFFFogogo</div>
              <div className="corner"><i className="iconfont icon-demo03 icon"/></div>
            </div>
            <div className="right"></div>
          </div>*/}

        </div>
      </Sidebar>
    );
  }
}

export default connect(
  state => ({
    common: state.common
  }),
)(SelfInfo)