/**
 * Created by bykj on 2017-6-20.
 */
import React, {Component} from 'react';
import {bindThis} from '../../base/common-func';
import {appHistory} from '../app';
import {Menu} from 'antd';
import {connect} from 'react-redux';
import {bindActionCreators} from 'redux';
import * as Actions from '../../actions/left-menu';

var SubMenu = Menu.SubMenu;

export default class LeftMenu extends Component {
  constructor(props, context) {
    super(props, context);
    this.state = {current: '0'};
    bindThis(this,['logout']);
  }

  logout(){
    this.props.actions.logout();
    appHistory.push('/login');
  }

  render() {
    var {children} = this.props;
    var name = this.props.common.login.nameCn;
    return (
      <div className="context">
        <div className="menu">
          <div className="loginItem">欢迎您：{name}</div>
          <div className="logout">
            <span onClick={this.logout}>退出</span>
            <span style={{marginLeft:'40px'}} onClick={()=>appHistory.push('/change-password')}>修改密码</span>
          </div>

          <Menu onClick={(e)=> {
            console.log('click ', e);
            this.setState({
              current: e.key
            });
            switch (e.key){
              case '0':
                appHistory.push('/home');
                break;
              case '1':
                appHistory.push('/batch-data-import');
                break;
              case '2':
                appHistory.push('/import-history')
                break;
              case '3':
                appHistory.push('/single-data-import');
                break;
            }
          }}
                style={{width: '161px'}}
                selectedKeys={[this.state.current]}
                mode="inline">
            <Menu.Item key="0">卖车宝角色维护</Menu.Item>
            <SubMenu key="sub1" title={<span>卖车宝线索导入</span>}>
              <Menu.Item key="1" style = {{marginLeft:'-20px'}}><i className="iconfont icon-point point"/>批量导入</Menu.Item>
              <Menu.Item key="2" style = {{marginLeft:'-20px'}}><i className="iconfont icon-point point"/>查看导入历史</Menu.Item>
              <Menu.Item key="3" style = {{marginLeft:'-20px'}}><i className="iconfont icon-point point"/>单条导入</Menu.Item>
            </SubMenu>
          </Menu>
        </div>
        <div className="body">
          {children}
        </div>
      </div>
    );
  }
}

export default connect(
  state=> ({
    common:state.common,
  }),
  dispatch => ({actions: bindActionCreators(Actions, dispatch)})
)(LeftMenu)