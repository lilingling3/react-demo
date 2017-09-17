/**
 * Created by zhongzhengkai on 2016/12/26.
 */

import React from 'react';
import {render} from 'react-dom';
import {Provider} from 'react-redux';
import { Home , App, Page1,Test,Task} from './components/index';
import {store, DevTools} from './store/index';
import {getAppViewHeight} from './base/common-func'
import 'react-fastclick';

import './styles/app.css'
import './styles/antd.css'
// localStorage.removeItem('common/_dictVersion');
// localStorage.removeItem('common/_dictData');

var rootDiv = document.getElementById('root');
console.debug = console.log;

var dt = '';
console.log(__HAS_DEVTOOL__);
if (__HAS_DEVTOOL__ == 'true') dt = DevTools;
// dt = DevTools; //react-redux 调试工具

var pathComponentMap = {
  '/home': Home,
  '/page1': Page1,
  '/test':Test,
  '/task':Task
};

//react-router
var noNavComponent = {
  '/table': Home,
};

console.debug('%c__BUILD_TIME__:' + __BUILD_TIME__, 'boder:1px solid red;color:red');

render(
  <Provider store={store}>
    <div style={{height: '100%', margin: 0}}>
      <App pathComponentMap={pathComponentMap} path="/task"/>
      {dt}
    </div>
  </Provider>,
  rootDiv
);

// 根组件嵌套在provider中
// style 属性{{}}
// 组件属性传递数据


