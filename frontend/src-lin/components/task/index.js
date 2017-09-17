// test 组件
import React,{Component} from 'react';
import {connect} from 'react-redux';
import {bindActionCreators} from 'redux';
import * as actions from '../../actions/taskLists';
import {appHistory} from '../app';

// 引入子组件
import ChildTest1 from '../childTest1';
import ChildTest2 from '../childTest2';

import './task.css'
import {
    getCurrentQuery, logout, bindThis, getCSSPixelHeight
  } from '../../base/common-func';

// 定义组件
class Test extends Component {
    constructor(props,context){
        super(props,context);
        
        // 组件内部设置 更改state
        this.state = {
            isShow:'block',
            childSecondShow:'none',
            bg:true
        }
        bindThis(this,['changNav1','changNav2']);
    }

    componentDidMount() {
        // 发送ajax 请求
        // api.get((tasklist)=>{
        //     this.setState({})
        // })

        // 使用action 更改数据  引入不同的action得到不同的数据
        this.props.actions.getListTasks();
    }
    changNav1(){
        
        this.setState({
            bg:!this.state.bg,
            isShow:'block',
            childSecondShow:'none'
        })
    }
    changNav2(){
        this.setState({
            bg:!this.state.bg,
            isShow:'none',
            childSecondShow:'block',
        })
    }
    render(){
        var { levelData, todayReceptionData, followCount, receptionCount } = this.props.todayTask;
        return(
            <div>
             <div className='nav clearfix'>
               <div className='navLeft' onClick={this.changNav1} style={{background:this.state.bg?'#ccc':'#fff'}}>今日跟进({followCount})</div>
               <div className='navRight' onClick={this.changNav2} style={{background:this.state.bg?'#fff':'#ccc'}}>今日接待({receptionCount})</div>
             </div>
             <div className='taskContent'>
                <div style={{display:this.state.isShow}}>
                    <ChildTest1 levelData={levelData}></ChildTest1>
                </div>
           
                <div style={{display:this.state.childSecondShow}}>
                    <ChildTest2 todayReceptionData={todayReceptionData}></ChildTest2>
                </div>
             </div>

             <ul className='taskFooter'>
                <li onClick={this.getLists}><img src='/assets/image/intent-level/todayList.png'/><p>今日任务</p></li>
             </ul>
            </div>
        );
    }
}
// 为什么需要这个页面才能渲染
export default connect(
    state=> ({
        todayTask: state.list
    }),
    dispatch => ({actions: bindActionCreators(actions, dispatch)})
  )(Test)

// UI 组件生成容器组件
