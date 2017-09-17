/**
 * Created by zhongzhengkai on 2016/12/27.
 */

import {doGet, doPost, justPost, postFormWithFile} from './common-func';

export const listBooks = (cb, dispatch) => {
  doPost('/list-books', {}, cb, dispatch);
};

export const listBooks2 = (cb, dispatch) => {
  justPost('https://form.boldseas.com/qy/wechat/test/list-books', {}, cb, dispatch);
};

export const login = (loginName, password, cb, dispatch) => {
  doPost('/api/sps/login', {loginName, password}, cb, dispatch);
};

export const getPhoneCode = (phoneNumber, cb, dispatch) => {
  // doGet('/api/sps/getDefaultVerificationCode/' + phoneNumber, cb, dispatch, {hasReply: false});
  doGet('/api/sps/getVerificationCode/' + phoneNumber, cb, dispatch, {hasReply: false});
};

export const getBaseDataVersion = (cb, dispatch) => {
  doGet('/api/sps/baseTableVersion/listBaseTableVersions', cb);
};

//<<<------ 各种基础数据字典接口
export const getDictChannel = (cb, dispatch) => {
  doGet('/api/sps/channel/listChannel', cb);
};

export const getDictCustomerStatus = (cb, dispatch) => {
  doGet('/api/sps/customerStatus/listCustomerStatus', cb);
};

export const getDictDealer = (cb, dispatch) => {
  doGet('/api/sps/dealer/listDealer', cb);
};

export const getDictProduct = (cb, dispatch) => {
  doGet('/api/sps/product/listProduct', cb);
};

export const getDictGeography = (cb, dispatch) => {
  doGet('/api/sps/geography/listGeography', cb);
};

export const getDictDictionary = (cb, dispatch) => {
  doGet('/api/sps/dictionary/listDictionary', cb);
};

export const getDictSysRole = (cb, dispatch) => {
  doGet('/api/sps/sysRole/listSysRole', cb);
};

export const getDictOpportunityLevel = (cb, dispatch) => {
  doGet('/api/sps/opportunityLevel/listOpportunityLevel', cb);
};

export const getDictProductSku = (cb, dispatch) => {
  doGet('/api/sps/productSku/listProductSku', cb);
};

export const getDictDealerProduct = (cb, dispatch) => {
  doGet('/api/sps/dealerProduct/listDealerProduct', cb);
};

// export const getDictAllLicense = (cb, dispatch) => {
//   doPost('/api/sps/license/getAllLicense', {}, cb);
// };

//新版的试乘试驾车牌号信息接口
export const getDictAllLicense = (cb, dispatch) => {
  doPost('/api/sps/testDrive/listTestDriveRouteDto', {}, cb);
};
//------>>>

export const getTodayTask = (userId, cb, dispatch) => {
  doGet('/api/sps/waitTasks/listTasksListDetail/' + userId, cb, dispatch);
};

//获取话术库数据
export const getTalkLib = (cb, dispatch) => {
  doGet('/api/sps/salestasklibrary/getSalesTaskLibraryByProductLevel/1', cb, dispatch);
};

//获取客户列表
export const getContactList = (filter, cb, dispatch) => {
  doPost('/api/sps/contacts', filter, cb, dispatch);
};

//获取跟进人列表
export const getAccountRole = (data, cb, dispatch) => {
  // doGet('/api/sps/findAccountRole/' + data.dealerId + '/' + data.roleId, cb, dispatch);
  doGet('/api/sps/sysAccount/listSysAccountsByDealerId/'+data.dealerId, cb, dispatch);
};

//跟进人列表
export const allocationAccount = (data, cb, dispatch) => {
  doPost('/api/sps/CrmDistribution', data, cb, dispatch);
};

//获取客户详情customerId
export const getCustomerInfo = (customerId, cb, dispatch) => {
  doGet('/api/sps/customerInfo/getCustomerInfo/' + customerId, cb, dispatch, {throwError: true});
};

//获取客户沟通历史
export const getCommunicateHistory = (data, cb, dispatch) => {
  doPost('/api/sps/customerInfo/getCommunicateHistory', data, cb, dispatch);
};

//潜客跟进
export const followUp = (data, cb, dispatch) => {
  doPost('/api/sps/customerInfo/follow', data, cb, dispatch, {hasReply: false});
};

//潜客级别默认建议时间
export const getSalesLeadsLevelByDealerId = (dealerId, cb, dispatch) => {
  doGet('/api/sps/getSalesLeadsLevelByDealerId/' + dealerId, cb, dispatch);
};

//跟进周期维护更新
export const UpdateDealerSetSalesLevel = (data, cb, dispatch) => {
  doPost('/api/sps/updateDealerSetSalesLevel', data, cb, dispatch);
};

//潜客跟进
export const updateCustomerInfo = (data, cb, dispatch) => {
  doPost('/api/sps/customerInfo/updateCustomerInfo', data, cb, dispatch, {hasReply: false});
};

//新增潜客
export const insertCustomerInfo = (data, cb, dispatch) => {
  doPost('/api/sps/customerInfo/insertCustomerInfo', data, cb, dispatch, {hasReply: false, throwError: true});
};

//放弃营销线索
export const giveUpContentLeads = (data, cb, dispatch) => {
  doPost('/api/sps/reservedInfo/updateReservedInfo', data, cb, dispatch, {hasReply: false});
};

//获取营销线索列表
export const getContentLeadsListByPost = (data, cb, dispatch) => {
  doPost('/api/sps/reservedInfo/listReservedInfo', data, cb, dispatch);
};

