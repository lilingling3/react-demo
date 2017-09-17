/**
 * Created by zhongzhengkai on 2017/5/21.
 */

//跟进周期维护
function getInitialState() {
  return {
    LevelH: {id: 0, days: 2},
    LevelA: {id: 0, days: 4},
    LevelB: {id: 0, days: 7},
    LevelC: {id: 0, days: 15},
    LevelO: {id: 0, days: 3},
    LevelN: {id: 0, days: 15}
  };
}

export default (state = getInitialState(), action) => {
  var {type, payload} = action;
  switch (type) {
    case 'GET_SALESLEADSLEVEL_INFO':
      payload.forEach(val => {
        updateState(state, val);
      });
      return {...state};
    case 'UpdateDealerSetSalesLevel':
      updateState(state, payload);
      return {...state};
    default:
      return state;
  }
}

function updateState(state, val) {
  var {id, dealerId, followupDays, salesLeadsLevel, valid, description, createdDate, modifiedDate}=val;
  switch (salesLeadsLevel) {
    case 'H':
      state['LevelH']['days'] = followupDays;
      state['LevelH']['id'] = id;
      break;
    case 'A':
      state['LevelA']['days'] = followupDays;
      state['LevelA']['id'] = id;
      break;
    case 'B':
      state['LevelB']['days'] = followupDays;
      state['LevelB']['id'] = id;
      break;
    case 'C':
      state['LevelC']['days'] = followupDays;
      state['LevelC']['id'] = id;
      break;
    case 'O':
      state['LevelO']['days'] = followupDays;
      state['LevelO']['id'] = id;
      break;
    case 'N':
      state['LevelN']['days'] = followupDays;
      state['LevelN']['id'] = id;
      break;
    default:
      break;
  }
}