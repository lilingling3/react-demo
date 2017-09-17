/**
 * Created by zhongzhengkai on 2017/5/10.
 */

var router = require('./router');

require('http').createServer((req, res)=>{
  console.log(req.method + ' ' + req.url);
  router.use(req, res);
}).listen(3000,()=>console.log('server running'));


