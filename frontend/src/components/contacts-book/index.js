/**
 * Created by guohuiru on 2017/05/11.
 */
import React, { Component } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import * as actions from '../../actions/contact-book';
import Icon from 'antd-mobile/lib/icon';
import SwipeAction from '../common/swipe-action';
import Popup from 'antd-mobile/lib/popup';
import './index.css';
import Tloader from 'react-touch-loader';
import { bindThis, getStore, checkValue, getSidebarStyle, getCurrentQuery } from '../../base/common-func';
import { getCCDPage, setCCDPage } from '../../base/refresh-page';
import PopupContent from './popup-content';
import Allocation from './allocation';
import SelectIcon from './../common/selectIcon';
import Modal from 'antd-mobile/lib/modal';
import Sidebar from 'react-sidebar';
import ContactDetail from './customer-detail/contact-detail';
import PhonePanel from '../today-task/phone-panel';
import MsgPanel from '../today-task/msg-panel';
import Toast from 'antd-mobile/lib/toast';

const sideBarSt = getSidebarStyle();
const scopedState = { prevOpenedTagItem: -1 };


const computeFilterRoleAndDealerUserId = (role, dealerUserId, filter)=>{

};

class ContactsBook extends Component {

  constructor(props, context) {
    super(props, context);
    this.state = {
      page: 'myContactBook',
      from: '',
      searchStr: '',
      sidebarKey: Date.now(),
      selectAll: false,
      canRefreshResolve: 1,
      sidebarOpen: false,
      sidebarType: '',// msgPanel || contactDetail || groupMsgPanel
      phoneOfMsgPanel: '',//打开短信面板需用到
      modelIdOfMsgPanel: '',//打开短信面板需用到
      nameOfMsgPanel: '',//打开短信面板需用到
      slOpportunityLevel: '',//打开短信面板需用到
      slOpportunityId: '',//打开短信面板需用到
      slStatus: '',//打开短信面板需用到
      hasMore: 1,
      initializing: 1,
      selectList: [],
      selectedCustomers:[],
      filter: {
        isMySelf: true,
        "dealerId": "",
        "dealerUserId": "",
        "salePhoneId": null,
        "salesConsultantId": null,
        "modelId": [

        ],
        "opportunityLevel": [

        ],
        "channelId": [

        ],
        "sourceId": [

        ],
        "status": [

        ],
        "timeType": null,
        "beginDate": null,
        "endDate": null,
        "phone": null,
        "name": null,
        "role": "",
        "pageIndex": 1,
        "pageSize": 10
      },
      phones: []
    };
    bindThis(this, ['_selectAll', '_onPanelOpen', '_onPanelClose', '_allocation', '_sendMsg', 'refresh', 'loadMore',
      '_search', '_selectOne', 'onShow', 'onShow', 'switchPage', 'openCallPhonePanel', 'openMsgPanel', 'getSidebarDom']);
  }

  _selectAll(flag) {
    if (flag)
      this.state.selectList = this.props.contactsBook.result.map((item) => {
        return item.id
      });
    else
      this.state.selectList = [];
    this.setState({
      selectAll: flag
    });
  }

  //这里只是打开群发短信面板
  _sendMsg() {
    let selectList = this.state.selectList;
    let {id} = this.props.common.login;
    if (selectList.length == 0)
      return Modal.alert('请选择销售线索');

    // var phones = [];
    // //!!! 这样写遍历代价太大
    // selectList.map((item) => {
    //   var contact = this.props.contactsBook.result.filter((n) => { return n.id == item });
    //   if (contact && contact[0].dealerUserId == id)
    //     phones.push(contact[0].mobilePhone)
    // });

    var selectedCustomers = [];
    this.props.contactsBook.result.forEach(val=>{
      if(selectList.indexOf(val.id)!=-1)
        selectedCustomers.push({
          phone:val.mobilePhone,opportunityLevel:val.oppLevel,opportunityId:val.id,name:val.name,
          status:val.potentialCustomerStatus,dealerUserId:id
        });
    });
    this.setState({ sidebarType: 'groupMsgPanel', selectedCustomers, sidebarOpen: true });
  }

