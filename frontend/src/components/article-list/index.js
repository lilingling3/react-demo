/**
 * Created by zhongzhengkai on 2017/6/8.
 */

import React,{Component} from 'react';
import {connect} from 'react-redux';
import {bindActionCreators} from 'redux';
import * as actions from '../../actions/article-list';
import {bindThis, getSidebarStyle} from '../../base/common-func';
import './articel-list.css';
import Picker from 'antd-mobile/lib/picker';
import Article from './article';
import ArticleDetail from './article-detail';
import Sidebar from 'react-sidebar';
import {appHistory} from '../app';

//CC69BAD8-6C9E-5220-9217-2B61B8027564

const CustomChildren = props => (
  <div data-sel={props.sel} onClick={props.onClick} style={{height:30}}>
    <label className="selectorLabel">{props.label}</label><i className="iconfont icon-demo03 selectorIcon"/>
  </div>
);

const articleSourceList = [
  {label: '无', value: '无'},
  {label: '经销商', value: 'DEALER'},
  {label: '总部', value: 'HEADQUARTERS'}
];
const articleSourceVal_label = {'文章来源':'文章来源','DEALER':'经销商','HEADQUARTERS':'总部'};
const sideBarSt = getSidebarStyle();

// HEADQUARTERS --> dealerSubscribe:true
// DEALER --> dealerSubscribe:null
class ArticleList extends Component{

  constructor(props, context) {
    super(props, context);
    var dealerId = this.props.common.login.dealerId;
    var dealerObj = this.props.common._dictDataMap.dealer[dealerId];
    var dealerCode = dealerObj ? dealerObj.dealerCode : '';
    this.state = {
      selectedArticleThumb:'',
      selectedArticleSummary:'',
      selectedArticleSource:'',
      selectedSelector: 'articleSource', // articleSource | brand | articleType
      articleSourceVal: '文章来源',
      brandVal: '品牌车系',
      articleTypeVal: '文章类型',
      brandList: [{label: '无', value: '无'}, {label: '全新Jeep自由侠', value: '全新Jeep自由侠'}],
      articleTypeList: [{label: '无', value: '无'}, {label: '推荐', value: '推荐'}],
      selectedOrder: '',// enableDate | shareCount | readCount
      onlySeeRecommended: false,
      page:1,
      searchParams: {
        search: {
          dealerCode,
          words:'',
          source:[],
          category:'',
          carGroups:[],
          recommendedOnly:false,
          dealerSubscribe:true,
          dealerWords: '',
          status: ['PUBLISHED'],
          terminals: ['DCCM'],
          enabledOnly:true
        },
        page: {
          size: 10,
          page: 1,
          sorts: []
        }
      },
      isPanelOpen: false
    };
    bindThis(this, ['toggleRecommendIcon', 'inputSearchStr', 'toggleOrderIcon', 'toggleSelector', 'changeArticleSource',
      'changeBrand', 'changeArticleType','searchMore','searchByWords','openArticleDetailPanel','back','searchByWordsByEnter']);
  }

  componentDidMount(){
    var actions = this.props.actions;
    actions.searchArticleList(this.state.searchParams);
  }

  back(){
    this.setState({isPanelOpen:false});
  }

  openArticleDetailPanel(e){
    var {id,thumb,summary,source} = e.currentTarget.dataset;
    this.setState({isPanelOpen:true, selectedArticleThumb:thumb, selectedArticleSummary:summary,selectedArticleSource:source});
    this.props.actions.getArticleDetail(id);
  }

  inputSearchStr(e){
    var searchParams = this.state.searchParams;
    searchParams.search.words = e.currentTarget.value;
    this.setState({searchParams});
  }

  searchByWords(){
    var searchParams = this.state.searchParams;
    searchParams.page.page = 1;
    this.props.actions.searchArticleList(searchParams);
  }

  searchByWordsByEnter(e){
    if (e.keyCode == 13) {
      var searchParams = this.state.searchParams;
      searchParams.page.page = 1;
      this.props.actions.searchArticleList(searchParams);
    }
  }

  toggleRecommendIcon(){
    var {onlySeeRecommended,searchParams} = this.state;
    searchParams.search.recommendedOnly = !onlySeeRecommended;
    this.setState({onlySeeRecommended:!onlySeeRecommended, searchParams});
    this.props.actions.searchArticleList(searchParams);
  }

