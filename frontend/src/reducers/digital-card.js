/**
 * Created by lizz on 2017/6/9.
 */
function getInitialState() {
  return {
    vCardList: [],
    vCardTemplete: [],
    insertAccountVcard: {},
    setDefaultVcard: false,
    preCardOpen: false,
    giveUpSuccess: false,
    saveSuccess: false,
    avatarImageUrl: '',
    weChatQrCodeUrl: ''
  };
}

export default (state = getInitialState(), action) => {
  var {type, payload}=action;
  switch (type) {
    case 'GET_VCARD_LIST':
      state.vCardList = payload;
      return {...state};
    case 'DELETE_SYSACCOUNT_VCARD':
      state.vCardList = payload;
      return {...state};
    case 'SET_DEFAULT_VCARD':
      state.setDefaultVcard = true;
      return {...state};
    case 'GET_VCARD_TEMPLETE':
      state.vCardTemplete = payload;
      return {...state};
    case 'UPLOAD_AVATAR_FILE':
      state.avatarImageUrl = payload.domainName + payload.groupName + payload.filePathAndName;
      return {...state};
    case 'UPLOAD_EWM_FILE':
      state.weChatQrCodeUrl = payload.domainName + payload.groupName + payload.filePathAndName;
      return {...state};
    case 'INSERT_ACCOUNT_VCARD':
      state.insertAccountVcard = payload;
      return {...state, preCardOpen: true};
    case 'CLOSE_PRECARD':
      return {...state, preCardOpen: false};
    case 'GIVEUP_SYSACCOUNT_VCARD':
      return {...state, giveUpSuccess: true, saveSuccess: false};
    case 'SAVE_SYSACCOUNT_VCARD':
      state.vCardList = payload;
      return {...state, saveSuccess: true, giveUpSuccess: false};
    default:
      return state;
  }
}