  _selectOne(e) {
    e.preventDefault(); // 修复 Android 上点击穿透
    var id = parseInt(e.currentTarget.dataset.id);
    var dealeruid = parseInt(e.currentTarget.dataset.dealeruid);
    var {id:loginId, role:loginRole} = this.props.common.login;

    //只有3和4角色才需要去判断有木有权力去勾选
    if(loginRole.indexOf(3)>0 && loginRole.indexOf(4)>0){
      if(loginId != dealeruid)return Toast.info('你无权勾选此联系人，该联系人不是你的联系人！',1);
    }

    console.log(id);
    let { selectList } = this.state;
    var idx = selectList.indexOf(id);
    if (idx > -1) {
      selectList.splice(idx, 1);
    } else {
      selectList.push(id);
    }
    this.state.selectList = selectList;
    this.setState({
      selectAll: false
    });
  }


  componentWillMount() {
    let parms = getCurrentQuery();
    if (parms && parms.from == 'testRideDrive') {
      this.props.actions._getCustomerInfo(parms.customerId, (err) => {
        if (!err) this.setState({ sidebarKey: Date.now(), sidebarType: 'contactDetail', sidebarOpen: true, customerId: parms.customerId, from: 'testDrive' });
      });
    } else {
      let { filter } = this.state;
      let { dealerId, id, role } = this.props.common.login;
      filter.dealerId = dealerId;
      filter.dealerUserId = id;

      if (role.indexOf(2) > -1) {
        filter.role = "4";
      }else if (role.indexOf(3) > -1 || role.indexOf(4) > -1) {
        filter.role = '';
        filter.dealerUserId = id;
      } else {
        filter.role = '';
      }
      if (role.indexOf(2) > -1 || role.indexOf(1) > -1) {
        this.props.actions._getAccountsRole(dealerId);
      }
      this.props.actions._getContactList(filter);
    }

  }


  componentWillReceiveProps(nextProps) {
    let { totalsPage, pageIndex, result, allocationMsg, contactDetail } = nextProps.contactsBook;
    if (pageIndex >= totalsPage) {
      this.state.hasMore = 0;
      this.state.filter.pageIndex = 1;
    } else {
      this.state.hasMore = 1;
      this.state.filter.pageIndex = this.state.filter.pageIndex + 1;
    }
    if (this.state.selectAll) this.state.selectList = result.map((item) => {
      return item.id;
    });
    if (allocationMsg) {
      Modal.alert(allocationMsg);
      nextProps.contactsBook.allocationMsg = '';
      this.onClose();
    }
    // if (JSON.stringify(this.props.contactsBook.customerDetail) != JSON.stringify(nextProps.contactsBook.customerDetail)) {
    this.setState({ sidebarKey: Date.now() });
    // }
  }

  refresh(resolve, reject) {
    let { filter } = this.state;
    filter.pageIndex = 1;
    this.props.actions._getContactList(filter);
    resolve();

  }