//验证号码
export const checkDataStatus = (data, cb, dispatch) => {
  doPost('/api/sps/customerInfo/checkDataStatus', data, cb, dispatch, {hasReply: false, throwError: true});
};

//根据用户Id获取名片
export const getListSysAccountVcardByAccountId = (sysAccountId, cb, dispatch) => {
  doGet('/api/sps/vcard/listSysAccountVcardByAccountId/' + sysAccountId, cb, dispatch);
};

//获取所有电子名片模板
export const getlistVcardTemplate = (cb, dispatch) => {
  doGet('/api/sps/vcard/listVcardTemplate', cb, dispatch);
};

//获取品牌车型数据
export const getCarGroups = (cb) => {
  doGet('/api/sps/contentMarketing/listGroups', cb);
};

//获取文章类型数据
export const getArticleType = (cb) => {
  doGet('/api/sps/contentMarketing/listContentCategory', cb);
};

export const searchArticleList = (searchParams, cb, dispatch) => {
  doPost('/api/sps/contentMarketing/listContentByPage', searchParams, cb, dispatch);
};

export const getArticleDetail = (id, cb, dispatch) => {
  doGet('/api/sps/contentMarketing/getContentById/' + id, cb, dispatch)
};

//添加电子名片
export const insertSysAccountVcard = (data, cb, dispatch) => {
  doPost('/api/sps/vcard/insertSysAccountVcard', data, cb, dispatch);
};

//累计分享次数
export const addShareCount = (postData, cb, dispatch) => {
  // alert('/contentTemplate/' + contentId + '/' + sysAccountVcardId);
  doPost('/api/sps/contentMarketing/visitShareContent', postData, cb, dispatch, {hasReply: false, json: false});
};

//删除电子名片
export const deleteSysAccountVcard = (data, cb, dispatch) => {
  doPost('/api/sps/vcard/deleteSysAccountVcard', data, cb, dispatch, {hasReply: false});
};

// 新增试乘试驾
export const insertTestDriveInfo = (data, cb, dispatch) => {
  doPost('/api/sps/testDrive/insertTestDriveInfo', data, cb, dispatch, {hasReply: false});
};

//查询试乘试驾信息
export const getListTestDrive = (data, cb, dispatch) => {
  doPost('/api/sps/testDrive/listTestDrive/' + data.opportunityId, data, cb, dispatch);
};

//查询根据电话试乘试驾信息
export const getOpportunityByPhone = (data, cb, dispatch) => {
  doPost('/api/sps/testDrive/getOpportunity/' + data.dealerId + '/' + data.phone, data, cb, dispatch, {hasReply: false});
};

//查询反馈信息列表
export const getListFeedbackInfo = (data, cb, dispatch) => {
  doPost('/api/sps/feedback/listFeedbackInfo/' + data.id, data, cb, dispatch);
};

//查询反馈问题列表
export const getListFeedback = (data, cb, dispatch) => {
  doPost('/api/sps/feedback/listFeedback/' + data.type, data, cb, dispatch);
};

//设置默认电子名片
export const setDefaultSysAccountVcard = (sysAccountId, id, cb, dispatch) => {
  doGet('/api/sps/vcard/setDefaultSysAccountVcard/' + sysAccountId + '/' + id, cb, dispatch, {hasReply: false});
};

//获取今日任务数量
export const getTodayTaskNum = (userId, cb, dispatch) => {
  doGet('/api/sps/waitTasks/getTodayTaskNum/' + userId, cb, dispatch)
};

//获取今日推荐的四篇文章
export const getTodayRecommendContent = (cb, dispatch) => {
  doGet('/api/sps/contentMarketing/getTodayRecommendContent', cb, dispatch)
};

//新增回答的问题
export const insertFeedbackInfo = (data, cb, dispatch) => {
  doPost('/api/sps/feedback/insertFeedbackInfo', data, cb, dispatch, {hasReply: false});
};

//上传头像和二维码
export const uploadFile = (file, cb, dispatch) => {
  postFormWithFile('/api/sps/vcard/uploadFile', file, 'file', null, cb, dispatch);
};

//更新试乘试驾信息
export const updateTestDriveInfo = (data, cb, dispatch) => {
  doPost('/api/sps/testDrive/updateTestDriveInfo', data, cb, dispatch);
};

export const getAndroidLastedVersionInfo = (cb, dispatch) => {
  doGet('/api/sps/appVersion/getLatestVersion/DCCM-Android', cb, dispatch);
};

export const getIosLastedVersionInfo = (cb, dispatch) => {
  doGet('/api/sps/appVersion/getAppStoreInfo/1238570812/CN', cb, dispatch);
};

//下载pdf
export const downloadPDF = (data, cb, dispatch) => {
  doPost('/api/sps/testDrive/downloadPdf', data, cb, dispatch);
};

//获取我的报表数据
export const getMyReportData = (cycleType, cb, dispatch) => {
  doGet('/api/sps/dccmReport/businessDashboard/' + cycleType, cb, dispatch);
};

//获取销售人员的比较数据
export const getMyReportComparison = (dealerId, cycleType, dealerUserIds, cb, dispatch) => {
  doPost('/api/sps/dccmReport/combatAnalysis', {dealerId, cycleType, dealerUserIds}, cb, dispatch);
};

//新增一条沟通历史记录
export const sendCommunicationHistory = (postData)=> {
  doPost('/api/sps/customerInfo/follow', postData, null, null, {hasReply:false});
};