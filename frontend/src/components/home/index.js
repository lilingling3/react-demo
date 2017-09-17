/**
 * Created by zhongzhengkai on 2016/12/26.
 */

import React, { Component } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import * as Actions from '../../actions/home';
import * as alActions from '../../actions/article-list';
import { appHistory } from '../app';
import {
  getCurrentQuery, logout, bindThis, getCSSPixelHeight, getSidebarStyle
} from '../../base/common-func';
import './home.css';
import DCCMIcon from '../common/dccm-icon';
import { Motion, spring } from 'react-motion';
import Article from '../article-list/article';
import ArticleDetail from '../article-list/article-detail';
import Sidebar from 'react-sidebar';

const sideBarSt = getSidebarStyle();

class Home extends Component {

  constructor(props, context) {
    super(props, context);
    var articleBoxH = 'calc(100% - 66px - 250px)';
    this.state = {
      functionBoxStartH: 66,
      functionBoxEndH: 66,
      functionBoxH: 66,
      functionBoxStatus: 'closed',
      articleBoxH,
      isPanelOpen: false,
      selectedArticleThumb: '',
      selectedArticleSummary: '',
      selectedArticleSource: ''
    };
    bindThis(this, ['closeFunctionBox', 'openFunctionBox', 'back', 'openArticleDetailPanel']);
  }

  componentDidMount() {
    var actions = this.props.actions;
    actions.getTodayTaskNum(this.props.common.login.id);
    actions.getTodayRecommendContent();
    actions.getCarGroups();
    actions.getArticleType();
  }

  back() {
    this.setState({ isPanelOpen: false });
  }

  openArticleDetailPanel(e) {
    // var id = e.currentTarget.getAttribute('data-id');
    var { id, thumb, summary, source } = e.currentTarget.dataset;
    this.setState({ isPanelOpen: true, selectedArticleThumb: thumb, selectedArticleSummary: summary, selectedArticleSource: source });
    this.props.actions.getArticleDetail(id);
  }

  closeFunctionBox() {
    var articleBoxH = 'calc(100% - 66px - 250px)';
    this.setState({ functionBoxStartH: 206, functionBoxEndH: 66, articleBoxH, functionBoxStatus: 'closed' });
  }

  openFunctionBox() {
    var articleBoxH = 'calc(100% - 206px - 250px)';
    this.setState({ functionBoxStartH: 66, functionBoxEndH: 206, articleBoxH, functionBoxStatus: 'opened' });
  }