  _search(filter, selectFilter, selectedPage) {
    if (selectedPage === undefined)selectedPage = this.state.page;
    console.log('000000');
    var text = this.state.searchStr;
    let stateFilter = this.state.filter;
    let { dealerId, id, role } = this.props.common.login;
    this.state.selectList = [];
    if (text) {
      if (parseInt(text) == text) {
        stateFilter.name = '';
        stateFilter.phone = text;
      } else {
        stateFilter.phone = '';
        stateFilter.name = text;
      }
    } else {
      stateFilter.phone = '';
      stateFilter.name = '';
    }

    role = role[0].toString();
    // var dealerUserId = '';
    // if (role.indexOf(2) > -1) {
    //   role = "4";
    // }
    // else if (role.indexOf(3) > -1 || role.indexOf(4) > -1) {
    //   role = '';
    //   dealerUserId = id;
    // }
    // else {
    //   role = '';
    // }

    var toPostFilter;
    if (selectFilter) {
      this.state.selectFilter = selectFilter;
      filter.pageIndex = 1;
      this.state.filter = filter;
      filter.role = role;
      filter.dealerUserId = id;
      if (selectedPage) filter.isMySelf = selectedPage == 'myContactBook';
      toPostFilter = filter;
    } else {
      stateFilter.pageIndex = 1;
      stateFilter.role = role;
      stateFilter.dealerUserId = id;
      if (selectedPage)stateFilter.isMySelf = selectedPage == 'myContactBook';
      toPostFilter = stateFilter;
    }

    //1 销售经理 2 dcc经理 3 展厅销售 4 dcc直销员
    if (selectedPage == 'myContactBook') {
      if (role == 2)toPostFilter.role = 4;
      toPostFilter.dealerUserId = id;
    }else{
      /*
       DCC经理是role是必传的（传role = 4），dealerUserId不用传。
       销售经理role传空，dealerUserId不用传。
       除了经理的其他两个角色role传空，dealerUserId必传。
       */
      if(role == 2) {toPostFilter.role = 4;delete toPostFilter.dealerUserId}
      else if(role == 1){toPostFilter.role = '';delete toPostFilter.dealerUserId}
      else toPostFilter.role = '';
    }

    this.props.actions._getContactList(toPostFilter);

  }

  onClose() {
    Popup.hide();
  }

  onShow(e) {
    e.preventDefault(); // 修复 Android 上点击穿透
    Popup.show(<PopupContent accountList={this.props.contactsBook.accountList} common={this.props.common} selectFilter={this.state.selectFilter}
      filter={this.state.filter} search={this._search} onClose={() => Popup.hide()} />
    );
  }

  _allocation() {
    let { selectList } = this.state;
    if (selectList == 0) {
      return Modal.alert('请选择销售线索');
    }
    Popup.show(
      <Allocation _popHid={this.onClose} common={this.props.common} _allocationAccount={this.props.actions._allocationAccount}
        selectList={selectList} accountList={this.props.contactsBook.accountList} />,
      { animationType: 'slide-up', maskClosable: false }
    );
  }


  loadMore(resolve) {
    this.props.actions._getContactList(this.state.filter);
    resolve();
  }

  _onPanelClose() {
    this.props.contactsBook.customerDetail = {};
    if (getCCDPage()) {
      setCCDPage(false);
      this.props.actions._getContactList(this.state.filter);
    }
    this.setState({sidebarOpen: false, from: ''})
  }

  _onPanelOpen(e) {
    let customerId = e.currentTarget.dataset.id;
    this.props.actions._getCustomerInfo(customerId, (err) => {
      if (!err) this.setState({ sidebarKey: Date.now(), sidebarType: 'contactDetail', sidebarOpen: true, customerId: customerId });
    });
  }

  openMsgPanel(e) {
    var {phone, modelid, optlevel, optid, status, name, gender} = e.currentTarget.dataset;
    this.setState({
      sidebarOpen: true,
      sidebarType: 'msgPanel',
      phoneOfMsgPanel: phone,
      modelIdOfMsgPanel: modelid,
      nameOfMsgPanel: name,
      slOpportunityLevel: optlevel,
      slOpportunityId: optid,
      slStatus: status,
      slGender: gender
    });
  }

