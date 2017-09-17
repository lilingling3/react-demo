/**
 * Created by zhongzhengkai on 2017/6/12.
 */


import {postDataWithFile} from '../base/common-func';

export const upload = (fileURL, fieldName)=> {
  return dispatch=> {
    postDataWithFile({fileURL, fieldName, body:{a:1,b:2}}, 'https://form.boldseas.com/apiqy/save-pic', (reply)=> {
    //postDataWithFile({fileURL, fieldName:'file'}, 'https://dccmtest.boldseas.com/api/sps/testDrive/uploadCardIdentification', (reply)=> {
      alert('upload success!' + JSON.stringify(reply));
    }, dispatch, {attachPrefix: false})
  }
};




