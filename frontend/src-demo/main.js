/**
 * Created by zhongzhengkai on 2016/12/26.
 */

import React from 'react';
import {render} from 'react-dom';
import {Provider} from 'react-redux';
import { Home , App} from './components/index';
import {store, DevTools} from './store/index';
import {getAppViewHeight} from './base/common-func'
import 'react-fastclick';

// localStorage.removeItem('common/_dictVersion');
// localStorage.removeItem('common/_dictData');

var rootDiv = document.getElementById('root');
console.debug = console.log;

var dt = '';
console.log(__HAS_DEVTOOL__);
if (__HAS_DEVTOOL__ == 'true') dt = DevTools;
// dt = DevTools;

var pathComponentMap = {
  '/home': Home,
};

var noNavComponent = {
  '/table': Home,
};

console.debug('%c__BUILD_TIME__:' + __BUILD_TIME__, 'boder:1px solid red;color:red');

render(
  <Provider store={store}>
    <div style={{height: '100%', margin: 0}}>
      <App pathComponentMap={pathComponentMap} path="/home"/>
      {dt}
    </div>
  </Provider>,
  rootDiv
);