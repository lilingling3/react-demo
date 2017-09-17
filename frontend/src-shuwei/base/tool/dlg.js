
import React, {Component, PropTypes} from 'react';
import Modal from 'antd-mobile/lib/modal';
import Toast from 'antd-mobile/lib/toast';

export const cry = (dialogText)=>{
  Modal.prompt('cry:',extractText(dialogText));
};

export const smile = (dialogText)=>{
  Modal.prompt('smile',extractText(dialogText));
};

export const info = (dialogText)=>{
  Modal.alert('error message',extractText(dialogText),[{text:'Comfirm'}]);
};

export const error = (dialogText)=>{
  Modal.alert('error message',extractText(dialogText),[{text:'Comfirm'}]);
};

export const toast = (dialogText)=>{
  Toast.info(extractText(dialogText),1);
};

const extractText = (dialogText)=>{
  var text = '';
  if(dialogText instanceof Error) text = dialogText.message;
  else if(typeof dialogText == 'object') text = JSON.stringify(dialogText);
  else text = dialogText;
  return text;
};