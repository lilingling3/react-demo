/**
 * Created by zhongzhengkai on 2017/5/4.
 */


var router = require('express').Router();
module.exports = router;
var env = require('../../config/env/project');

router.get('/sps/customerInfo/excel/template/download',(req, res)=>{
  var file = env.WWW_FILE_PATH+'/ttt.xls';
  console.log(req.headers)
  res.attachment(env.WWW_FILE_PATH+'/a3.jpg');
  res.sendFile(env.WWW_FILE_PATH+'/a3.jpg');
  // res.download(file);
  //res.send('dddddddddddddddddddd');
});
