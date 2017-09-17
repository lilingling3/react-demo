/**
 * Created by zhongzhengkai on 2017/5/11.
 */

import React, {Component} from 'react';
import {bindThis, formatDate} from '../../base/common-func';
import {appHistory} from '../app';
import Animate from 'rc-animate';

export default class NavBar extends Component {

  constructor(props, context) {
    super(props, context);
    this.state = {helpPopVisible:false};
    this._redirect = this._redirect.bind(this);
    bindThis(this, ['getCurrentTime'])
  }

  _redirect(e) {
    var path = e.currentTarget.getAttribute('data-path');
    if (path != this.props.path) {
      appHistory.push(path);
    }
  }

  getCurrentTime() {
    var timeView = <span className="time fontRegular">当前时间：{formatDate(new Date(), 1)}</span>;
    return timeView;
  }


  render() {
    var helpPopVisible = this.state.helpPopVisible;
    var {title, children, path} = this.props;
    var timeView = this.getCurrentTime();
    return (
      <div style={{height: '100%'}}>
        <Animate
          transitionName="fade"
          transitionAppear
        >
          {helpPopVisible ?
            <div className="popup">
              <div className="bubble">
                <em className="em"></em>
                <span className="span"></span>
              </div>
              <p className="text">扫描下方二维码或直接微信搜索“Jeep数字营销集中营”，直接在对话框中提交您的疑问或建议，将有专人为您提供相关解答。</p>
              <p className="text">客服时间：9:00-18:00（周一至周日）</p>
              <div style={{textAlign:'center',marginTop:'20px'}}>
                <img className="image" src='/assets/image/manager-platform/weixin-qr-code.jpeg'/>
              </div>
            </div> : null}
        </Animate>

        <div className="titleBar">
          <span className="title fontRegular">卖车宝管理平台</span>
          <div className="right">
            <span className="help" onMouseEnter={()=>{this.setState({helpPopVisible:true})}} onMouseLeave={()=>{this.setState({helpPopVisible:false})}}>帮助</span>
            {timeView}
          </div>
        </div>
        <div style={{height: 'calc(100% - 50px)'}}>
          {children}
        </div>
      </div>
    );
  }

}