  getSidebarDom() {
    var {sidebarType, customerId, sidebarKey, phoneOfMsgPanel, modelIdOfMsgPanel, nameOfMsgPanel, slOpportunityLevel, slOpportunityId, slStatus, slGender} = this.state;
    let actions = this.props.actions;
    if (sidebarType == 'msgPanel')
      return <MsgPanel key={sidebarKey} modelId={modelIdOfMsgPanel} data={{
        phone: phoneOfMsgPanel, modelId: modelIdOfMsgPanel, name: nameOfMsgPanel,opportunityLevel: slOpportunityLevel, dealerUserId:this.props.common.login.id,
        opportunityId: slOpportunityId, status: slStatus, gender:slGender}} store={getStore()} onHeaderClick={() => this.setState({ sidebarOpen: false })} />;
    else if (sidebarType == 'contactDetail') {
      var { customerDetail, accountList } = this.props.contactsBook;
      if (customerId && JSON.stringify(customerDetail) != '{}')
        return (
          <ContactDetail from={this.state.from} _getAccountsRole={actions._getAccountsRole} _updateCustomerInfo={actions._updateCustomerInfo}
                         _keepUp={actions._keepUp} common={this.props.common} customerDetail={customerDetail} key={this.state.sidebarKey} _onPanelClose={this._onPanelClose}
          />
        );
      else return '';
    } else if (sidebarType == 'groupMsgPanel') {
      let selectedCustomers = this.state.selectedCustomers;
      return <MsgPanel msgOnly data={selectedCustomers} store={getStore()} onHeaderClick={() => this.setState({ sidebarOpen: false })} />;
    } else return '';

  }

  _getContactsList(contactsList) {
    console.log('bbbbb');
    let { selectAll, selectList, page } = this.state;
    var lis = [];
    let { product, opportunity_level, customer_status } = this.props.common._dictDataMap;
    contactsList.map((item, idx) => {
      lis.push(<li key={idx} >
        <SwipeAction key={idx} ref={idx} refKey={idx} swipeContent={page == 'myContactBook' ?
          <div style={{ height: '100%', width: '100%' }}>
            <img data-phone={item.mobilePhone} data-name={item.name} data-modelid={item.modelId} data-optlevel={item.oppLevel} data-optid={item.id} data-status={item.potentialCustomerStatus} src={'assets/image/tel-bg.png'}
              style={{ width: '50%', height: '100%', maxHeight: 62 }} onClick={this.openCallPhonePanel} data-gender={item.gender}
            />
            <img data-phone={item.mobilePhone} data-name={item.name} data-modelid={item.modelId} data-optlevel={item.oppLevel} data-optid={item.id} data-status={item.potentialCustomerStatus} src={'assets/image/msg-bg.png'}
              style={{ width: '50%', height: '100%', maxHeight: 62 }} onClick={this.openMsgPanel} data-gender={item.gender}
            />
          </div> : ''} onOpen={(refKey) => { var prevKey = scopedState.prevOpenedTagItem; scopedState.prevOpenedTagItem = refKey; if (this.refs[prevKey]) { this.refs[prevKey].close() } }}
        >
          <div className='contactInfoIcon'>
            <SelectIcon selected={selectAll || selectList.indexOf(item.id) > -1} data={item.id} dealeruid={item.dealerUserId} onSelect={this._selectOne} className={'contactSelectStyle'} />
            <img src={'assets/image/intent-level/' + opportunity_level[item.oppLevel].titleEn + '.png'} data-id={item.id} data-dealeruid={item.dealerUserId} onClick={this._selectOne} />
          </div>
          <div className='contactInfoDetail' data-id={item.id} onClick={this._onPanelOpen}>
            <p>
              <span>{item.name}</span>
              <span>{checkValue(product[item.modelId], 'nameCn')}</span>
            </p>
            <p>
              <span>{customer_status[item.potentialCustomerStatus].statusName}</span>
              <span>上次联系时间：{item.lastCommTime}</span>
            </p>
          </div>
          <div className='rightDot'>
            <span></span>
            <span></span>
            <span></span>
          </div>
        </SwipeAction>
      </li>)
    });
    return lis;
  }

