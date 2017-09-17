/**
 * Created by zhongzhengkai on 2017/6/14.
 */

import React, {Component} from 'react';
import {connect} from 'react-redux';
import {bindActionCreators} from 'redux';
import * as Actions from '../../actions/home';
import * as Constant from  '../../constants';
import {
  bindThis, formatDate
} from '../../base/common-func';
import './home.css';
import '../../styles/antd.css';
import {Table, Modal, message} from 'antd';
import moment from 'moment';
import 'moment/locale/zh-cn';
moment.locale('zh-cn');

const REMIND_TRANSFORM = '1';
const REMIND_DELETE = '2';
const REMIND_CREATE = '3';
const CONFIRM_TRANSFORM = '4';
const CONFIRM_DELETE = '5';
const ACTION_DELETE = "DELETE";
const ACTION_CREATE = "CREATE";
const ACTION_TRANSFER = "TRANSFER";

class Home extends Component {

  constructor(props, context) {
    super(props, context);
    this.state = {
      showTransferRoleDialog: false,
      showRemindDialog: false,
      showConfirmDialog: false,
      showNewRoleDialog: false,
      showOperateHistoryDialog: false,
      showHistoryDialog: false,
      remindDialogType: '',
      confirmDialogType: '',
      roleTargetId: -1,
      currentIndex: -1,
    }
    bindThis(this, ['createTableView', 'createRemindDialog', 'createConfirmDialog', 'showTransferRoleDialog', 'showConfirmDialog', 'showNewRoleDialog',
      'showRemindDialog', 'showHistoryDialog', 'selectRole']);
  }

  componentDidMount() {
    var common = this.props.common;
    this.props.actions.getData(common.login.dealerId);
  }

  componentWillReceiveProps(nextProps) {
    if (this.props != nextProps&&this.props.home.operateResult != nextProps.home.operateResult) {
      this.setState({showRemindDialog:true,showConfirmDialog:false,showTransferRoleDialog:false,showNewRoleDialog:false});
    }
  }

  createTableView() {
    let self = this;
    var columns = [{
      title: '编号',
      width:80,
      dataIndex: 'number',
    }, {
      title: '姓名',
      width:100,
      dataIndex: 'name'
    }, {
      title: 'DMS登录用户名',
      width:150,
      dataIndex: 'dms_account'
    }, {
      title: 'DMS手机号',
      width:150,
      dataIndex: 'dms_phone'
    }, {
      title: 'DMS角色',
      width:150,
      dataIndex: 'dms_role'
    }, {
      title: '卖车宝角色',
      width:150,
      dataIndex: 'dccm_role'
    }, {
      title: '卖车宝账号操作',
      dataIndex: 'operation',
      width:230,
      render: function (text, record, index) {
        var view;
        if (record.dccm_role_id != null) {
          view =
            <span style={{textAlign: 'left', display: 'inline-block'}}>
              <label className="tableButton fontRegular" data-index={index}
                     onClick={self.showTransferRoleDialog}>转岗</label>
              <span className="ant-divider"></span>
              <label className="tableButton fontRegular" data-index={index} data-type={CONFIRM_DELETE}
                     onClick={self.showConfirmDialog}>删除</label>
              <span className="ant-divider "></span>
              <label className="tableButton fontRegular" data-index={index}
                     onClick={self.showHistoryDialog}>操作历史</label>
            </span>
        } else {
          view =
            <span style={{textAlign: 'left', display: 'inline-block'}}>
               <label className="tableButton fontRegular" data-index={index} onClick={self.showNewRoleDialog}>创建</label>
               <span className="ant-divider"></span>
               <label className="tableButton fontRegular" data-index={index}
                      onClick={self.showHistoryDialog}>操作历史</label>
              </span>
        }
        return view;
      }
    }];
    var data = this.props.home.data;
    var tableView = <Table columns={columns} dataSource={data} pagination={false} scroll={{y:'550px'}}/>;
    return tableView;
  }


  showTransferRoleDialog(e) {
    var index = e.currentTarget.dataset.index;
    this.setState({showTransferRoleDialog: true, currentIndex: index});
  }

  showNewRoleDialog(e) {
    var index = e.currentTarget.dataset.index;
    this.setState({showNewRoleDialog: true, currentIndex: index});
  }

