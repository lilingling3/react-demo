/**
 * Created by zhongzhengkai on 2016/12/26.
 */
import {bindReducerToWindow} from '../base/common-func';
import homeR from './home';
import requestStatusR from './request-status';
import commonR from './common';
import batchImportR from './batch-data-import';
import singleImportR from './single-data-import';
import historyR from './import-history';
import loginR from './login';
import changePasswordR from './change-password';

const login = bindReducerToWindow(loginR,'login');
const changePassword = bindReducerToWindow(changePasswordR,'changePassword');
const home = bindReducerToWindow(homeR, 'home');
const common = bindReducerToWindow(commonR,'common');
const batchImport = bindReducerToWindow(batchImportR,'batchImport');
const singleImport = bindReducerToWindow(singleImportR,'singleImport');
const requestStatus = bindReducerToWindow(requestStatusR, 'requestStatus');
const history = bindReducerToWindow(historyR,'history');

export {
  requestStatus,
  home,
  common,
  batchImport,
  singleImport,
  history,
  login,
  changePassword
}
