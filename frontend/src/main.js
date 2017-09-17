/**
 * Created by zhongzhengkai on 2016/12/26.
 */

import React from 'react';
import {render} from 'react-dom';
import {Provider} from 'react-redux';
import {
  App, Login, Home, ContactsBook, BusinessReport, TodayTask, SelfInfo, TalkLibrary, NewContact, Lab,
  FollowUpMaintain, ContentLeadsFollowUp, ArticleList, DigitalCard,TestRideDrive,TestDrive,MyReport
} from './components/index';
import {store, DevTools} from './store/index';
import {getAppViewHeight} from './base/common-func'
import 'react-fastclick';

var Promise = require('es6-promise').Promise;
if (window.Promise == undefined)window.Promise = Promise;

// localStorage.removeItem('common/_dictVersion');
// localStorage.removeItem('common/_dictData');

var rootDiv = document.getElementById('root');
console.debug = console.log;
//<<<------ 根据屏幕宽度修改html元素的fontSize值,方便ant-mobile取rem值时能够适配屏幕大小,不设置的话ant-mobile会写为50px
// var appWidth = getCSSPixelWidth();
var htmlStyle = document.getElementsByTagName('html')[0].style;
// if (appWidth == 414) {//iphone6_plus
//   htmlStyle.fontSize = '32px';
// } else if (appWidth == 375) {//iphone6
//   htmlStyle.fontSize = '27px';
// }
// htmlStyle.fontSize = '10px';
//------>>>

var dt = '';
console.log(__HAS_DEVTOOL__);
if (__HAS_DEVTOOL__ == 'true') dt = DevTools;
// dt = DevTools;


var pathComponentMap = {
  '/login': Login,
  '/home': Home,
  '/contactsBook': ContactsBook,
  '/business-report': BusinessReport,
  '/today-task': TodayTask,
  '/self-info': SelfInfo,
  '/talk-library': TalkLibrary,
 // '/haipeng': HaiPeng,
  '/new-contact': NewContact,
  '/lab': Lab,
  '/follow-up-maintain':FollowUpMaintain,
  '/content-leads-follow-up': ContentLeadsFollowUp,
  '/article-list': ArticleList,
  '/digital-card': DigitalCard,
  '/test-ride-drive':TestRideDrive,
  '/test-drive-hp':TestDrive,
  '/my-report':MyReport,
};

console.debug('%c__BUILD_TIME__:' + __BUILD_TIME__, 'boder:1px solid red;color:red');

// screen.orientation.lock("landscape-primary").catch(ex=>console.log(ex));

render(
  <Provider store={store}>
    <div style={{height: getAppViewHeight(), margin: 0}}>
      <App pathComponentMap={pathComponentMap} path="/login"/>
      {dt}
    </div>
  </Provider>,
  rootDiv
);