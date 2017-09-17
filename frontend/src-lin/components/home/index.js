/**
 * Created by zhongzhengkai on 2017/6/14.
 */

import React,{Component} from 'react';
import {connect} from 'react-redux';
import {bindActionCreators} from 'redux';
import * as Actions from '../../actions/home';
import {appHistory} from '../app';
import {
  getCurrentQuery, logout, bindThis, getCSSPixelHeight
} from '../../base/common-func';
import './home.css';


class Home extends Component{
  constructor(props, context){
    super(props, context);
    this.state = {books:[],bg:'red'}; // 初始化state
    bindThis(this,['getBooks2','changeColor','getBooks','changeColor2']); //更改this
  }

  getBooks2(){
    // 本地组件管理
    var books = [{name:111,age:2222}];
    this.setState({books});
  }
  getBooks(){
    // reducer触发
    this.props.actions.getBooks()
    // var books = this.props.home.books;
    // console.log(books)
  }

  changeColor(){
    this.props.actions.changeColor()
  }
  changeColor2(){
    this.setState({bg:'yellow'});
  }

  render(){
    console.log('%c@@@ Home','color:green;border:1px solid green');
    //reducer触发
    var booksView1 = this.props.home.books.map((book,idx)=><h2 key={idx}>reducer 方式获取数据{book.name}--{book.age}</h2>);
    // 组件自己管理
    var booksView2 = this.state.books.map((book,idx)=><h2 key={idx}>组件自己管理更改状态{book.name}--{book.age}</h2>);

    return (
      <div style={{backgroundColor:this.state.bg}}>
        this is home
        <hr/>
        <button onClick={this.getBooks2}>组件内部管理的方式get books</button> <br/>
        <button onClick={this.getBooks}>reducer 方式 get books</button> <br/>
        <button onClick={this.changeColor}>组件内部管理的方式changeColork</button><br/>
        <button onClick={this.changeColor2}>组件内部管理的方式changeColork</button><br/>
        <button onClick={()=>appHistory.push('/page1')}>jump to page1</button> <br/>
        <button onClick={()=>appHistory.push('/test')}>jump to test</button><br/>
        {booksView1}
        {booksView2}
      </div>
    );
  }

}

export default connect(
  state=> ({
    home: state.home     //this.props.home 名称 跟home名称跟一致
  }),
  dispatch => ({actions: bindActionCreators(Actions, dispatch)})
)(Home)





