/**
 * Created by zhongzhengkai on 2017/5/10.
 */

import * as api from '../base/api';
import {appHistory} from '../components/app';
import {
  GET_BASE_DATA_VERSION,
  GET_DICT_CHANNEL,
  GET_DICT_CUSTOMER_STATUS,
  GET_DICT_DEALER,
  GET_DICT_PRODUCT,
  GET_DICT_GEOGRAPHY,
  GET_DICT_DICTIONARY,
  GET_DICT_SYS_ROLE,
  GET_DICT_OPPORTUNITY_LEVEL,
  GET_DICT_PRODUCT_SKU,
  GET_DICT_DEALER_PRODUCT,
  GET_DICT_LICENSE_INFO
} from '../constants/action-name';
import {LS_LOGIN} from '../constants';
import {getStore} from '../base/common-func';

// password就是验证码
/*
 {
 "id": 11512,
 "dealerId": 9,
 "nameCn": "杜豪杰",
 "nameEn": "",
 "role": [
 4
 ],
 "token": "a5c73aa6555446e5bce477220cd402e7",
 "mobile": null,
 "tel": null
 }
 */
export const login = (loginName, password, cb) => {
  return dispatch => {
    api.login(loginName, password, (data) => {
      data.loginName = loginName;
      getStore().getState().common.login = data;
      api.getAccountRole({dealerId: data.dealerId}, (accList) => {
        data.account = accList.filter(val=> val.role[0]== 3 || val.role[0]== 4);
        localStorage.setItem(LS_LOGIN, JSON.stringify(data));
        dispatch({type: 'LOGIN_DCCM', payload: data});
        cb();
      }, dispatch);
    }, dispatch)
  }
};

export const getPhoneCode = (phoneNumber) => {
  return dispatch => {
    api.getPhoneCode(phoneNumber, (data) => {
      dispatch({type: 'LOGIN_DCCM', payload: data});
    }, dispatch)
  }
};

//forceSync 标记是否要强制同步数据
export const getBaseDataVersion = (forceSync = false, cb) => {
  return dispatch => {
    api.getBaseDataVersion((data) => {
      dispatch({type: 'GET_BASE_DATA_VERSION', payload: {forceSync, tableVersions:data}, cb});
    }, dispatch)
  }
};

export const getDictChannel = (cb) => {
  return dispatch => {
    api.getDictChannel((data) => {
      dispatch({type: GET_DICT_CHANNEL, payload: data, cb});
    }, dispatch)
  }
};

export const getDictCustomerStatus = (cb) => {
  return dispatch => {
    api.getDictCustomerStatus((data) => {
      dispatch({type: GET_DICT_CUSTOMER_STATUS, payload: data, cb});
    }, dispatch)
  }
};

export const getDictDealer = (cb) => {
  return dispatch => {
    api.getDictDealer((data) => {
      dispatch({type: GET_DICT_DEALER, payload: data, cb});
    }, dispatch)
  }
};

export const getDictProduct = (cb) => {
  return dispatch => {
    api.getDictProduct((data) => {
      dispatch({type: GET_DICT_PRODUCT, payload: data, cb});
    }, dispatch)
  }
};

export const getDictGeography = (cb) => {
  return dispatch => {
    api.getDictGeography((data) => {
      dispatch({type: GET_DICT_GEOGRAPHY, payload: data, cb});
    }, dispatch)
  }
};

export const getDictDictionary = (cb) => {
  return dispatch => {
    api.getDictDictionary((data) => {
      dispatch({type: GET_DICT_DICTIONARY, payload: data, cb});
    }, dispatch)
  }
};

export const getDictSysRole = (cb) => {
  return dispatch => {
    api.getDictSysRole((data) => {
      dispatch({type: GET_DICT_SYS_ROLE, payload: data, cb});
    }, dispatch)
  }
};

export const getDictOpportunityLevel = (cb) => {
  return dispatch => {
    api.getDictOpportunityLevel((data) => {
      dispatch({type: GET_DICT_OPPORTUNITY_LEVEL, payload: data, cb});
    }, dispatch)
  }
};

export const getDictProductSku = (cb) => {
  return dispatch => {
    api.getDictProductSku((data) => {
      dispatch({type: GET_DICT_PRODUCT_SKU, payload: data, cb});
    }, dispatch)
  }
};

export const getDictDealerProduct = (cb) => {
  return dispatch => {
    api.getDictDealerProduct((data) => {
      dispatch({type: GET_DICT_DEALER_PRODUCT, payload: data, cb});
    }, dispatch)
  }
};

export const getDictAllLicense = (cb) => {
  return dispatch => {
    api.getDictAllLicense((data) => {
      dispatch({type: GET_DICT_LICENSE_INFO, payload: data, cb});
    }, dispatch)
  }
};

