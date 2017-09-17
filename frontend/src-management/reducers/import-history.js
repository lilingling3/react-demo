/**importNum
 * Created by bykj on 2017-6-26.
 */
var moment = require('moment');

function getInitialState() {
  return {
    importNum: 0,
    successNum: 0,
    list: []
  };
}

export default (state = getInitialState(), action) => {
  var {type, payload} = action;
  switch (type) {
    case 'GET_HISTORY':
      var data = [];
      if (payload.list != null) {
        for (var i = 0; i < payload.list.length; i++) {
          var tempData = payload.list[i];
          var time = moment(tempData.createdDate).format('YYYY-MM-DD HH:mm:ss')
          data.push({
            file_name: tempData.fileName,
            success_import: tempData.successImportAmount,
            import_time: time,
            data_detail: tempData.id
          });
        }
      }
      state.importNum = payload.importNum;
      state.successNum = payload.importSuccessNum;
      state.list = data;
      return {...state};
    default:
      return state;
  }
}