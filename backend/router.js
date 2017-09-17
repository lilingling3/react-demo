/**
 * Created by zhongzhengkai on 2017/5/10.
 */

var _fn = {GET:{},POST:{}};

var header = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'Origin,X-Requested-With,Content-Type,Content-Encoding,Accept,Charset,token,userId,apikey',
  'Access-Control-Allow-Methods': 'HEAD,PUT,POST,GET,DELETE,OPTIONS',
  'X-Powered-By': ' zk-server','Content-Type': 'application/json,charset=utf-8'
};

var _router = {
  GET: (url , cb)=>{
    _fn.GET[url] = cb;
  },
  POST: (url , cb)=>{
    _fn.POST[url] = cb;
  },

};

exports.use = (req, res)=>{
  res.send = (data)=> {
    res.writeHead(200, header);
    res.end(JSON.stringify(data))
  };
  var {method, url} = req;

  if(method=='OPTIONS'){
    res.writeHead(200, header);
    return res.end();
  }

  if(!_fn[method]) return res.end(method+ ' url:'+url+' not found');
  var handler = _fn[method][url];
  if(!handler) return res.end(method+ ' url:'+url+' not found');
  else {
    _fn[method][url](req, res);
  }
};


//定义各种url对应的处理函数
_router.GET('/login',(req, res)=>{
  res.send({status:true});
});

_router.POST('/list-books',(req, res)=>{
  setTimeout(()=>{
    res.send([{name:'darkness',author:'zzk'},{name:'endless sorrow',author:'hr'}])
  },2000)
});




var o = [
  {
    text: '718',
    src: '/image/Referral_image/introduction/car-718.png',
    childs: [
      {
        id: 0,
        text: '718 Cayman',
        detail: {
          header: '718 Cayman',
          src: '/image/Referral_image/introduction/718.png',
          contents: [
            { title: '价格', content: '598,000元,含增值税'},
            { title: '功率', content: '184 kW(250 hp)/6,500 rpm'},
            { title: '最大扭矩/对应转速',content: '310 Nm/1,850-5,000 rpm'},
            { title: '0-100 km/h 加速时间',content: '5.6s'},
            { title: '最高时速',content: '260 km/h'},
            { title: '耗油量 混合(1/100 km)',content: '7.2'}
          ]
        }
      }
    ]
  },
]
console.log(JSON.stringify(o));

var str = `
价格858,000 元，含增值税 *
功率257 kW (350 hp) / 6,500 rpm
最大扭矩 / 对应转速420 Nm / 1,900 - 4,500 rpm
0 - 100 km/h 加速时间4.4 s (配备 Sport Chrono 组件 4.2 s)
最高时速285 km/h
耗油量 混合(l/100 km)7.7
`;

function generateConfig(contentsStr, childId=0, childText='default text', childDetailHeader='header', src='/image/Referral_image/introduction/'){
  return {id:childId, text:childText, detail:{header:childDetailHeader, src, contents:parseStr(contentsStr)}}
}


function parseStr(str) {
  var arr = str.split('\n');
  var result = [];
  result.push({title:arr[1].substr(0, 2),content:arr[1].substr(2,arr[1].length)});
  result.push({title:arr[2].substr(0, 2),content:arr[2].substr(2,arr[1].length)});
  result.push({title:arr[3].substr(0, 11),content:arr[3].substr(11,arr[1].length)});
  result.push({title:arr[4].substr(0, 17),content:arr[4].substr(17,arr[1].length)});
  result.push({title:arr[5].substr(0, 4),content:arr[5].substr(4,arr[1].length)});
  result.push({title:arr[6].substr(0, 16),content:arr[6].substr(16,arr[1].length)});
  return result
}

console.log(generateConfig(str));
console.log(JSON.stringify(generateConfig(str)),2);