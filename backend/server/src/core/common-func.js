/**
 * Created by zhongzhengkai on 2017/5/4.
 */

var http = require('http');
var https = require('https');
var url = require('url');
var multer = require('multer');

var DEFAULT_FILE_SIZE = 10 * 1024 * 1024;
var allowableFileType = [
  'image/png', 'image/gif', 'image/jpeg', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
  , 'application/octet-stream', 'application/pdf'
];

exports.post = (url, body)=> {
  return (cb)=> {
    exports.request(url, {body: body, method: 'post', json: true}, cb);
  }
};

exports.get = (url)=>{
  return (cb)=>{
    exports.request(url, {method: 'get', json: true}, cb);
  }
};

exports.request = (urlStr, options, cb)=> {
  console.log(urlStr);
  var parsedUrl = url.parse(urlStr);
  var httpMgr = http;
  if(parsedUrl.protocol == 'https:')httpMgr = https;

  var bodyStr = options.body ? JSON.stringify(options.body): '';
  if (options.method == 'post'){
    parsedUrl.method = 'post';
    parsedUrl.headers = {'Content-Type':'application/json,charset=utf-8',
      'Content-Length': Buffer.byteLength(bodyStr,'utf-8'),apiKey: 'ddfCXxxEE134PREJYB!De12'};
    // parsedUrl.headers = {'Content-Type':'application/json,charset=utf-8',
    //   'Content-Length': bodyStr.length,apiKey: 'ddfCXxxEE134PREJYB!De12'};
  }
  var req = httpMgr.request(parsedUrl,(res)=>{
    var bufferList=[];
    res.on('data',(chunk)=>{bufferList.push(chunk)});
    res.on('end', ()=> {
      var data = Buffer.concat(bufferList);
      console.log('data is:',data.toString());
      if (options.json) {
        var toReturn = '';
        try {
          toReturn = JSON.parse(data);
          cb(null, toReturn);
        } catch (err) {
          cb(null, data);
        }
      } else cb(null, data)
    });
    res.on('error',(err)=>cb(err));
  });
  if(options.body){
    console.log('bodyStr:',bodyStr);
    req.write(bodyStr);
  }
  req.end();
};

exports.getAppEnv = ()=>{
  var defaultEnv = require('../../config/default-env');
  return process.env.APP_ENV || defaultEnv || 'dev';
};


exports.buildSingleOrArrayUploader = function (isSingle, storageDirPath, fieldName, storedFileName, options) {
  var storage = multer.diskStorage({
    destination: function (req, file, cb) {
      cb(null, storageDirPath);
    },
    filename: function (req, file, cb) {
      var storeFileName = '';
      var fileType = file.mimetype.split('/')[1];
      if (fieldName == 'vin_pic') {
        storeFileName = storedFileName + Date.now() + '.'+fileType;
      } else {
        storeFileName = storedFileName;
      }
      cb(null, storeFileName);
    }
  });

  if (options) {
    var fileSize = options.fileSize || DEFAULT_FILE_SIZE;// default Max file size in bytes (10 MB)
  } else {
    var fileSize = DEFAULT_FILE_SIZE;
  }

  var multerConfig = {
    storage: storage,
    limits: {
      fileSize: fileSize
    },
    fileFilter: function (req, file, cb) {
      // PNG图像 .png image/png
      // GIF图形 .gif image/gif
      // JPEG图形 .jpeg,.jpg image/jpeg
      var fileType = file.mimetype;
      if (allowableFileType.indexOf(fileType) != -1) {
        cb(null, true);
      } else {
        cb(new Error('upload file type wrong,must be ' + allowableFileType.toString() + ',now is:' + fileType));
      }
    }
  };
  if (isSingle) {
    return multer(multerConfig).single(fieldName);
  } else {
    // console.log(options);
    return multer(multerConfig).fields(options.fieldNames, 5);
  }

};


