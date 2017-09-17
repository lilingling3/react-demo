/**
 * Created by zhongzhengkai on 2017/5/10.
 */

import React,{Component} from 'react';
import {connect} from 'react-redux';
import {bindActionCreators} from 'redux';
import * as actions from '../../actions/home';
import {bindThis} from '../../base/common-func';

class Example extends Component{

  constructor(props, context){
    super(props, context);
  }

  render(){
    console.log('%cExample','color:green');
    return (
      <div>
         this is index
      </div>
    );
  }

}

export default connect(
  state=> ({
    home: state.home
  }),
  dispatch => ({actions: bindActionCreators(actions, dispatch)})
)(Example)