  toggleOrderIcon(e) {
    var selectedOrder = this.state.selectedOrder;
    var nowOrder = e.currentTarget.getAttribute('data-order');
    var searchParams = this.state.searchParams;

    if(nowOrder == selectedOrder){//对已选中的图标变为不选中
      searchParams.page.page = 1;
      searchParams.page.sorts = [];
      this.setState({selectedOrder: '',searchParams});
    }else{
      searchParams.page.sorts = [{property:nowOrder,sortModel:'DESC'}];
      searchParams.page.page = 1;
      this.setState({selectedOrder: nowOrder,searchParams});
    }
    this.props.actions.searchArticleList(searchParams);
  }

  toggleSelector(e){
    var sel = e.currentTarget.getAttribute('data-sel');
    this.setState({selectedSelector: sel});
  }

  changeArticleSource(articleSourceVal){
    if(Array.isArray(articleSourceVal))articleSourceVal=articleSourceVal[0];
    var searchParams = this.state.searchParams;

    if(articleSourceVal=='无')articleSourceVal='文章来源',searchParams.search.dealerSubscribe = true,searchParams.search.source=[];
    else if(articleSourceVal=='DEALER') searchParams.search.dealerSubscribe = null,searchParams.search.source=['DEALER'];
    else if(articleSourceVal=='HEADQUARTERS') searchParams.search.dealerSubscribe = true,searchParams.search.source=['HEADQUARTERS'];
    this.setState({articleSourceVal});
    this.props.actions.searchArticleList(searchParams);
  }

  changeBrand(brandVal){
    if(Array.isArray(brandVal))brandVal=brandVal[0];
    var searchParams = this.state.searchParams;
    if(brandVal=='无')brandVal='品牌车系',searchParams.search.carGroups = [];
    else searchParams.search.carGroups = [brandVal];
    searchParams.page.page = 1;
    this.setState({brandVal});
    this.props.actions.searchArticleList(searchParams);
  }

  changeArticleType(articleTypeVal){
    if(Array.isArray(articleTypeVal))articleTypeVal=articleTypeVal[0];
    var searchParams = this.state.searchParams;
    if(articleTypeVal=='无')articleTypeVal='文章类型',searchParams.search.category = '';
    else searchParams.search.category = articleTypeVal;
    searchParams.page.page = 1;
    this.setState({articleTypeVal});
    this.props.actions.searchArticleList(searchParams);
  }

  searchMore(){
    var searchParams = this.state.searchParams;
    searchParams.page.page += 1;
    this.props.actions.searchArticleList(searchParams, true);
  }

