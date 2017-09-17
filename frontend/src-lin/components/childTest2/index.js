// test 组件
import React,{Component} from 'react';
import {connect} from 'react-redux';
import {bindActionCreators} from 'redux';
import * as actions from '../../actions/home';
import {appHistory} from '../app';
import './child2.css'

import {
    getCurrentQuery, logout, bindThis, getCSSPixelHeight
  } from '../../base/common-func';

// 定义组件
class TestChild extends Component {
    constructor(props,context){
        super(props,context);
        bindThis(this,[]);
    }
    componentDidMount() {
    }
    render(){
        // render 的时候订阅
        // console.log('@@@@@@@@@@@@@@@@@@@'+JSON.stringify(this.props.todayReceptionData));
        var {invited,received}  = this.props.todayReceptionData
        return(
            <ul className='child2'>

               <li className="invited">
                    <span className="line"></span>
                    <span className='txt'>{invited.header} </span>
                    <span className="line"></span>
               </li>

               <li className="received">
                    <span className="line"></span>
                    <span className='txt'>{received.header} </span>
                    <span className="line"></span>
               </li>
            </ul>
        );
    }
}
// 为什么需要这个页面才能渲染
export default connect(
    state=> ({
      task: state.list
    }),
    dispatch => ({actions: bindActionCreators(actions, dispatch)})
  )(TestChild)

// UI 组件生成容器组件

// this.props.task 获取 state
// this.props.action.getListTasks 获取action

// connect 函数 传递 state dispatch