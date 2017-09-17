
import React, {Component, PropTypes} from 'react';
import Modal from 'antd-mobile/lib/modal';
import Toast from 'antd-mobile/lib/toast';

export const cry = (dialogText)=>{
  Modal.prompt('cry:',extractText(dialogText));
};

export const smile = (dialogText)=>{
  Modal.prompt('smile',extractText(dialogText));
};

export const info = (dialogText, cb)=>{
  Modal.alert('消息提示',extractText(dialogText),[{text:'确认',onPress:cb}]);
};

export const error = (dialogText)=>{
  Modal.alert('错误提示',extractText(dialogText),[{text:'确认'}]);
};

export const toast = (dialogText, duration=1)=>{
  Toast.info(extractText(dialogText),duration);
};

const extractText = (dialogText)=>{
  var text = '';
  if(dialogText instanceof Error) text = dialogText.message;
  else if(typeof dialogText == 'object') text = JSON.stringify(dialogText);
  else text = dialogText;
  return text;
};