/**
 * Created by bykj on 2017-6-26.
 */
function getInitialState() {
  return {
    uploadResult: {
      logId: -1,
      failedData: [],
      successNum:-1,
      errorNum:-1
    }
  };
}

export default (state = getInitialState(), action) => {
  var {type, payload} = action;
  switch (type) {
    case 'UPLOAD_RESULT':
      var data = [];
      var response = payload.response;
      var errorList = response.errorList;
      if (errorList != null) {
        for (var i = 0; i < errorList.length; i++) {
          var errorData = errorList[i].cus;
          data.push({
            follow_person:errorData.followUpPerson,
            name: errorData.name,
            type: errorData.customerType,
            sex: errorData.sex,
            mobile: errorData.phoneNum,
            province: errorData.province,
            city: errorData.city,
            intent_model: errorData.model,
            intent_style: errorData.style,
           // car_color: errorData.color,
            intent_level: errorData.opportunityLevel,
            buy_type: errorData.buyCarType,
            source_type: errorData.channelType,
            source: errorData.channelName,
            receive_time: errorData.prospectCreateDate,
            is_arrive: errorData.isWalkIn,
            //next_theme: errorData.nextCommunicateContent,
           // appoint_time: errorData.nextCommunicateDate,
            //remark: errorData.description,
            error_message:errorList[i].msg
          })
        }
      }
      state.uploadResult.successNum = response.successNum;
      state.uploadResult.errorNum = response.errorNum;
      state.uploadResult.logId = response.logId;
      state.uploadResult.failedData = data;
      return {...state};
    default:
      return state;
  }
}