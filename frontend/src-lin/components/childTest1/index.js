// test 组件
import React, { Component } from "react";
import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import * as actions from "../../actions/home";
import { appHistory } from "../app";
import {
  getCurrentQuery,
  logout,
  bindThis,
  getCSSPixelHeight
} from "../../base/common-func";

import "./child1.css";

// 定义主要 TestChild 今日跟进组件
class TestChild extends Component {
  constructor(props, context) {
    super(props, context);
    this.state = {
      openLevel: ""
    };
    bindThis(this, ["openMenu"]);
  }
  openMenu(levelKey) {
    if (this.state.openLevel == levelKey) this.setState({ openLevel: "" });
    else this.setState({ openLevel: levelKey });
  }

  render() {
    var {
      aLevel,
      bLevel,
      cLevel,
      hLevel,
      nLevel,
      oLevel,
      tomorrow
    } = this.props.levelData;
    var { levelData } = this.props.todayTask;
    var { openLevel } = this.state;

    return (
      <div className="child2">
        {Object.keys(this.props.levelData).map((levelKey, idx) => {
          return (
            <TaskItem
              key={idx}
              level={levelKey}
              dataSource={levelData[levelKey]}
              open={openLevel == levelKey}
              openMenu={this.openMenu}
            />
          );
        })}
      </div>
    );
  }
}

// 定义TaskItem子组件
class TaskItem extends Component {
  constructor(props, context) {
    super(props, context);
    bindThis(this, ["headerClick","checkOpenTag"]);
    this.state = {
      openTagKey:'' 
    }
  }
  headerClick() {
    this.props.openMenu(this.props.level);
    // console.log(this.props.level)
  }

  checkOpenTag(tag){
    if(this.state.openTagKey == tag){
      this.setState({ openTagKey: "" });
    }else {
      this.setState({ openTagKey: tag })
    };
  }
  render() {
    var { dataSource, open, openMenu, level } = this.props;
    var { header, tagDetail } = dataSource;
    var tagItemsView = "";
    var {openTagKey} = this.state;
    if (open) {
      // 打开的时候
      tagItemsView = Object.keys(tagDetail).map((tagkey, idx) => {
        var tag = tagDetail[tagkey];
        return <ItemView key={idx} tagkey={tagkey} tag={tag} openItem={tagkey == openTagKey} checkOpenTag = { this.checkOpenTag}/>;
      });
    } else {
      // 关闭的时候
    }
    // 使用bind 函数 绑定this 传递参数
    return (
      <div>
        <p className="TaskItemHeader" onClick={this.props.openMenu.bind(this,this.props.level)}>
          {header}
        </p>
        {tagItemsView}
      </div>
    );
  }
}

//  定义itemView 组件
class ItemView extends Component {
  constructor(props, context) {
    super(props, context);
    bindThis(this, ['toggleTagItem']);
    this.state = {
      open:false
    }
  }
  toggleTagItem(){
    this.setState({
      open:!this.state.open
    }) 
  
    this.props.checkOpenTag(this.props.tagkey);

  }

  render() {
    var { tagkey, tag, checkOpenTag ,openItem} = this.props;
    var tagItem = '';
    var {open} = this.state;
    // 1 -> H 2->A 3->B  4->C  6->N
  var opporLevel = {'1':'H','2':'A',"3":'B','4':'C','6':'N'};
   if(openItem){
    // 点击切换 
      tagItem = (tag.items.map((item,idx) => {
              var {opportunityLevel,name,conventionWalkInDateStart} = item;
              var oppTitleEn = opporLevel[opportunityLevel];
                
                    return(
                      <div key={idx} className="itemBox">
                        <div className="tagLevelIcon">
                          <img style={{ width: '3rem' }} src={'assets/image/intent-level/' + oppTitleEn + '.png'} />
                        </div>
                        <div>
                          <div>{name}</div>
                          <p>下次预约时间 <span>{conventionWalkInDateStart}</span></p>
                        </div>
                     </div>)}))
       
    }
    return (
      
      <div className="tagItemHeader">
        <div>
          <span className="line" />
          <span className="txt" onClick={this.toggleTagItem}>
            {tag.header}<i className={open?'iconfont icon-triangle-up':'iconfont icon-demo03'}/>
          </span>
          <span className="line" />
        </div>
        <div className="tagItemKey">
        {tagItem}
        </div>
        
      </div>
    );
  }
}




// 为什么需要这个页面才能渲染
export default connect(
  state => ({
    todayTask: state.list
  }),
  dispatch => ({ actions: bindActionCreators(actions, dispatch) })
)(TestChild);

// UI 组件生成容器组件