  render(){
    console.log('%c@@@ ArticleList','color:green');
    var {
      selectedSelector, onlySeeRecommended, selectedOrder,articleSourceVal, brandVal, articleTypeVal, searchParams,
      isPanelOpen,selectedArticleThumb,selectedArticleSummary,selectedArticleSource
    } = this.state;
    var {brandList, articleTypeList, brandValue_label_, articleTypeValue_label_, searchResult, articleDetail} = this.props.articleList;
    var {reservedInfoNum, shareArticleNum, vcarDexposureNum,reservedInfoNoProcessNum} = this.props.home;
    var {nameCn} = this.props.common.login;

    var {words} = searchParams.search;

    var articleSourceColor = 'black',brandColor = 'black',articleTypeColor='black',
      articleSourceBB = '1px solid gainsboro',brandBB = '1px solid gainsboro',articleTypeBB='1px solid gainsboro';
    if(selectedSelector=='articleSource')articleSourceColor='#0070BF',articleSourceBB='2px solid #0070BF';
    else if(selectedSelector=='brand')brandColor='#0070BF',brandBB='2px solid #0070BF';
    else articleTypeColor='#0070BF',articleTypeBB='2px solid #0070BF';

    var recommendIconClass = onlySeeRecommended ? 'icon-gou' : 'icon-yuan1';

    var orderIcon1Class='',orderIcon2Class='',orderIcon3Class='';
    if(selectedOrder=='enableDate')orderIcon1Class=' activeOrder';
    else if(selectedOrder=='shareCount')orderIcon2Class=' activeOrder';
    else if(selectedOrder=='readCount')orderIcon3Class=' activeOrder';

    var listView = searchResult.result.map((val, idx)=>
      <Article key={idx} dataSource={val} categoryMap={articleTypeValue_label_}
               onClick={this.openArticleDetailPanel} carGroupsMap={brandValue_label_}/>
    );
    var moreBtn = '';
    if(searchResult.result.length<searchResult.total)
      moreBtn=<div className="more" onClick={this.searchMore}>(已加载{searchResult.result.length}篇) 加载更多...</div>;

    //iconfont aicon-xiangyou
    return (
      <Sidebar sidebar={<ArticleDetail key={Date.now()} dataSource={articleDetail} thumb={selectedArticleThumb} onHeaderClick={this.back} summary={selectedArticleSummary}
                                       name={nameCn} addShareCount={this.props.actions.addShareCount} source={selectedArticleSource} />}
               styles={sideBarSt} pullRight={true} touch={false} shadow={false} open={isPanelOpen}
      >
        <div className="articleList">
          <div className="headerBox">
            <div className="item">
              <div>分享文章次数</div>
              <div className="number">{shareArticleNum}</div>
              <div className="share iconfont">立即分享</div>
            </div>
            <div className="item">
              <div>名片曝光量</div>
              <div className="number">{vcarDexposureNum}</div>
              <div className="share iconfont aicon-xiangyou" onClick={()=>appHistory.push('/digital-card')}>编辑名片</div>
            </div>
            <div className="item">
              <div>客户留资数</div>
              <div className="number">{reservedInfoNum}<span className="corner">{reservedInfoNoProcessNum}</span></div>
              <div className="share iconfont aicon-xiangyou" onClick={()=>appHistory.push('/content-leads-follow-up')}>查看客户</div>
            </div>
          </div>
          <div className="searchBox">
            <div>
              <input  className="inputArea" placeholder="标题搜索" value={words} onChange={this.inputSearchStr} onKeyUp={this.searchByWordsByEnter}/>
              <button className="searchBtn" onClick={this.searchByWords}>搜索</button>
            </div>
            <div>
              <div data-sel="articleSource" className="item" style={{color:articleSourceColor,borderBottom:articleSourceBB}} onClick={this.toggleSelector}>
                <Picker data={articleSourceList} onChange={this.changeArticleSource} cols={1} title="文章来源">
                  <CustomChildren label={articleSourceVal_label[articleSourceVal]} />
                </Picker>
              </div>
              <div className="itemGap"></div>
              <div data-sel="brand" className="item" style={{color:brandColor,borderBottom:brandBB}} onClick={this.toggleSelector}>
                <Picker data={brandList} onChange={this.changeBrand} cols={1} title="品牌车系">
                  <CustomChildren label={brandValue_label_[brandVal]} />
                </Picker>
              </div>
              <div className="itemGap"></div>
              <div data-sel="articleType" className="item" style={{color:articleTypeColor,borderBottom:articleTypeBB}} onClick={this.toggleSelector}>
                <Picker data={articleTypeList} onChange={this.changeArticleType} cols={1} title="文章类型">
                  <CustomChildren label={articleTypeValue_label_[articleTypeVal]} />
                </Picker>
              </div>
            </div>
            <div className="items">
              <label className="order">排序:</label>
              <label className={"orderFactor"+orderIcon1Class} data-order="enableDate" onClick={this.toggleOrderIcon}>上架时间</label>
              <label className={"orderFactor"+orderIcon2Class} data-order="shareCount" onClick={this.toggleOrderIcon}>按分享量</label>
              <label className={"orderFactor"+orderIcon3Class} data-order="readCount" onClick={this.toggleOrderIcon}>按阅读量</label>
              <i className={'recommendIcon iconfont '+recommendIconClass} />
              <label className="recommend" onClick={this.toggleRecommendIcon}>只看推荐文章</label>
            </div>
          </div>
          <div className="articleBox">
            <div className="total"> 共{searchResult.total}篇 </div>
            {listView}
            {moreBtn}
          </div>
        </div>
      </Sidebar>
    );
  }

}

export default connect(
  state=> ({
    articleList: state.articleList,
    common: state.common,
    home: state.home
  }),
  dispatch => ({actions: bindActionCreators(actions, dispatch)})
)(ArticleList)

