
/**
 * Created by bykj on 2017-5-31.
 */


import React, {Component} from 'react';
import {bindThis, getCSSPixelWidth, getCSSPixelHeight} from '../../base/common-func';
import './haipeng.css';

// 有状态组件 和 无状态组件的区别
// props 和 state 区别
// react 组件生命周期
// 数据驱动视图
// es6语法
// haipeng

const MyH1 = ({h1Str, h2Str})=>{
  return (
    <div style={{boder:'1px solid red'}}>
      <h1>{h1Str}</h1>
      <hr/>
      <h2>{h2Str}</h2>
    </div>
  );
}

export default class HaiPeng extends Component {

  constructor(props, context) {
    super(props, context);
    this.state = {color:'red', arr:[['1','2'],[333,444]]};
    //bindThis(this, ['changeColor']);
    bindThis(this,['addRow']);
    this.changeColor = this.changeColor.bind(this);
  }

  changeColor(){
    var newColor = this.state.color == 'pink' ? 'green' : 'pink';
    this.setState({color:newColor});
  }

  addRow(){
    var newArr = [['1','2'],[3366663,446664]];
    this.setState({arr:newArr});
  }

  render() {
    var {color, arr} = this.state;
    var h1View = arr.map((val, idx)=> <MyH1 key={idx} h1Str={val[0]} h2Str={val[1]} />);

    return (
      <div className="haipeng">
        <h1 style={color}>hello world!!!222222222</h1>
        <button onClick={this.changeColor}>chage color</button>
        <button onClick={this.addRow}>add Row</button>
        <hr/>
        {h1View}
        <hr/>
      </div>
    );
  }
}