  showConfirmDialog(e) {
    var type = e.currentTarget.dataset.type;
    var index = e.currentTarget.dataset.index;
    this.setState({showConfirmDialog: true, confirmDialogType: type,currentIndex:index});
  }

  showRemindDialog() {
    this.setState({showRemindDialog: true});
  }

  showHistoryDialog(e) {
    var index = e.currentTarget.dataset.index;
    this.setState({showHistoryDialog: true, currentIndex: index});
  }

  createConfirmDialog() {
    var {currentIndex, showConfirmDialog, confirmDialogType, roleTargetId} = this.state;
    var click;
    var title;
    var common = this.props.common;
    if (confirmDialogType == CONFIRM_TRANSFORM) {
      let name, role, accountId, phone;
      var roleTargetName = this.props.home.roles[roleTargetId];
      if (currentIndex != -1) {
        name = this.props.home.data[currentIndex].name;
        role = this.props.home.data[currentIndex].dccm_role;
        accountId = this.props.home.data[currentIndex].sys_account_id;
        phone = this.props.home.data[currentIndex].dms_phone;
      }
      title = '确认将' + name + '从' + role + '变为' + roleTargetName + '？';
      click = ()=> {
        this.state.remindDialogType = REMIND_TRANSFORM;
        var param = {
          operationId: common.login.id,
          operationName: common.login.nameCn,
          action: ACTION_TRANSFER,
          accountId: accountId,
          roleId: roleTargetId,
          ip: '',
          phone: phone
        }
        this.props.actions.operate(param);
      }
    } else if (confirmDialogType == CONFIRM_DELETE) {
      let name, accountId, phone;
      if (currentIndex != -1) {
        name = this.props.home.data[currentIndex].name;
        accountId = this.props.home.data[currentIndex].sys_account_id;
        phone = this.props.home.data[currentIndex].dms_phone;
      }
      title = '请确认删除' + name + '卖车宝账号，删除后该人员将无法再登录卖车宝APP。';
      click = ()=> {
        this.state.remindDialogType = REMIND_DELETE;
        var param = {
          operationId: common.login.id,
          operationName: common.login.nameCn,
          action: ACTION_DELETE,
          accountId: accountId,
          roleId: 0,
          ip: '',
          phone: phone
        };
        this.props.actions.operate(param);
        this.setState({showConfirmDialog: false,roleTargetId:-1})
      }
    }

    return <Modal ref="modal"
                  width='370px'
                  visible={showConfirmDialog}
                  footer={[]}>
      <div className="homeDialog">
        <div className="textCenter">
          {title}
        </div>
        <div className="buttonRow" style={{marginTop: '80px'}}>
          <button className="button fontRegular" onClick={()=>this.setState({showConfirmDialog: false,roleTargetId:-1})}>
            取消
          </button>
          <button className="button fontRegular" onClick={click}>
            确认
          </button>
        </div>
      </div>
    </Modal>
  }

