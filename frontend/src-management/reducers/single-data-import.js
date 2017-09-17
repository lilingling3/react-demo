/**
 * Created by bykj on 2017-6-26.
 */
function getInitialState() {
  return {
    province: [],
    city: [],
    model: [],
    allModel: [],
    style: [],
    color: [],
    intentLevel: [{id: 1, imagePath: "/assets/image/intent-level/H.png"},
      {id: 2, imagePath: "/assets/image/intent-level/A.png"},
      {id: 3, imagePath: "/assets/image/intent-level/B.png"},
      {id: 4, imagePath: "/assets/image/intent-level/C.png"},
      {id: 6, imagePath: "/assets/image/intent-level/N.png"}],
    sourceType: [],
    source: [],
    theme: [{id: 1, label: '离店回访'},{id: 2, label: '到店接待'}, {id: 3, label: '到店邀约'}, {id: 4, label: '试乘试驾邀约'}, {
      id: 5,
      label: '到店接待'
    },
      {id: 6, label: '日常跟进'}, {id: 7, label: '活动邀约'}, {id: 8, label: '其他'}],
    followPerson: [],
    dealerInfo:{provinceId:'-1',cityId:'-1'},
    querySuccess: false,
    insertSuccess: false
  };
}

export default (state = getInitialState(), action) => {
  var {type, payload} = action;
  switch (type) {
    case 'INIT_DATA':
      var data = payload;
      var province = [];
      var model = [];
      var sourceType = [];
      var intentLevel = [];
      var followPerson = [];
      var allModel = [];
      var dealerInfo = {};

      data[0].map((item0)=>(province.push({id: item0.id, label: item0.nameCn})));
      //data[1].sort(compare('sort')).map((item1)=>(model.push({id: item1.modelId, label: item1.modelName})));
      data[2].map((item2)=> {
          if (item2.id !== 1 && item2.id !== 345) {
            sourceType.push({id: item2.id, label: item2.nameCn})
          }
        }
      );
      data[3].map((item3)=>(intentLevel.push({id: item3.id, label: item3.title})));
      data[4].map((item4)=>(followPerson.push({id: item4.id, label: item4.nameCn})));
      data[5].map((item5)=>(allModel.push({id: item5.id, parentId: item5.parentId,sort:item5.sort})));

      dealerInfo.provinceId = data[6].provinceId;
      dealerInfo.cityId = data[6].cityId;

      allModel.sort(compare('sort'));
      for(var i = 0;i<allModel.length;i++){
        for(var j = 0;j<data[1].length;j++){
          if(allModel[i].id == data[1][j].modelId){
            model.push({id: data[1][j].modelId, label: data[1][j].modelName,sort:allModel[i].sort});
          }
        }
      }

      state.dealerInfo = dealerInfo;
      state.province = province;
      state.model = model;
      state.sourceType = sourceType;
      //state.intentLevel = intentLevel;
      state.followPerson = followPerson;
      state.allModel = allModel;
      return {...state};
    case 'GET_CITY':
      var city = [];
      payload.map((item)=>(city.push({id: item.id, label: item.nameCn})));
      state.city = city;
      return {...state};
    case 'GET_SOURCE':
      var source = [];
      payload.map((item)=>(source.push({id: item.id, label: item.nameCn})));
      state.source = source;
      return {...state};
    case 'GET_STYLE':
      var style = [];
      payload.map((item)=>(style.push({id: item.id, label: item.nameCn})));
      state.style = style;
      return {...state};
    case 'GET_COLOR':
      var color = [];
      payload.map((item)=>(color.push({id: item.id, label: item.nameCn})));
      state.color = color;
      return {...state};
    case 'QUERY_MOBILE':
      state.querySuccess = true;
      return {...state};
    case 'INSERT_CUSTOMER':
      state.insertSuccess = true;
      return {...state};
    default:
      return state;
  }
}

function compare(property){
  return function(a,b){
    var value1 = a[property];
    var value2 = b[property];
    return value1 - value2;
  }
}