/**
 * Created by zhongzhengkai on 2016/12/26.
 */
import {bindReducerToWindow} from '../base/common-func';
import commonR from './common';
import loginR from './login';
import homeR from './home';
import selfInfoR from './self-info';
import requestStatusR from './request-status';
import contactsBookR from './contacts-book';
import businessReportR from './business-report';
import todayTaskR from './today-task';
import talkLibraryR from './talk-library';
import newContactR from './new-contact';
import FollowUpMaintainR from './follow-up-maintain'
import contentLeadsFollowUpR from './content-leads-follow-up';
import testRideDriveR from './test-ride-drive';
import digitalCardR from './digital-card';
import articleListR from './article-list';
import myReportR from './my-report';


const login = bindReducerToWindow(loginR, 'login');
const home = bindReducerToWindow(homeR, 'home');
const selfInfo = bindReducerToWindow(selfInfoR,'selfInfo');
const requestStatus = bindReducerToWindow(requestStatusR, 'requestStatus');
const common = bindReducerToWindow(commonR, 'common');
const contactsBook = bindReducerToWindow(contactsBookR, 'contactsBook');
const businessReport = bindReducerToWindow(businessReportR, 'businessReport');
const todayTask = bindReducerToWindow(todayTaskR, 'todayTask');
const talkLibrary = bindReducerToWindow(talkLibraryR, 'talkLibrary');
const newContact = bindReducerToWindow(newContactR, 'newContact');
const followUpMaintain=bindReducerToWindow(FollowUpMaintainR,'followUpMaintain')
const contentLeadsFollowUp = bindReducerToWindow(contentLeadsFollowUpR, 'contentLeadsFollowUp');
const testRideDrive = bindReducerToWindow(testRideDriveR, 'testRideDrive');
const digitalCard = bindReducerToWindow(digitalCardR, 'digitalCard');
const articleList = bindReducerToWindow(articleListR, 'articleList');
const myReport = bindReducerToWindow(myReportR, 'myReport');

export {
  common,
  login,
  requestStatus,
  home,
  contactsBook,
  businessReport,
  todayTask,
  talkLibrary,
  newContact,
  selfInfo,
  followUpMaintain,
  contentLeadsFollowUp,
  testRideDrive,
  digitalCard,
  articleList,
  myReport
}