  createRemindDialog() {
    var {remindDialogType, showRemindDialog,currentIndex} = this.state;
    var title;
    var remind;
    var resultCode;
    resultCode = this.props.home.operateResult.status;
    if (remindDialogType == REMIND_TRANSFORM) {
      let name,num,oldRole,newRole;
      name = this.props.home.data[currentIndex].name;
      oldRole = this.props.home.data[currentIndex].dccm_role;
      newRole = this.props.home.roles[this.state.roleTargetId];
      if(resultCode == Constant.RESULT_SUCCESS){
        if(this.state.roleTargetId == '2' ||this.state.roleTargetId == '4'){
          remind = '请确保在DMS中有DCC权限';
        }
        title = name+'已从'+oldRole+'变更为'+newRole;
      }else if(resultCode == Constant.RESULT_CONFLICT){
        title = '角色冲突';
      }else if(resultCode == Constant.RESULT_UNDISTRIBUTED){
        num = this.props.home.operateResult.num;
        title = name+'卖车宝上仍有'+num+'条线索未分配，需全部转分配后才可转岗。';
      }else if(resultCode == Constant.RESULT_ERROR){
        title = '服务器错误';
      }
    } else if (remindDialogType == REMIND_CREATE) {
      let name,num,role;
      name = this.props.home.data[currentIndex].name;
      num = this.props.home.operateResult.num;
      role = this.props.home.roles[this.state.roleTargetId];
      if(this.state.roleTargetId == '2' ||this.state.roleTargetId == '4'){
        remind = '请确保在DMS中有DCC权限';
      }
      if(resultCode == Constant.RESULT_SUCCESS){
        title = name+'已成为'+role;
      }else if(resultCode == Constant.RESULT_CONFLICT){
        title = '角色冲突';
      }else if(resultCode == Constant.RESULT_UNDISTRIBUTED){
        title = name+'卖车宝上仍有'+num+'条线索未分配，需全部转分配后才可创建';
      }else if(resultCode == Constant.RESULT_ERROR){
        title = '服务器错误';
      }else if(resultCode == Constant.RESULT_LOCAL_TEL_REPEAT){
        title = '创建失败,该手机号已在本店开通卖车宝角色，请勿重复开通。如有疑问请至“Jeep数字营销中心”微信公众号咨询';
      }else if(resultCode == Constant.RESULT_OTHER_TEL_REPEAT){
        title = '创建失败,该手机号已在他店开通卖车宝角色，请勿重复开通。如有疑问请至“Jeep数字营销中心”微信公众号咨询';
      }
    } else if (remindDialogType == REMIND_DELETE) {
      let name,num;
      name = this.props.home.data[currentIndex].name;
      num = this.props.home.operateResult.num;
      if(resultCode == Constant.RESULT_SUCCESS){
        title = name+"已成功删除";
      }else if(resultCode == Constant.RESULT_UNDISTRIBUTED){
        title = name+'卖车宝上仍有'+num+'条线索未分配，需全部转分配后才可删除账号。';
      }else if(resultCode == Constant.RESULT_ERROR){
        title = '服务器错误';
      }
    }
    return <Modal ref="modal"
                  width='370px'
                  visible={showRemindDialog}
                  footer={[]}>
      <div className="homeDialog">
        <div className="textCenter">
          {title}<br/><br/>
          {remind}
        </div>

        <div className="buttonRow" style={{marginTop: '50px'}}>
          <button className="button fontRegular" onClick={()=> {
            let setData = false;
            if (resultCode == Constant.RESULT_SUCCESS) {
              setData = true;
            }
            this.props.home.operateResult = {};
            this.setState({showRemindDialog: false,roleTargetId:-1});
            if (setData) {
              this.props.actions.getData(this.props.common.login.dealerId);
            }
          }}>
            确认
          </button>
        </div>
      </div>
    </Modal>
  }

  createTransferRoleDialog() {
    var {currentIndex,roleTargetId} = this.state;
    var name, role, roleId, roles, hasDccmManager;
    var chooseItem;
    if (currentIndex != -1) {
      var targetData = this.props.home.data[currentIndex];
      name = targetData.name;
      role = this.props.home.data[currentIndex].dccm_role;
      roleId = this.props.home.data[currentIndex].dccm_role_id;
      roles = this.props.home.roles;
      hasDccmManager = this.props.home.hasDccmManager;
      chooseItem = Object.keys(roles).map((key, idx)=> {
        if(key != roleId){
          return <option key={idx} value={key}>{roles[key]}</option>
        }
      });
    }
    return <Modal ref="modal"
                  width='370px'
                  visible={this.state.showTransferRoleDialog}
                  footer={[]}>
      <div className="homeDialog">
        <div className="text">
          {name}原卖车宝角色为{role}，请选择新角色。
        </div>
        <div className="page">
          <select className="select" value={roleTargetId} onChange={this.selectRole}>
            <option value="-1">请选择</option>
            {chooseItem}
          </select>
          <section>
            提示：
            若为跨部门转岗，请先确保该人员账户下销售线索已全部分配给原部门其他人员，账户下无线索。
          </section>
        </div>
        <div className="buttonRow" style={{marginTop: '20px'}}>
          <button className="button fontRegular"
                  onClick={()=>this.setState({showTransferRoleDialog: false, roleTargetId: -1})}>
            取消
          </button>
          <button className="button fontRegular" data-type={CONFIRM_TRANSFORM}
                  onClick={()=> {
                    if (this.state.roleTargetId != -1){
                      this.setState({
                        showTransferRoleDialog: false,
                        showConfirmDialog: true,
                        confirmDialogType: CONFIRM_TRANSFORM
                      })
                    }else{
                      message.error("请选择角色");
                    }
                  }}>
            确认
          </button>
        </div>
      </div>
    </Modal>
  }

