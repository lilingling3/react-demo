/**
 * Created by zhongzhengkai on 2016/12/27.
 */

import {doGet,doPost,justPost, justGet} from './common-func';

export const getBooks = (cb, dispatch)=> {
  justGet('http://localhost:3222/api/get-books',cb,dispatch);
};
