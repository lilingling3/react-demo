/**
 * Created by zhongzhengkai on 2017/5/11.
 */

import React, { Component } from 'react';
import {bindThis} from '../../base/common-func';
import { appHistory } from '../app';

export default class NavBar extends Component {

  constructor(props, context) {
    super(props, context);
    this._redirect = this._redirect.bind(this);
  }

  _redirect(e) {
    var path = e.currentTarget.getAttribute('data-path');
    if(path != this.props.path){
      appHistory.push(path);
    }
  }

  render() {
    var {title,children,path} = this.props;
    return (
      <div style={{height:'100%'}}>

        <div style={{border:'1px solid red',height:'50px'}}>header</div>

        <div style={{border:'1px solid blue',height:'calc(100% - 50px)'}}>
          {children}
        </div>
      </div>
    );
  }

}
