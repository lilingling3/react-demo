import {
  GET_CONTACT_LIST,
  ALLOCATION_ACCOUNT,
  FOLLOW_UP,
  GET_ACCOUNT_ROLE,
  GET_CUSTOMER_INFO,
  UPDATE_CUSTOMER_INFO,
  GET_LIST_TEST_DRIVE
} from '../constants/action-name';

function getInitialState() {
  return {
    "customerDetail": {},
    "allocationMsg": "",
    "pageIndex": 1,
    "pageSize": 10,
    "totalsPage": 0,
    "totalsCount": 0,
    "result": [],
    "accountList": [],
    'updateCustomerMsg': '',
    "followUpMsg": '',
    "ourPageIndex": 1,
    "ourTotalsPage": 0,
    "ourTotalsCount": 0,
    ourResult: [],

  }
}

export default (state = getInitialState(), action) => {
  var {
    type,
    payload
  } = action;
  switch (type) {
    case 'GET_CONTACT_LIST':
      let {
        pageIndex,
        totalsPage,
        totalsCount,
        result
      } = action.payload;

        state.pageIndex = pageIndex;
        state.totalsPage = totalsPage;
        state.totalsCount = totalsCount;
        if (pageIndex > 1) state.result = state.result.concat(result);
        else state.result = result;
   
      return { ...state};

    case 'GET_ACCOUNT_ROLE':
      state.accountList = action.payload;
      return {
        ...state
      };
    case 'ALLOCATION_ACCOUNT':
      state.allocationMsg = action.payload.message;
      return {
        ...state
      };
    case "GET_CUSTOMER_INFO":
      console.log(292321832);
      state.customerDetail = action.payload;
      console.log('dif', state.customerDetail.difTimeBylevels);
      return {
        ...state
      };
    case "FOLLOW_UP":
      if (action.payload.opportunityId == state.customerDetail.opportunityId)
        action.payload.testDriveHistory = state.customerDetail.testDriveHistory;
      state.customerDetail = action.payload;
      state.customerDetail.followUpMsg = action.followUpMsg;
      return { ...state };

    case "UPDATE_CUSTOMER_INFO":
      console.log('UPDATE_CUSTOMER_INFO');
      if (action.payload) {
        //???  提取old用意为什么这没写呢，无形中删掉了原来state中的某些值，比如testDriveHistory
        //var oldCustomerDetail = JSON.parse(JSON.stringify(state.customerDetail));
        //state.customerDetail = action.payload;
        //state.customerDetail.difTimeBylevels = oldCustomerDetail.difTimeBylevels;//??? 何用意
        //state.customerDetail.updateCustomerMsg = '更新成功';

        var oldDifTimeBylevels = state.customerDetail.difTimeBylevels;
        state.customerDetail = {...state.customerDetail, ...payload};
        state.difTimeBylevels = oldDifTimeBylevels;
      }
      return { ...state };

    default:
      return state;
  }
}