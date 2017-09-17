/**
 * Created by lizz on 2017/6/9.
 */
import * as api from '../base/api';

export const getListSysAccountVcardByAccountId = (sysAccountId) => {
  return dispatch => {
    api.getListSysAccountVcardByAccountId(sysAccountId, vCardsInfo => {
      dispatch({type: 'GET_VCARD_LIST', payload: vCardsInfo});
    }, dispatch);
  }
}

export const getlistVcardTemplate = () => {
  return dispatch => {
    api.getlistVcardTemplate(cardTempletes => {
      dispatch({type: 'GET_VCARD_TEMPLETE', payload: cardTempletes});
    }, dispatch);
  }
}

export const insertSysAccountVcard = (data) => {
  return dispatch => {
    api.insertSysAccountVcard(data, vCardInfo => {
      dispatch({type: 'INSERT_ACCOUNT_VCARD', payload: vCardInfo});
    }, dispatch);
  }
}

export const closePreCard = () => {
  return dispatch => {
    dispatch({type: 'CLOSE_PRECARD', payload: null});
  }
}

export const giveUpSysAccountVcard = (data,sysAccountId) => {
  return dispatch => {
    api.deleteSysAccountVcard(data, isSuccessData => {
      dispatch({type: 'GIVEUP_SYSACCOUNT_VCARD', payload: isSuccessData});
      api.getListSysAccountVcardByAccountId(sysAccountId, vCardsInfo => {
        dispatch({type: 'DELETE_SYSACCOUNT_VCARD', payload: vCardsInfo});
      }, dispatch);
    }, dispatch);
  }
}

export const saveSysAccountVcard = (sysAccountId) => {  //与getListSysAccountVcardByAccountId方法相同
  return dispatch => {
    api.getListSysAccountVcardByAccountId(sysAccountId, vCardsInfo => {
      dispatch({type: 'SAVE_SYSACCOUNT_VCARD', payload: vCardsInfo});
    }, dispatch);
  }
}

export const deleteSysAccountVcard = (data, sysAccountId) => {
  return dispatch => {
    api.deleteSysAccountVcard(data, isSuccessData => {
      //dispatch({type: 'DELETE_SYSACCOUNT_VCARD', payload: isSuccessData});
      api.getListSysAccountVcardByAccountId(sysAccountId, vCardsInfo => {
        dispatch({type: 'DELETE_SYSACCOUNT_VCARD', payload: vCardsInfo});
      }, dispatch);
    }, dispatch);
  }
}

export const setDefaultSysAccountVcard = (sysAccountId, id) => {
  return dispatch => {
    api.setDefaultSysAccountVcard(sysAccountId, id, isSetSucceed => {
      dispatch({type: 'SET_DEFAULT_VCARD', payload: isSetSucceed});
      api.getListSysAccountVcardByAccountId(sysAccountId, vCardsInfo => {
        dispatch({type: 'GET_VCARD_LIST', payload: vCardsInfo});
      }, dispatch);
    }, dispatch);
  }
}

//上传头像
export const uploadAvatarFile = (file) => {
  return dispatch => {
    api.uploadFile(file, data => {
      dispatch({type: 'UPLOAD_AVATAR_FILE', payload: data});
    }, dispatch);
  }
}

//上传二维码
export const uploadEWMFile = (file) => {
  return dispatch => {
    api.uploadFile(file, data => {
      dispatch({type: 'UPLOAD_EWM_FILE', payload: data});
    }, dispatch);
  }
}