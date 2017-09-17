/**
 * Created by guohuiru on 2017/6/11.
 */

import { INSERT_TEST_DRIVE_INFO, DOWN_LOAD_PDF, UPDATE_TEST_DRIVE_INFO, UPLOAD_CARD, INSERT_FEEDBACK_INFO, GET_CONTACT_INFO_BY_PHONE, GET_LIST_FEEDBACK_INFO, GET_LIST_FEEDBACK } from '../constants/action-name';


function getInitialState() {
  return {
    cardTimes: 1,
    driveDetail: {
      id: '',
      opportunityId: '',
      dealerId: '',
      dealerUserId: '',
      dealerUserName: '',
      modelId: '',
      modelDesc: '',
      nameEn: '',
      nameCn: '',
      moblie: '',
      routeId: '',
      routeDesc: '',
      type: '1',
      typeDesc: '',
      drivingLicenseUrl: '',
      drivingLicenseNo: '',
      signatureUrl: '',
      durationTime: '',
      durationMileage: '',
      contractUrl: '',
      contractNewUrl: '',
      email: '',
      status: '',
      category: '',
      isFinish: 0,
      contractCreateDate: '',
    },
    questions: [],
    answerMsg: '',
    sendEmailMsg: '',
    scoreMsg:'',
    isHasContact: true,
    checkPhoneMsg: '',
    uploadMsg: '',
    questionAnswerList: {}
  };
}

export default (state = getInitialState(), action) => {
  var { type, payload } = action;
  switch (type) {
    case 'GET_CONTACT_INFO_BY_PHONE':
      let { msg, customerInfo , mobilePhone} = payload;
      state = getInitialState();
      if (customerInfo) {
        let { name, modelId, phone, id, status } = customerInfo;//??? 这里确定是id吗，不是dealerUserId吗，id为undefined啊
        state.driveDetail.opportunityId = id;
        state.driveDetail.nameCn = name;
        state.driveDetail.modelId = modelId;
        state.driveDetail.mobile = phone;
        state.driveDetail.status = status;
        state.isHasContact = true;
      } else if (msg == 'no') {
        state.isHasContact = false;
        state.driveDetail.mobile = mobilePhone;
        state.driveDetail.status = '';
      } else {
        state.checkPhoneMsg = msg;
        state.driveDetail.status = '';
      }
      return { ...state };
    case 'INSERT_TEST_DRIVE_INFO':
      state.driveDetail = action.payload;
      return { ...state };
    case 'GET_LIST_FEEDBACK':
      state.questions = action.payload;
      return { ...state };
    case 'INSERT_FEEDBACK_INFO':
      if (!action.payload)
        state.answerMsg = '提交成功';
      return { ...state };
    case 'UPLOAD_CARD':
      state.driveDetail.drivingLicenseUrl = action.payload.filePath;
      state.driveDetail.drivingLicenseNo = action.payload.cardNo;
      state.cardTimes = state.cardTimes + 1;
      // state.uploadMsg = '上传成功,确保识别出来的证件号和你照片上的一致，如果识别失败，可以再次上传(最多5次识别机会)，或者人工填写';
      state.uploadMsg = '上传成功！请核对识别出的驾驶证号是否正确';
      return { ...state };
    case 'UPDATE_TEST_DRIVE_INFO':
      state.driveDetail = action.payload;
      if (action.operateType == 'sendEmail'){
        state.sendEmailMsg = '发送成功';
      } else if(action.operateType == 'updateScore'){
        state.scoreMsg = '更新分数成功';
      }

      return { ...state };
    case 'GET_LIST_FEEDBACK_INFO':
      let { questions, answer } = action.payload;
      if (answer.length > 0) {
        answer.map((item) => {
          state.questionAnswerList[item.questionId] = item;
        })
      } else {
        state.questions = questions ? questions : [];
      }
      return { ...state };
    case 'DOWN_LOAD_PDF':
      if (action.payload)
        state.sendEmailMsg = '发送成功';
      return { ...state };
    default:
      return state;
  }
}
