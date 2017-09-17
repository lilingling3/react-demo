/**
 * Created by zhongzhengkai on 2017/5/11.
 */

import React, {Component} from 'react';
import {connect} from 'react-redux';
import {bindActionCreators} from 'redux';
import * as actions from '../../actions/content-leads-follow-up';
import './content-leads.css';
import {bindThis, getSidebarStyle, setQuery} from '../../base/common-func';
import SidebarBox from '../common/side-bar-box';
import Sidebar from 'react-sidebar';
import Tloader from 'react-touch-loader';
import NewContact from '../new-contact/index';

const sideBarSt = getSidebarStyle();

class ContentLeadsFollowUp extends Component {
  constructor(props) {
    super(props);
    this.state = {
      page: 'unFollow',
      mobilePhone: '',
      hasMore: 0,
      initializing: 0,
      panel: '',
      panelOpen: false,
      creatingPhone: [],
    };
    bindThis(this, ['switchPage', 'loadMore', 'giveUp',
      'getContentLeadsListByPost', 'initItem', 'Search', 'closePanel', 'openPanel']);
  }

  closePanel() {
    this.setState(
      {panelOpen: false}
    );
  }

  openPanel(e) {
    var id = e.currentTarget.dataset.id;
    var mobilePhone = e.currentTarget.dataset.mobilephone;
    setQuery('/new-contact',{from:'careMePage'});
    this.setState({
      panelOpen: true,
      panel: (
        <SidebarBox onHeaderClick={() => this.setState({panelOpen: false})} headerTitle="建档">
          <NewContact myCareId={id} mobilePhone={mobilePhone} myCareCustomer={true} onLeftIconClick={this.closePanel}/>
        </SidebarBox>
      )
    });
  }

  giveUp(e) {
    console.log(typeof e.currentTarget.getAttribute('data-id'), e.currentTarget.getAttribute('data-id'),
      e.currentTarget.dataset.id);
    this.props.actions.giveUpContentLeads(e.currentTarget.getAttribute('data-id'), "3");
  }

  initItem(item, idx) {
    var varitem;
    if (item.reservedStatus == 1) {
      varitem = <div className='right'>
        <b className='createContact' data-id={item.id} data-mobilePhone={item.mobilePhone}
           onClick={this.openPanel}>建档</b>
        <b className='giveUp' data-id={item.id} onClick={this.giveUp}>放弃</b>
      </div>
    } else if (item.reservedStatus == 2) {
      varitem = <div className='right'>
        <span className='followedState'>已建档</span>
      </div>
    } else if (item.reservedStatus == 3) {
      varitem = <div className='right'>
        <span className='followedState'>已放弃</span>
      </div>
    } else if (item.reservedStatus == 4) {
      varitem = <div className='right'>
        <span className='followedState'>撞单</span>
      </div>
    }
    return <li key={idx}>
      <div>
        <span className='left'>{item.createdDate.split(' ')[0]}</span>
        <span className='center'>{item.mobilePhone}</span>
        {varitem}
      </div>
    </li>;
  }

  switchPage(e) {
    var selectedPage = e.currentTarget.getAttribute('data-page');
    if (this.state.page != selectedPage) {
      this.getContentLeadsListByPost(selectedPage);
      this.setState({page: selectedPage});
    }
  }

  Search(e) {
    if (e.keyCode == 13) {
      var mobilePhone = e.currentTarget.value;
      this.state.mobilePhone = mobilePhone;
      this.getContentLeadsListByPost(this.state.page);
    }
  }

  componentDidMount() {
    this.getContentLeadsListByPost(this.state.page);
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.contentLeadsFollowUp.contactDetail.mobilePhone != undefined) {
      var phone = nextProps.contentLeadsFollowUp.contactDetail.mobilePhone;
      if (this.state.creatingPhone.indexOf(phone) == -1) {
        this.state.creatingPhone.push(phone);
        var unFollow = nextProps.contentLeadsFollowUp.UnFollow;
        for (var i in unFollow) {
          if (unFollow[i].mobilePhone == phone) {
            this.props.actions.giveUpContentLeads(unFollow[i].id, nextProps.contentLeadsFollowUp.contactDetail.status == "9" ? "4" : "2");
          }
        }
      }
      nextProps.contentLeadsFollowUp.contactDetail = {};
    }
  }

  loadMore(resolve) {
    this.getContentLeadsListByPost(this.state.page);
    resolve();
  }

  getContentLeadsListByPost(page) {
    this.props.actions.getContentLeadsListByPost(this.state.mobilePhone, page == 'unFollow' ? 0 : 1);
  }

  render() {
    var {page} = this.state;
    var {UnFollow, HaveFollowed} =this.props.contentLeadsFollowUp;
    var contentLeadsList;
    if (page == 'unFollow') {
      contentLeadsList = UnFollow.map((item, idx) => {
        return this.initItem(item, idx);
      });
    } else {
      contentLeadsList = HaveFollowed.map((item, idx) => {
        return this.initItem(item, idx);
      });
    }
    return (
      <Sidebar sidebar={this.state.panel} styles={sideBarSt}
               pullRight={true} touch={false} shadow={false}
               open={this.state.panelOpen}
      >
        <div className='contentleads'>
          <div className='top'>
            <div className='iconfont icon-sousuo-sousuo sousuo'>
              <input onKeyUp={this.Search} ref='search' placeholder="输入手机号"/>
            </div>
            <div className="selector-box">
              <label data-page="unFollow" className={"selector-item " + ('unFollow' == page ? 'active' : '')}
                     onClick={this.switchPage}>
                未跟进
              </label>
              <label data-page="haveFollowed" className={"selector-item " + ('haveFollowed' == page ? 'active' : '')}
                     onClick={this.switchPage}>
                已跟进
              </label>
            </div>
          </div>
          <div className='contentleadsList'>
            <Tloader
              onLoadMore={this.loadMore} hasMore={this.state.hasMore} initializing={this.state.initializing}
              className="tloader">
              <ul>
                {/*<li>
                 <div>
                 <span className='left'>22222222222</span>
                 <span className='center'>111111111111</span>
                 <div className='right'>
                 <b className='createContact'>建档</b>
                 <b className='giveUp' data-id="1" data-name="222" onClick={this.giveUp}>放弃</b>
                 </div>
                 </div>
                 </li>*/}
                {/*{this._getContentLeadsList()}*/}
                {contentLeadsList}
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
    contentLeadsFollowUp: state.contentLeadsFollowUp,
    common: state.common
  }),
  dispatch => ({actions: bindActionCreators(actions, dispatch)})
)(ContentLeadsFollowUp)
