/**
 * Created by zhongzhengkai on 2017/5/4.
 */

var g = require('../../core/gateway');
var cf = require('../../core/common-func');
var env = require('../../../config/env/project');
var WWW_PUBLIC_PATH = env.WWW_PUBLIC_PATH;
var thunkify = require('thunkify');
var vinUploader = thunkify(cf.buildSingleOrArrayUploader(true, WWW_PUBLIC_PATH+'/vin-pic', 'vin_pic', 'op'));
xlsx = require('xlsx');

var booksUrl = 'http://www.zzkai.com:8888/getbooks';

exports.getPage1 = function *(req, body ,query) {

  var {list1, list2, list3} = yield {
    list1: cf.get(booksUrl),
    list2: cf.get(booksUrl),
    list3: cf.get(booksUrl)
  };

  var list = list1.concat(list2).concat(list3);

  return g.view('page1', { name: 'zzk', age: 22, list});
};

exports.getPage2 = function *(req, body ,query) {
  return g.view('page2');
};

exports.postPage1 = function *(req, body, query) {
  var cmd = body.cmd;
  if (cmd == 1) {
    var list = [
      {bookName:'未来世界222',author:'zzk'},
      {bookName:'大彪洋222',author:'yujie'},
      {bookName:'黑客的幻想222',author:'adam'}
    ];
    return g.view('page1', {name: 'your cmd is:' + cmd +' '+ Date.now(), age: 22, list, cmd});
  } else if (cmd == 2) {
    return g.json({name: 'your cmd is:' + cmd, age: 22});
  } else if (cmd == 3) {
    return g.redirect('page2');
  } else if (cmd == 4) {
    return g.file(env.WWW_FILE_PATH + '/hello.txt');
  } else {
    return g.json({errMessage: 'cmd is invalid'});
  }
};

exports.saveVinPic = function *(req, body, query) {
  // var uploader = thunkify(cf.buildSingleOrArrayUploader(true, WWW_PUBLIC_PATH+'/vin-pic', 'vin_pic', 'yourCustomizedFileName'));
  yield vinUploader(req, req.res);
  console.log('-------->',JSON.parse(req.body.data));
  return g.json({message:'store file done'});
};

exports.parseExcelFile = function *(req, body, query) {
  var fileName = 'vin-excel-'+Date.now()+'.xlsx';
  var fileDir = WWW_PUBLIC_PATH+'/excel';
  var myUploader = thunkify(cf.buildSingleOrArrayUploader(true, WWW_PUBLIC_PATH+'/excel', 'excel_file', fileName));
  yield myUploader(req, req.res);
  console.log(JSON.parse(req.body.data));
  var workbook = xlsx.readFile(fileDir+'/'+fileName);
  // var sheetName = 'OPTemplate';
  var sheetName = '实际投入';
  var sheet = workbook.Sheets[sheetName];
  if(!sheet)throw '文件格式错误!sheet名称必须为:'+sheetName+',当前为:'+workbook.SheetNames[0];

  for (var key in sheet) {
    if (!key.startsWith('!')) {
      var cell = sheet[key];
      var cellValue = cell.v;
      var lineNo = parseInt(key.substr(1));//行号:1 2 3 4 ...
      var colNo = key.substr(0, 1);//列号:A B C D E F ...
      console.log(lineNo,colNo,cellValue);
    }
  }
  return g.json({message:'parse excel done'});

};

// require('co')(function *(){
//   var workbook = xlsx.readFile(__dirname + '/cap1.xlsx');
//   var sheet = workbook.Sheets['Sheet2'];
//   for (var key in sheet) {
//     if (!key.startsWith('!')) {
//       var cell = sheet[key];
//       var cellValue = cell.v;
//       var lineNo = parseInt(key.substr(1));//行号:1 2 3 4 ...
//       var colNo = key.substr(0, 1);//列号:A B C D E F ...
//       // console.log(lineNo,colNo,cellValue);
//       if(colNo=='A')console.log(lineNo,colNo,cellValue);
//     }
//   }
// }).catch(ex=>console.log(ex));

