/**
 * Created by zhongzhengkai on 2017/5/26.
 */
import React,{Component} from 'react';
import {connect} from 'react-redux';
import {bindActionCreators} from 'redux';
import * as actions from '../../actions/talk-library';
import {bindThis,getCSSPixelWidth} from '../../base/common-func';
import './talk-library.css';

var libWidth = parseInt(getCSSPixelWidth() / 3);
const libItemActiveSt = {
  display: 'inline-block', boxSizing: 'border-box', width: libWidth, height: 45,
  borderBottom: '3px solid #515151', textAlign: 'center',overflow:'hidden',verticalAlign:0
};
const libItemSt = {
  display: 'inline-block', boxSizing: 'border-box', width: libWidth, height: 45,
  textAlign: 'center',overflow:'hidden',verticalAlign:0,borderBottom:'3px solid #d9d8d8',color:'#a1a0a0'
};
const categoryItemActiveSt = {display: 'inline-block', boxSizing: 'border-box', width: '33%', height: 35,textAlign: 'center'};
const categoryItemActiveSt1 = {display: 'inline-block', boxSizing: 'border-box', width: '33%', height: 35,textAlign: 'center',borderLeft:'1px solid lightgray'};
const categoryItemSt = {  display: 'inline-block', boxSizing: 'border-box', width: '33%', height: 35,textAlign: 'center', color:'gray'};
const categoryItemSt1 = {  display: 'inline-block', boxSizing: 'border-box', width: '33%', height: 35,textAlign: 'center', color:'gray',borderLeft:'1px solid lightgray'};

const lib_text_ = {
  DaQieNuoJiLib: '进口大切诺基', JeepFreeLightLib: '全新Jeep自由光', JeepFreeManLib: '全新自由侠',
  JeepCompassLib: '全新指南者', commonLib: '通用话术'
};
const libNames = Object.keys(lib_text_);

const category_text_ = {
  features:'产品卖点', talkWords:'电话话术', messageText:'短信脚本'
};
const category_icon_ = {
  features:'icon-wujiaoxing', talkWords:'icon-phone-alt', messageText:'icon-duanxin2'
};

const NoneItem = ({item})=>{
  var {content, isContentHtml} = item;
  var contentView;
  if(isContentHtml)contentView = <div dangerouslySetInnerHTML={{__html:content}} />;
  else contentView = content;
  return (
    <div className="itemBox noTitle">
      {contentView}
    </div>
  );
};


const NormalItem = ({item})=>{
  var {content, isContentHtml, title} = item;
  var contentView;
  if (isContentHtml)contentView = <div dangerouslySetInnerHTML={{__html: content}} ></div>;
  else contentView = (
    <div>
      <div className="normalTitle">{title}</div>
      <div className="normalContent">{content}</div>
    </div>
  );

  return (
    <div className="itemBox">
      {contentView}
    </div>
  );
};

const ExpandableItem = ({item, expanded, onTitleClick, idx})=>{
  var {content, isContentHtml, title} = item;
  var contentView;
  if (isContentHtml)contentView = <div dangerouslySetInnerHTML={{__html: content}} ></div>;
  else {
    var contentDetail = '';
    var titleIcon = 'icon-xiangyou';
    if(expanded){contentDetail = <div><div className="content">{content}</div></div>; titleIcon = 'icon-xiangxia';}
    contentView = (
      <div className="itemBox">
        <div onClick={()=> onTitleClick(idx)}>
          <div className="title">{title}<i className={'iconfont '+titleIcon+' titleIcon'}/></div>
        </div>
        {contentDetail}
      </div>
    );
  }

  return (
    <div>
      {contentView}
    </div>
  );
};

class TalkLibrary extends Component{

  constructor(props, context) {
    super(props, context);
    this.state = {selectedLib: 'DaQieNuoJiLib', selectedCategory: 'features', selectedDescription:'', expandedIdx:-1};
    bindThis(this,['changeLib', 'changeCategory','changeDescription','changeExpandedIdx'])
  }

  changeLib(e){
    this.setState({selectedLib: e.currentTarget.dataset.lib, selectedDescription:''});
  }

  changeCategory(e){
    this.setState({selectedCategory: e.currentTarget.dataset.category});
  }

  changeDescription(e) {
    var selectedDescription = this.state.selectedDescription;
    var description = e.currentTarget.dataset.description;
    if (description == selectedDescription)this.setState({selectedDescription: '', expandedIdx:-1});
    else this.setState({selectedDescription: description, expandedIdx:-1});
  }

  changeExpandedIdx(inputExpandedIdx) {
    var expandedIdx = this.state.expandedIdx;
    if (inputExpandedIdx == expandedIdx) this.setState({expandedIdx: -1});
    else this.setState({expandedIdx: inputExpandedIdx});
  }

  componentDidMount(){
    this.props.actions.getTalkLib();
  }

  render(){
    console.log('%cTalkLibrary','color:green');
    var {selectedLib, selectedCategory, selectedDescription, expandedIdx} = this.state;
    console.log(selectedLib, selectedCategory, selectedDescription);

    var libItemsView = libNames.map((lib, idx)=>
      <div key={idx} data-lib={lib} style={(selectedLib == lib ? libItemActiveSt : libItemSt)} onClick={this.changeLib}>{lib_text_[lib]}</div>
    );

    var libDetail = this.props.talkLibrary[selectedLib], contentItemsView=[];
    var categoryItemsView = Object.keys(libDetail).map((category, idx)=> {
      var style, isSelectedCategory = selectedCategory == category;
      if (idx == 0)style = isSelectedCategory ? categoryItemActiveSt : categoryItemSt;
      else style = isSelectedCategory ? categoryItemActiveSt1 : categoryItemSt1;

      if(isSelectedCategory){
        var categoryDetail = libDetail[category];
        var descriptions = Object.keys(categoryDetail);
        descriptions.forEach((description, idx)=>{
          var items = categoryDetail[description].items;
          var itemsView = '', descriptionIcon = 'icon-xiangyou';
          if(selectedDescription == description){
            descriptionIcon = 'icon-xiangxia';
            itemsView = items.map((item, idx)=> {
              var titleType = item.titleType;
              if (titleType == 'none')return <NoneItem key={idx} item={item} />;
              else if (titleType == 'normal')return <NormalItem key={idx} item={item} />;
              else if (titleType == 'expandable')
                return <ExpandableItem key={idx} idx={idx} item={item} expanded={expandedIdx==idx} onTitleClick={this.changeExpandedIdx} />;
            });
          }

          contentItemsView.push(
            <div key={idx} className="descriptionBox">
              <div className="description" data-description={description} onClick={this.changeDescription}>
                {description}<i className={'iconfont ' + descriptionIcon + ' icon'}/>
              </div>
              {itemsView}
            </div>
          );
        });
      }

      return (
        <label key={idx} data-category={category} style={style} onClick={this.changeCategory}>
          <i className={"iconfont " + category_icon_[category]} style={{fontSize: '.38rem', paddingRight: 6}}/>
          {category_text_[category]}
        </label>
      );
    });



    return (
      <div className="talk-library">
        <div className="libsBox">
          <div style={{width: libWidth * 5}}>
            {libItemsView}
          </div>
        </div>
        <div className="categoryBox">
          {categoryItemsView}
        </div>
        <div className="items">
          {contentItemsView}
        </div>
      </div>
    );
  }

}

export default connect(
  state=> ({
    talkLibrary: state.talkLibrary
  }),
  dispatch => ({actions: bindActionCreators(actions, dispatch)})
)(TalkLibrary)