/**
 * Created by zhongzhengkai on 16/7/20.
 */


console.log('---------------------------------------------------------');
console.log('__APP_ENV__:' + __APP_ENV__);
console.log('---------------------------------------------------------');

if(__APP_ENV__=='dev'){
  module.exports = require('./store.dev');
}else{
  module.exports = require('./store.prod');
}

//export * from './store.dev';
//if(__APP_ENV__=='dev'){
//  export * from './store.dev';
//}else{
//  export * from './store.prod';
//}

/* 
1,这个应用只有一个store
2，state 对应view 用户触发view action是view发出通知 触发state改变
3，action 对象 type是必须的 携带信息 playload
const action = {
  type: 'ADD_TODO',
  payload: 'Learn Redux'
};
4，通过函数生成action
5，store.dispatch view 发出action的唯一方法
6，store收到action 返回新的state，view发生变化
Reducer 是一个函数，它接受 Action 和当前 State 作为参数，返回一个新的 State。

7，import { createStore } from 'redux';
const store = createStore(reducer);
createStore 接受reducer作为参赛，生成新的store  store.dispath发送新的action,自动调用reducer，得到新的state

8，reducer负责生成state  整个应用只有一个state 
 */