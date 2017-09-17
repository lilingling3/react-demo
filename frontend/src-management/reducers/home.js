/**
 * Created by zhongzhengkai on 2017/5/10.
 */

function getInitialState() {
  return {
    books: [],
    info: {name: '', sex: '', age: 0},
    data: [],
    roles:{},
    operateResult:{},
    hasDccmManager:false
  };
}

export default (state = getInitialState(), action) => {
  var {type, payload} = action;
  switch (type) {
    case 'GET_BOOKS':
      return {...state, books: payload};
    case 'GET_INFO':
      return {...state, info: payload};
    case 'GET_DATA':
      var {staff,roles} = payload;
      // state = getInitialState();
      var data = [];
      for (var i = 0;i<staff.length;i++){
        var tempData = staff[i];
        if(tempData.dccmRoleId == '1'){
          state.hasDccmManager = true;
        }
        data.push({key:i+1,number:i+1,name:tempData.nameCn,dms_account:tempData.loginName,dms_phone:tempData.mobile,
          dms_role:tempData.dmsRoleName,dccm_role:tempData.dccmRoleName,operation:tempData.operationLogs,dccm_role_id:tempData.dccmRoleId,sys_account_id:tempData.sysAccountId})
      }
      state.data = data;
      state.roles = roles;
      return {...state};
    case 'GET_OPERATE_RESULT':
      console.log("operate result is ===>"+payload.toString());
      return {...state,operateResult:payload.result};
    default:
      return state;
  }
}