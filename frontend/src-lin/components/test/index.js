// test 组件
import React,{Component} from 'react';
import {connect} from 'react-redux';
import {bindActionCreators} from 'redux';
// import * as Actions from '../../actions/test';
import * as actions from '../../actions/home';
import {appHistory} from '../app';

import {
    getCurrentQuery, logout, bindThis, getCSSPixelHeight
  } from '../../base/common-func';

// 定义组件
class Test extends Component {
    constructor(props,context){
        super(props,context);
    }

    render(){
        return(
            <div>
             这是一个测试页面
            </div>
        );
    }
}
// 为什么需要这个页面才能渲染
export default connect(
    // state=> ({
    //   home: state.home
    // }),
    // dispatch => ({actions: bindActionCreators(actions, dispatch)})
  )(Test)

// UI 组件生成容器组件