  openCallPhonePanel(e) {
    //!!! not modelId, 取大写要用e.currentTarget.getAttribute('data-modelId')
    var {phone,modelid:modelId,optlevel:opportunityLevel,optid:opportunityId,status} = e.currentTarget.dataset;
    Popup.show(<PhonePanel data={{phone,modelId,opportunityLevel,opportunityId,status,dealerUserId:this.props.common.login.id}} store={getStore()} />, { animationType: 'slide-up' });
  }

  switchPage(e) {
    var selectedPage = e.currentTarget.getAttribute('data-page');
    if (this.state.page != selectedPage) {
      console.log('---------------------->>>',this.__filterPanel);
      this._search(null, null, selectedPage);
      this.setState({ page: selectedPage });
    }
  }

  render() {
    let { selectAll, sidebarOpen, page } = this.state;
    let { result: contactsList, totalsPage, totalsCount, customerDetail, accountList } = this.props.contactsBook;
    let role = this.props.common.login.role;
    let isShowTab = role.indexOf(2) > -1 || role.indexOf(1) > -1;

    //Tloader 不设置 initializing={this.state.initializing}，防止loading条出现
    return (
      <Sidebar sidebar={this.getSidebarDom()} styles={sideBarSt}
        pullRight={true} touch={false} shadow={false}
        open={sidebarOpen}
      >
        <div className='contactsBook'>
          <div  style={!isShowTab ? { height: '1rem'}:{}} className='top clearfix'>
            <div className={isShowTab ? 'clearfix selected-tab' : 'hid'}>
              <div className='col-sm-6'><span data-page="myContactBook" className={'myContactBook' == page ? 'active' : ''} onClick={this.switchPage}>我的通讯录</span></div>
              <div className='col-sm-6'><span data-page="ourContactBook" className={'ourContactBook' == page ? 'active' : ''} onClick={this.switchPage}>本店通讯录</span></div>
            </div>
            <div className='clearfix' style={{ position: 'relative' }}>
              <div className='iconfont icon-sousuo-sousuo col-sm-8 ' >
                <input ref='search' onChange={(e) => { this.setState({ searchStr: e.target.value }) }} placeholder="输入手机号或姓氏姓名" />
              </div>
              <div className='col-sm-2'><span className='btn' onClick={this._search}>搜索</span></div>
              <div className='col-sm-2'><span className='btn' onClick={this.onShow}>筛选</span></div>
            </div>
          </div>

          <div className='contactList' style={isShowTab ? { top: '1.8rem', height: 'calc(100% - 1.8rem)' } : { top: '1rem', height: 'calc(100% - 1rem)' }}>
            <Tloader
              onLoadMore={this.loadMore} hasMore={this.state.hasMore}
              className="tloader">
              <ul>

                <li className='selectAll' ref='selectAll'>
                  <div className={(selectAll ? "checkboxOne checkedBorder" : 'checkboxOne') + ' contactSelectStyle'}>
                    <input type='checkbox' onClick={() => this._selectAll(true)} />
                    <img className={selectAll ? 'showRight' : ''} onClick={() => this._selectAll(false)} src='assets/image/right.png' />
                  </div>
                  <span className='total col-sm-6'>共<i>{totalsCount}</i>条</span>
                  <div className='col-sm-6 fr clearfix'>
                    <p className='col-sm-5'><span className={page == 'myContactBook' ? 'btn' : 'hid'} onClick={this._sendMsg}>短信群发</span></p>
                    {(role.indexOf(2) > -1 || role.indexOf(1) > -1) ? <p className='col-sm-5'><span onClick={this._allocation} className='btn'>分配</span></p> : ''}
                    {/*<p className='col-sm-5'><span onClick={this._allocation} className='btn'>分配</span></p>*/}

                  </div>
                </li>

                {this._getContactsList(contactsList)}
              </ul>
            </Tloader>

          </div>
        </div>
      </Sidebar>
    );
  }

}

export default connect(
  state => ({
    common: state.common,
    contactsBook: state.contactsBook
  }),
  dispatch => ({
    actions: bindActionCreators(actions, dispatch)
  })
)(ContactsBook)