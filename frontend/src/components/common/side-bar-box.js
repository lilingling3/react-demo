/**
 * Created by zhongzhengkai on 2017/6/21.
 */

import React, {Component} from 'react';
import './side-bar-box.css'

export default ({onHeaderClick,headerTitle='',children})=>{
  return (
    <div className="sbarbox">
      <div className="header" onClick={onHeaderClick}>
        <i className="iconfont icon-xiangzuo2 headerIcon" />{headerTitle}
      </div>
      <div className="content">
        {children}
      </div>
    </div>
  );
}