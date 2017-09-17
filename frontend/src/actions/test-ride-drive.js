

import { postDataWithFile, getCommonState } from '../base/common-func';
import * as api from '../base/api';
import { INSERT_TEST_DRIVE_INFO, UPLOAD_CARD, DOWN_LOAD_PDF, UPDATE_TEST_DRIVE_INFO, INSERT_FEEDBACK_INFO, GET_CONTACT_INFO_BY_PHONE, GET_LIST_FEEDBACK_INFO, GET_LIST_FEEDBACK } from '../constants/action-name';
import backendCst from '../constants/backend';

//上传文件
export const upload = (fileURL, fieldName) => {
  return dispatch => {
    postDataWithFile({ fileURL, fieldName }, '/api/sps/testDrive/uploadCardIdentification', (reply) => {
      // alert(JSON.stringify(reply));
      dispatch({ type: 'UPLOAD_CARD', payload: reply });
    }, dispatch)
  }
};


const getAccountByRole = (dealerId) => {
  return new Promise(resolve => api.getAccountRole({ dealerId }, data => resolve(data)));
};

const getAccountsAsMap = (dealerId, cb) => {
  const tasks = [getAccountByRole(dealerId)];
  Promise.all(tasks).then(resultList => {
    var map = {};
    resultList[0].forEach(val => map[val.id] = val);
    cb(map);
  });
};

// 附加一些额外的属性到提交的对象上
const attachPropToTDInfo = (data, cb) => {
  var { dealerId, modelId, dealerUserId } = data;
  getAccountsAsMap(dealerId, map => {
    var common = getCommonState();
    var { product, dealer } = common._dictDataMap;
    data.modelDesc = product[modelId] ? product[modelId].nameCn : '';
    data.nameEn = dealer[dealerId] ? dealer[dealerId].nameCn : '';
    data.dealerUserName = map[dealerUserId] ? map[dealerUserId].nameCn : '';
    // data.routeDesc = backendCst.routeConf[data.routeId];
    data.typeDesc = backendCst.testRideConf[data.type];
    cb(data);
  })
};

//新增
export const _insertTestDriveInfo = (postData) => {
  return dispatch => {
    api.insertTestDriveInfo(postData, (data) => {
      dispatch({ type: 'INSERT_TEST_DRIVE_INFO', payload: data });
    }, dispatch)
  }
};

//根据电话查询客户信息
//({ mobilePhone, dealerId: login.dealerId, dealerUserId: login.id })
export const _getContactInfoByPhone = (postData) => {
  return dispatch => {
    api.getOpportunityByPhone({ dealerId:postData.dealerId, phone:postData.mobilePhone }, (data) => {
      var payload = {msg:'no',mobilePhone:postData.mobilePhone};
      if(data){
        payload.msg = '该号码已存在';
        payload.customerInfo = data
      }
      dispatch({ type: 'GET_CONTACT_INFO_BY_PHONE', payload });
    }, dispatch)
  }
};

//查询反馈答案列表 id 试乘试驾id
export const _getListFeedbackInfo = (id, type) => {
  return dispatch => {
    var data = {};
    api.getListFeedbackInfo({ id }, (answer) => {
      data.answer = answer.questionAnswerList;
      api.getListFeedback({ type }, (questions) => {
        data.questions = questions;
        dispatch({ type: 'GET_LIST_FEEDBACK_INFO', payload: data });
      }, dispatch)

    }, dispatch)
  }
};

//查询反馈问题列表
export const _getListFeedback = () => {
  return dispatch => {
    api.getListFeedback({}, (data) => {
      dispatch({ type: 'GET_LIST_FEEDBACK', payload: data });
    }, dispatch)
  }
};

// 新增试驾反馈
export const _insertFeedbackInfo = (postData, customerId) => {
  console.log('AHA');
  let payloadData = {};
  return dispatch => {
    api.insertFeedbackInfo(postData, (feedback) => {
      dispatch({ type: 'INSERT_FEEDBACK_INFO', payload: feedback });
    }, dispatch);

  }
};


//更新客户信息
export const _updateTestDriveInfo = (postData, operateType) => {
  //sendEmail
  if (operateType == 'sendEmail') {
    postData.isSendEmail = 1;
  }
  return dispatch => {
    api.updateTestDriveInfo(postData, (data) => {
      dispatch({ type: 'UPDATE_TEST_DRIVE_INFO', payload: data, operateType });
    }, dispatch)
  }
};



// 下载pdf
export const _downloadPDF = (postData) => {
  return dispatch => {
    attachPropToTDInfo(postData, (newData) => {
      api.downloadPDF(newData, (data) => {
        dispatch({ type: 'DOWN_LOAD_PDF', payload: data });
      }, dispatch)
    });
  }
};


