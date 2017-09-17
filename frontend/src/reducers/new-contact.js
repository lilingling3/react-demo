
import { INSERT_CUSTOMER_INFO, CHECK_DATA_STATUS } from '../constants/action-name';

function getInitialState() {
  return {
    opportunityId: '',
    checkMsg: '',
    contactDetail: {},
    insertMsg:''
  };
}

export default (state = getInitialState(), action) => {
  var { type, payload } = action;
  switch (type) {
    case 'INSERT_CUSTOMER_INFO':
      if (action.payload.message) {
        state.insertMsg = action.payload.message;
      } else {
        state.opportunityId = action.payload.opportunityId;
        state.contactDetail = action.payload.contactDetail;
      }
      return { ...state };
    case 'CHECK_DATA_STATUS':
      state.checkMsg = action.payload;
      return { ...state };
    default:
      return state;
  }
}
