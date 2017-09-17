/**
 * Created by zhongzhengkai on 2016/12/26.
 * 引入reducer使用函数进行处理暴露出去
 * 每一个组件一个reducer
 */
import {bindReducerToWindow} from '../base/common-func';
import homeR from './home';
import requestStatusR from './request-status';
import page1R from './page1';
import listTasksR from './tasklist';

const home = bindReducerToWindow(homeR, 'home'); 
const requestStatus = bindReducerToWindow(requestStatusR, 'requestStatus');
const page1 = bindReducerToWindow(page1R, 'page1');
const list = bindReducerToWindow(listTasksR,'list');

export {
  requestStatus,
  home,    //state.home
  page1,
  list
}