  render() {
    console.log('%c@@@ Home', 'color:green;border:1px solid green');
    var { functionBoxStartH, functionBoxEndH, articleBoxH, functionBoxStatus, isPanelOpen, selectedArticleThumb,
      selectedArticleSummary, selectedArticleSource } = this.state;
    var { followTasksNum, receptionTasksNum, contentMarketingOppNum, articles } = this.props.home;
    var { articleTypeValue_label_, articleDetail } = this.props.articleList;
    var { nameCn,role } = this.props.common.login;

    var fifthIcon;
    if (functionBoxStatus == 'opened') fifthIcon = <DCCMIcon key="fifth" type="contacts-book" onClick={() => appHistory.push('/contactsBook')} />;
    else fifthIcon = <DCCMIcon key="fifth" type="more" onClick={this.openFunctionBox} />;

    var articlesView = articles.map((val, idx) => {
      return <Article key={idx} dataSource={val} categoryMap={articleTypeValue_label_} onClick={this.openArticleDetailPanel} />;
    });

    /*
     <DCCMIcon type="my-report" onClick={()=>appHistory.push('/lab')} />
     <DCCMIcon type="follow-up-maintenance" onClick={()=>appHistory.push('/follow-up-maintain')}/>
     <DCCMIcon type="leads-to-allocation" onClick={()=>appHistory.push('/content-leads-follow-up')}/>
     */

    var iconsView = [
      <DCCMIcon key="1" type="today-task" onClick={() => appHistory.push('/today-task')}/>,
      <DCCMIcon key="2" type="drive-registry" onClick={() => appHistory.push('/test-ride-drive')}/>,
      <DCCMIcon key="3" type="article-list" onClick={() => appHistory.push('/article-list')}/>,
      <DCCMIcon key="4" type="new-contact" onClick={() => appHistory.push('/new-contact')}/>,
      fifthIcon,
      <DCCMIcon key="6" type="talk-library" onClick={() => appHistory.push('/talk-library')} />,
      <DCCMIcon key="7" type="digital-card" onClick={() => appHistory.push('/digital-card')} />
    ];
    var visibleIcons = [], invisibleIcons = [<DCCMIcon key="10" type="blank" />];
    if(role.indexOf(1)>-1||role.indexOf(2)>-1)
      visibleIcons.push(<DCCMIcon key="8" type="my-report" onClick={() => appHistory.push('/my-report')} />);
    else invisibleIcons.push(<DCCMIcon key="8" type="blank" />);
    if(role.indexOf(1)>-1)
      visibleIcons.push(<DCCMIcon key="9" type="follow-up-maintain" onClick={() => appHistory.push('/follow-up-maintain')} />);
    else invisibleIcons.push(<DCCMIcon key="9" type="blank" />);
    iconsView = iconsView.concat(visibleIcons).concat(invisibleIcons);


    // var funcBtns = (
    //   <Motion defaultStyle={{ h: functionBoxStartH }} style={{ h: spring(functionBoxEndH) }}>
    //     {
    //       value => {
    //         if (value == 0)setTimeout(()=> this.forceUpdate(), 190);//为了解决ios关闭后，触摸文章列表导致列表白屏的问题
    //         return (
    //           <div className="functionSmallBox" style={{ height: value.h }}>
    //             {iconsView}
    //             <DCCMIcon type="close" onClick={this.closeFunctionBox} />
    //           </div>
    //         );
    //       }
    //     }
    //   </Motion>
    // );
    var funcBtns = (
      <div className="functionSmallBox" style={{ height: functionBoxEndH }}>
        {iconsView}
        <DCCMIcon type="close" onClick={this.closeFunctionBox} />
      </div>
    );

    return (
      <Sidebar sidebar={<ArticleDetail key={Date.now()} dataSource={articleDetail} onHeaderClick={this.back} name={nameCn} summary={selectedArticleSummary}
        thumb={selectedArticleThumb} addShareCount={this.props.actions.addShareCount} source={selectedArticleSource} />}
        styles={sideBarSt} pullRight={true} touch={false} shadow={false} open={isPanelOpen}
      >
        <div className="home-page">
          <div className="headerBox">
            <div className="coffee"></div>
            <div className="texture"></div>
            <div className="followUp" onClick={() => appHistory.push('/today-task', { page: 'followUp' })}>
              <label className="highlight">{followTasksNum.toLocaleString()}</label>个跟进任务
            </div>
            <div className="leads" onClick={() => appHistory.push('/today-task', { page: 'reception' })}>
              <label className="highlight">{receptionTasksNum.toLocaleString()}</label>个接待任务
            </div>
            <div className="reception2" onClick={() => appHistory.push('/content-leads-follow-up')}>
              <label className="highlight">{contentMarketingOppNum.toLocaleString()}</label>条内容营销线索
            </div>
          </div>
          <div className="separator">
            <span>常用功能</span>
          </div>
          {funcBtns}
          <div className="separator">
            <span>今日推荐</span>
          </div>

          <div className="articleList" style={{ height: articleBoxH }}>
            {articlesView}
          </div>
        </div>
      </Sidebar>
    );
  }

}

export default connect(
  state => ({
    home: state.home,
    common: state.common,
    articleList: state.articleList
  }),
  dispatch => ({ actions: bindActionCreators({ ...Actions, ...alActions }, dispatch) })
)(Home)




