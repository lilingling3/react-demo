/**
 * Created by zhongzhengkai on 2017/4/4.
 */


const languageMap = {
  en:{},
  cn:{},
  lang:'en'
};

export const changeLanguage = ()=>{
  languageMap.lang = languageMap.lang == 'en' ? 'cn' : 'en';
};

export const changeCn = ()=>{
  languageMap.lang = 'cn';
};

export const changeEn = ()=>{
  languageMap.lang = 'en';
};

export const getLanguageMap = ()=>{
  return languageMap[languageMap.lang];
};

export const enMap = languageMap.en;

export const cnMap = languageMap.cn;

export const getLanguage = ()=> languageMap.lang;
