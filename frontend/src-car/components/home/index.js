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
  }

  render(){
    console.log('%c@@@ Home','color:green;border:1px solid green');
    var booksView = this.props.home.books.map((book,idx)=><h2 key={idx}>{book.name}--{book.age}</h2>);

    return (
      <div>
        this is home
        <hr/>
        <button onClick={()=>this.props.actions.getBooks()}>get books</button>
        {booksView}
      </div>
    );
  }

}

export default connect(
  state=> ({
    home: state.home
  }),
  dispatch => ({actions: bindActionCreators(Actions, dispatch)})
)(Home)




