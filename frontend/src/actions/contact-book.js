/**
 * Created by guohuiru on 2017/5/15.
 */

import * as api from '../base/api';
import {
  GET_CONTACT_LIST, GET_ACCOUNT_ROLE, INSERT_CUSTOMER_INFO, GET_LIST_TEST_DRIVE, GET_COMMUNICATE_HISTORY, FOLLOW_UP,
  CHECK_DATA_STATUS, SHOW_LOADING, HIDE_LOADING
} from '../constants/action-name';
import * as dlg from '../base/tool/dlg';
import { getCommonState } from '../base/common-func';
import { setCCDPage } from '../base/refresh-page';

export const _getContactList = (filter) => {
  return dispatch => {
    api.getContactList(filter, (data) => {
      dispatch({ type: 'GET_CONTACT_LIST', payload: data,isMySelf:filter.isMySelf });
    }, dispatch)
  }
};

//查询试乘试驾信息列表
export const _getListTestDrive = (opportunityId) => {
  return dispatch => {
    api.getListTestDrive({ opportunityId }, (data) => {
      dispatch({ type: 'GET_LIST_TEST_DRIVE', payload: data });
    }, dispatch)
  }
};

//跟进人
export const _getAccountRole = (dealerId) => {
  return dispatch => {
    api.getAccountRole({dealerId}, (data) => {
      var list = data.filter(val=> val.role[0]== 3 || val.role[0]== 4);
      dispatch({ type: 'GET_ACCOUNT_ROLE', payload: list });
    }, dispatch)
  }
};


const getAccountByRole = (dealerId) => {
  return new Promise(resolve => api.getAccountRole({ dealerId }, data => resolve(data)));
};

const getAccountsAsList = (dealerId, cb) => {
  const tasks = [getAccountByRole(dealerId)];
  Promise.all(tasks).then(resultList => {
    cb(resultList[0]);
  });
};

export const _getAccountsRole = (dealerId, cb) => {
  console.log('_getAccountsRole-------------------->');
  return dispatch =>{
    getAccountsAsList(dealerId, (list) => {
      let common = getCommonState();
      common.login.account = list;
      cb?cb(list):'';
    });
  }
};

export const _allocationAccount = (allocataionData) => {
  console.log('222');
  return dispatch => {
    api.allocationAccount(allocataionData, (data) => {
      dispatch({ type: 'ALLOCATION_ACCOUNT', payload: data });
    }, dispatch)
  }
};

const getListFeedbackInfo = (id) => {
  return new Promise((resolve, reject) => {
    api.getListFeedbackInfo({ id: id }, (feedbackList) => {
      resolve(feedbackList);
    })
  });
};

export const _getCustomerInfo = (customerId, cb) => {
  console.log('222');
  var payloadData = {};
  return dispatch => {
    dispatch({type:SHOW_LOADING});
    api.getCustomerInfo(customerId, (data, errMessage) => {
      if (errMessage) {
        dlg.info(errMessage);
        dispatch({type:HIDE_LOADING});
        return cb(errMessage);
      }
      payloadData = data;
      api.getCommunicateHistory({ dealerUserId: payloadData.dealerUserId, phone: payloadData.mobilePhone }, (communicateHistory) => {
        payloadData.communicateHistory = communicateHistory;
        api.getSalesLeadsLevelByDealerId(payloadData.dealerId, (difTimeBylevels) => {
          payloadData.difTimeBylevels = difTimeBylevels;
          api.getListTestDrive({ opportunityId: customerId }, (testDriveHistory) => {
            var tasks = [];
            var resultIdx = [];
            payloadData.testDriveHistory = testDriveHistory;
            testDriveHistory.map((item, idx) => {
              item.feedbackList = {};
              if (item.durationMileage && item.durationTime) {
                resultIdx.push(idx);
                tasks.push(getListFeedbackInfo(item.id));
              }
            });
            Promise.all(tasks).then(resultList => {
              dispatch({type:HIDE_LOADING});
              resultList.map((result, idx) => {
                payloadData.testDriveHistory[resultIdx[idx]].feedbackList = result;
              });
              // payloadData.testDriveHistory = payloadData.testDriveHistory.map((item, idx) => {
              //   item.feedbackList = resultList[idx];
              //   return item;
              // })
              cb();
              dispatch({ type: 'GET_CUSTOMER_INFO', payload: payloadData });
            });
          })
        });
      });
    })
  }
};

export const _getCommunicateHistory = (dealerUserId, phone) => {
  console.log('GET_COMMUNICATE_HISTORY');
  return dispatch => {
    api.getCommunicateHistory({ dealerUserId, phone }, (data) => {
      dispatch({ type: 'GET_COMMUNICATE_HISTORY', payload: data });
    }, dispatch)
  }
};

//潜客跟进
export const _keepUp = (postData, customerInfoDate) => {
  console.log('FOLLOW_UP');
  var payloadData = {};
  return dispatch => {
    dispatch({type:SHOW_LOADING});
    api.followUp(postData, (d) => {
      api.getCustomerInfo(postData.opportunityId, (data) => {
        payloadData = data;
        api.getCommunicateHistory({ dealerUserId: customerInfoDate.dealerUserId, phone: customerInfoDate.mobilePhone }, (communicateHistory) => {
          payloadData.communicateHistory = communicateHistory;
          api.getSalesLeadsLevelByDealerId(payloadData.dealerId, (difTimeBylevels) => {
            dispatch({type:HIDE_LOADING});
            payloadData.difTimeBylevels = difTimeBylevels;
            setCCDPage(true);
            dispatch({ type: 'FOLLOW_UP', payload: payloadData, followUpMsg: '提交成功' });
          })
        });
      })
    })
  }
};

export const _updateCustomerInfo = (postData) => {
  console.log('_updateCustomerInfo');
  var payloadData = {};
  return dispatch => {
    dispatch({type:SHOW_LOADING});
    api.updateCustomerInfo(postData, (d) => {
      api.getCustomerInfo(postData.opportunityId, (data) => {
        payloadData = data;
        api.getCommunicateHistory({ dealerUserId: postData.dealerUserId, phone: postData.mobilePhone }, (communicateHistory) => {
          dispatch({type:HIDE_LOADING});
          payloadData.communicateHistory = communicateHistory;
          setCCDPage(true);
          dispatch({ type: 'UPDATE_CUSTOMER_INFO', payload: payloadData });
        })
      })
    })
  }
};

export const _insertCustomerInfo = (postData, cb) => {
  console.log('_insertCustomerInfo');
  return dispatch => {
    api.insertCustomerInfo(postData, (d) => {
      let message = '';
      if (d && d.message) {
        if (d.message.length > 20) message = JSON.parse(d.message).message;
        else message = d.message;
      } else if (d && !d.message) {
        if (cb)cb();
      }
      setCCDPage(true);
      dispatch({type: 'INSERT_CUSTOMER_INFO', payload: {opportunityId: d, contactDetail: postData, message}});
    }, dispatch)
  }
};

export const _checkDataStatus = (postData) => {
  console.log('checkDataStatus');
  return dispatch => {
    api.checkDataStatus(postData, (data) => {
      if (data && data.error) {
        data = JSON.parse(data.message).message;//'该号码已存在'
      } else {
        data = '该手机号可添加';
      }
      dispatch({ type: 'CHECK_DATA_STATUS', payload: data });
    }, dispatch)
  }
};
