// 任务列表的action  派发action  获取所有的任务列表
import * as api from '../base/api';

export const getListTasks = () =>{
    return dispatch => {
        api.testListTasks((listTasks)=>{
            // console.log(listTasks)
            dispatch({type:'GET_LISTTASKS',payload:listTasks})
        },dispatch)
    }
}