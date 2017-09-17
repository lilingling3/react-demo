/**
 * Created by zhongzhengkai on 2016/12/26.
 */
import {bindReducerToWindow} from '../base/common-func';
import homeR from './home';
import requestStatusR from './request-status';

const home = bindReducerToWindow(homeR, 'home');
const requestStatus = bindReducerToWindow(requestStatusR, 'requestStatus');

export {
  requestStatus,
  home
}