  createNewRoleDialog() {
    var {currentIndex, roleTargetId} = this.state;
    var chooseItem, roles, hasDccmManager, accountId, phone;
    if (currentIndex != -1) {
      roles = this.props.home.roles;
      accountId = this.props.home.data[currentIndex].sys_account_id;
      phone = this.props.home.data[currentIndex].dms_phone;
      hasDccmManager = this.props.home.hasDccmManager;
      chooseItem = Object.keys(roles).map((key, idx)=> {
        // if( key == 1){
        //   if(!hasDccmManager){ //判断是否存在经理
        //     return <option key={idx} value={key}>{roles[key]}</option>
        //   }
        // }else{
        //   return <option key={idx} value={key}>{roles[key]}</option>
        // }
        return <option key={idx} value={key}>{roles[key]}</option>
      });
    }

    var click = ()=> {
      if (this.state.roleTargetId != -1){
        this.state.remindDialogType = REMIND_CREATE;
        var common = this.props.common;
        var param = {
          operationId: common.login.id,
          operationName: common.login.nameCn,
          action: ACTION_CREATE,
          accountId: accountId,
          roleId: roleTargetId,
          ip: '',
          phone: phone
        };
        this.props.actions.operate(param);
      }else{
        message.error("请选择角色");
      }
    }
    return <Modal ref="modal"
                  width='370px'
                  visible={this.state.showNewRoleDialog}
                  footer={[]}>
      <div className="homeDialog">
        <div className="text">
          选择角色
        </div>
        <div className="page">
          <select className="select" value={roleTargetId} onChange={this.selectRole}>
            <option value="-1">请选择</option>
            {chooseItem}
          </select>
          <div className="buttonRow" style={{marginTop: '20px'}}>
            <button className="button fontRegular"
                    onClick={()=>this.setState({showNewRoleDialog: false, roleTargetId: -1})}>
              取消
            </button>
            <button className="button fontRegular" style={{marginTop: '20px'}}
                    onClick={click}>
              确认
            </button>
          </div>
        </div>
      </div>
    </Modal>
  }

  createHistoryDialog() {
    var {currentIndex} = this.state;
    var listView;
    if (currentIndex != -1) {
      var historyList = this.props.home.data[currentIndex].operation;
      if (historyList != null) {
        listView = historyList.map((val, idx)=> {
          var operateDate = moment(new Date(val.createdDate)).format('YYYY/MM/DD');
          var operate = Constant.OPERATION[val.action];
          return <li key={idx} style={{marginTop: '10px'}}>
            {operateDate}          {operate}               {val.description}
          </li>
        })
      }
    }

    return <Modal ref="modal"
                  width='370px'
                  visible={this.state.showHistoryDialog}
                  footer={[]}>
      <div className="homeDialog">
        <div className="text">
          <ul style={{height: '120px', overflow: 'auto'}}>
            {listView}
          </ul>
        </div>
        <div className="page">
          <div className="buttonRow" style={{marginTop: '20px'}}>
            <button className="button fontRegular" onClick={()=>this.setState({showHistoryDialog: false})}>
              确认
            </button>
          </div>
        </div>
      </div>
    </Modal>
  }

  selectRole(e) {
    var roleId = e.currentTarget.value;
    this.setState({roleTargetId: roleId});
  }

  render() {
    var tableView = this.createTableView();
    var remindDialog = this.createRemindDialog();
    var confirmDialog = this.createConfirmDialog();
    var transferDialog = this.createTransferRoleDialog();
    var newRoleDialog = this.createNewRoleDialog();
    var historyDialog = this.createHistoryDialog();
    return (
      <div className="home">
        <div className="tabLayout">
          <div className="tab tabSelect fontRegular">卖车宝角色维护</div>
        </div>
        <div className="tableLayout">
          {tableView}
        </div>
        {transferDialog}
        {newRoleDialog}
        {remindDialog}
        {confirmDialog}
        {historyDialog}
      </div>
    )
  }
}

export default connect(
  state=> ({
    home: state.home,
    common:state.common
  }),
  dispatch => ({actions: bindActionCreators(Actions, dispatch)})
)(Home)




