/**
 * Created by zhongzhengkai on 2017/2/21.
 */

export const APP_INFO_URL = 'https://form.boldseas.com/ge12/get-app-info';
export const APP_VERSION = '2.2.0';
export const ANDROID_API_KEY = 'apiKey-DCCM-Android';
export const IOS_API_KEY = 'apiKey-DCCM-IOS';

export const WECHAT_APP_ID = 'wxf87d8c42f4b46501';

//localStorage中使用的各种key
export const LS_LOGIN = 'common/login';
export const LS_LOGIN_USERNAME = 'common/loginUserName';
export const LS_DICT_VERSION = 'common/_dictVersion';//_dictVersion _dictData
export const LS_DICT_DATA = 'common/_dictData';
export const LS_IS_REMEMBERED= 'common/isRemembered';

export const LS_EMAIL= 'ls/email';//试乘试驾需要的key
export const LS_API_HOST_KEY= 'ls/apiHost';//apiHost切换后，也要存储起来，保证杀死进程后恢复app能够用杀之前的那一份apiHost


export const TODAY_TASK_PAGE_SIZE = 100;//最大不宜超过120