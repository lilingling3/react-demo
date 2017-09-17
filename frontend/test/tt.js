/**
 * Created by bykj on 2017-6-25.
 */

var  obj={"1": "销售经理","2": "DCC经理","3": "展厅销售","4": "DCC销售顾问"}	;
// console.log(Object.keys(obj));
// var values = Object.keys(obj).map(key=>obj[key]);

const getData1 = ()=>{
  return new Promise((resolve, reject)=>{
    setTimeout(()=>{
      console.log('---执行完成Data1----');
      resolve('---随便什么数据data1----');
    },10000);
  })
};
const getData2 = ()=>{
  return new Promise((resolve, reject)=>{
    setTimeout(()=>{
      console.log('---执行完成Data2---');
      resolve('---随便什么数据data2---');
    },6000);
  })
};
const tasks = [getData1(),getData2()];


const getInitialData = ()=>{
  return Promise.all(tasks).then(resultList=>{
      console.log('all----------->'+resultList)
    });
};

getInitialData();

// <div className="chooseItem" onClick={()=> {
//   this.setState({level: LEVEL_H})
// }}>
//   <div><i className={"iconfont " + (level == LEVEL_H ? 'icon-gou selectIcon' : 'icon-yuan1 unSelectIcon')}/>
//   </div>
//   <img className="chooseImage" src="/assets/image/intent-level/H.png"/>
// </div>
// <div className="chooseItem" onClick={()=> {
//   this.setState({level: LEVEL_A})
// }}>
// <div><i className={"iconfont " + (level == LEVEL_A ? 'icon-gou selectIcon' : 'icon-yuan1 unSelectIcon')}/>
//   </div>
//   <img className="chooseImage" src="/assets/image/intent-level/A.png"/>
//   </div>
//   <div className="chooseItem" onClick={()=> {
//   this.setState({level: LEVEL_B})
// }}>
// <div><i className={"iconfont " + (level == LEVEL_B ? 'icon-gou selectIcon' : 'icon-yuan1 unSelectIcon')}/>
//   </div>
//   <img className="chooseImage" src="/assets/image/intent-level/B.png"/>
//   </div>
//   <div className="chooseItem" onClick={()=> {
//   this.setState({level: LEVEL_C})
// }}>
// <div><i className={"iconfont " + (level == LEVEL_C ? 'icon-gou selectIcon' : 'icon-yuan1 unSelectIcon')}/>
//   </div>
//   <img className="chooseImage" src="/assets/image/intent-level/C.png"/>
//   </div>
//   <div className="chooseItem" onClick={()=> {
//   this.setState({level: LEVEL_N})
// }}>
// <div><i className={"iconfont " + (level == LEVEL_N ? 'icon-gou selectIcon' : 'icon-yuan1 unSelectIcon')}/>
//   </div>
//   <img className="chooseImage" src="/assets/image/intent-level/N.png"/>
//   </div>

