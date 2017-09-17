/**
 * Created by zhongzhengkai on 2016/12/27.
 */

import {doGet,doPost,justPost, justGet,downloadFile} from './common-func';
import {store} from '../store/index';

const HEADER = {"Content-type":"application/json","apikey":"apiKey-DCCM-Web"};

export const login = (param,cb,dispatch)=> {
  doPost('/api/sps/login',param,cb,dispatch,{headers:HEADER});
}

export const logout = (cb,dispatch)=> {
  doGet('/api/sps/logout',cb,dispatch,{noResultWhen200:true});
}

export const changePassword = (cb,dispatch)=> {
  doPost('/api/sps/resetPwd',cb,dispatch);
}

export const forgetPassword = (account,cb,dispatch)=> {
  doGet('/api/sps/sendMaliResetPassword/'+account,cb,dispatch);
}

export const getStaff = (dealerId,cb,dispatch)=> {
  doGet('/api/sps/sysAccountLocal/getAccoutAndRoleList/'+dealerId,cb,dispatch);
}

export const getRoles = (cb,dispatch)=> {
  doGet('/api/sps/sysAccountLocal/getDccmRole',cb,dispatch);
}

export const operate = (param,cb,dispatch)=> {
  doPost('/api/sps/sysAccountLocal/operateSysAccoutLocal',param,cb,dispatch);
}

export const getHistory = (param,cb, dispatch)=> {
  doPost('/api/sps/customerInfo/importFromExcel/getAllLog',param,cb,dispatch);
};

export const downloadHistory = (logId,result,cb, dispatch)=> {
  doGet('/api/sps/customerInfo/importFromExcel/downloadLog/'+logId+'/'+result,cb,dispatch);
};

export const getProvince = (cb,dispatch)=>{
  doGet('/api/sps/geography/getGeographyByLevel/1',cb,dispatch);
}

export const getCity = (provinceId,cb,dispatch)=>{
  doGet('/api/sps/geography/listGeographyByParentId/'+provinceId,cb,dispatch);
}

export const getModel = (cb,dispatch)=>{
  var dealerId = store.getState().common.login.dealerId;
  doGet('/api/sps/dealerProductList/'+dealerId,cb,dispatch);
}

export const getAllModel = (cb,dispatch)=>{
  doGet('/api/sps/getProductByLevel/2',cb,dispatch);
}

export const getStyle = (modelId,cb,dispatch)=>{
  doGet('/api/sps/getProductByParentId/'+modelId,cb,dispatch);
}

export const getColor = (styleId,cb,dispatch)=>{
  doGet('/api/sps/productSku/listProductSkuByStyleId/'+styleId,cb,dispatch);
}

export const getSourceType = (cb,dispatch)=>{
  doGet('/api/sps/channel/listChannelByLevel/1',cb,dispatch);
}

export const getSource = (typeId,cb,dispatch)=>{
  doGet('/api/sps/channel/listChannelByParentId/'+typeId,cb,dispatch);
}

export const getIntentLevel = (cb,dispatch)=>{
  doGet('/api/sps/opportunityLevel/listOpportunityLevel',cb,dispatch);
}

export const getFollowPerson = (cb,dispatch)=>{
  var dealerId = store.getState().common.login.dealerId;
  doGet('/api/sps/sysAccount/listSysAccountsByDealerId/'+dealerId,cb,dispatch);
}

export const queryMobile = (mobile,cb,dispatch)=>{
  var dealerId = store.getState().common.login.dealerId;
  var id = store.getState().common.login.id;
  var param = {mobilePhone:mobile,dealerId:dealerId,dealerUserId:id};
  doPost('/api/sps/customerInfo/checkDataStatus',param,cb,dispatch,{noResultWhen200:true});
}

export const getDealerInfo = (cb,dispatch)=>{
  var dealerId = store.getState().common.login.dealerId;
  doGet('/api/sps/dealerInfo/'+dealerId,cb,dispatch);
}

export const insertCustomer = (param,cb,dispatch)=>{
  doPost('/api/sps/customerInfo/insertCustomerInfo',param,cb,dispatch);
}



//
// export const getBooks = (cb, dispatch)=> {
//   justGet('http://localhost:3222/api/get-books',cb,dispatch);
// };
//
// export const testPost = (cb, dispatch)=> {
//   doPost('/api/test-post',{param:'test-post'},cb,dispatch);
// };
//
// export const getInfo = (cb,dispatch)=>{
//   doPost('/api/get-info',{},cb,dispatch);
// };
