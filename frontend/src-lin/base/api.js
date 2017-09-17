/**
 * Created by zhongzhengkai on 2016/12/27.
 */

import {doGet,doPost,justPost, justGet} from './common-func';

export const getBooks = (cb, dispatch)=> {
  justGet('http://localhost:3030/api/get-books',cb,dispatch); 
};
export const testGetBooks = (cb, dispatch)=> {
  justGet('http://localhost:3222/ling/get-books',cb,dispatch);
};
export const testListTasks = (cb, dispatch)=> {
  justGet('https://dccmapi.boldseas.com/api/sps/waitTasks/listTasksListDetail/6475',cb,dispatch);
};
