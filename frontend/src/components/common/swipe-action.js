/**
 * Created by zhongzhengkai on 2017/5/18.
 */
import {Motion, spring} from 'react-motion';
import React, {Component} from 'react';

/*
 可选参数:maxEndWidth 滑出的矩形最大宽度，默认160
 可选参数:swipeContent 滑出的矩形里包含的内容
 <SwipeAction maxEndWidth={200} swipeContent={<div></div>}>
   {被包裹的dom元素}
 </SwipeAction>
 */
export default  class SwipeAction extends Component {

  constructor(props, context){
    super(props, context);
    var maxEndWidth = props.maxEndWidth ? props.maxEndWidth : 134;
    this.state = {startX: 0, endWidth: 0, maxEndWidth};
    this.handleTouchStart = this.handleTouchStart.bind(this);
    this.handleTouchEnd = this.handleTouchEnd.bind(this);
  }

  handleTouchStart(e){
    this.state.startX = e.nativeEvent.changedTouches[0].clientX;
  }

  handleTouchEnd(e){
    var startX = e.nativeEvent.changedTouches[0].clientX;
    var prevStartX = this.state.startX;
    var diff = startX - prevStartX;
    if(diff > 50)this.setState({endWidth:0});//缩短
    else if(diff < -50){
      if (this.props.onOpen)this.props.onOpen(this.props.refKey);
      this.setState({endWidth:this.state.maxEndWidth});//变长
    }
  }

  close(){
    this.setState({endWidth:0});//缩短
  }

  render(){
    var endWidth = this.state.endWidth;
    var swipeContent = '';
    if(this.props.swipeContent)swipeContent = this.props.swipeContent;
    return(
      <div style={{position:'relative'}} onTouchStart={this.handleTouchStart} onTouchEnd={this.handleTouchEnd}>
        {this.props.children}
        <Motion defaultStyle={{w: 0}} style={{w: spring(endWidth)}}>
          {
            value => (
              <div style={{position:'absolute',height:'100%',width:value.w,right:0, top:0}}>
                {swipeContent}
              </div>
            )
          }
        </Motion>
      </div>
    );
  }

}
