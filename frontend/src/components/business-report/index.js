/**
 * Created by 郭会茹 on 2017/5/15.
 */

import React,{Component} from 'react';
import {connect} from 'react-redux';
import {bindActionCreators} from 'redux';
import * as actions from '../../actions/home';
import {getCurrentQuery} from '../../base/common-func';

class BusinessReport extends Component{

  constructor(props, context){
    super(props, context);
  }

  render(){
    return (
      <div>
      </div>
    );
  }

}

export default connect(
  state=> ({
    home: state.home,
    businessReport:state.businessReport
  }),
  dispatch => ({actions: bindActionCreators(actions, dispatch)})
)(BusinessReport)