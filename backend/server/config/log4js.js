/**
 * Created by zhongzhengkai on 16/4/14.
 */
var cf = require('../src/core/common-func');
var configuredLogDir = require(__dirname + '/env/project').logDir;
var logDirPath;
if (cf.getAppEnv() == 'dev') logDirPath = require('path').join(__dirname, '../logs/');
else logDirPath = configuredLogDir ? configuredLogDir : '/var/log/referral-pages/';

/*
 {
 type: 'file', //文件输出
 filename: logDirPath+'/logs/web_access.log',//输出位置
 maxLogSize: 1024 * 1024 * 1024,//超过1024MB,生成新的文件
 backups: 5,//文件最多生成几个（每次重启服务，会做一次备份，然后新写一个文件）
 category: 'exception'
 },
 {
 type: 'dateFile', //按日期划分的文件输出
 filename:  logDirPath+'/logs/cocos_access.log',
 maxLogSize: 1024 * 1024 * 1024,
 backups: 3,
 category: 'http-access',
 需要注意的是，如果日志使用的是日期，即一天一个文件，测试的话，直接修改日期测试，是不会生产新的日期日志的，
 必须把时间调为晚上23点59分，然后等着过整点，这时候可以测试是否会生成新的文件，
 官方例子说明如下(https://github.com/nomiddlename/log4js-node/wiki/Date%20rolling%20file%20appender）：
 pattern: "-yyyy-MM-dd",
 alwaysIncludePattern: true,
 absolute: true
 },
 */

var cfg = {
  appenders: [
    {type: 'console'}, //控制台输出
    {
      type: 'file',
      filename: logDirPath + 'debug.log',
      maxLogSize: 1024 * 1024 * 1024,
      backups: 5,
      category: 'debug'
    },
    {
      type: 'file',
      filename: logDirPath + 'exception.log',
      maxLogSize: 1024 * 1024 * 1024,
      backups: 5,
      category: 'exception'
    },
    {
      type: 'file',
      filename: logDirPath + 'startUp.log',
      maxLogSize: 1024 * 1024 * 1024,
      backups: 5,
      category: 'startUp'
    },
    {
      type: 'file',
      filename: logDirPath + 'error.log',
      maxLogSize: 1024 * 1024 * 1024,
      backups: 5,
      category: 'error'
    },
    {
      type: 'file',
      filename: logDirPath + 'email.log',
      maxLogSize: 1024 * 1024 * 1024,
      backups: 5,
      category: 'email'
    },
    {
      type: 'file',
      filename: logDirPath + 'sql.log',
      maxLogSize: 1024 * 1024 * 1024,
      backups: 5,
      category: 'sql'
    },
    {
      type: 'dateFile', //按日期划分的文件输出
      filename: logDirPath + 'httpAccess.log',
      maxLogSize: 1024 * 1024 * 1024,
      backups: 3,
      category: 'httpAccess',
      pattern: "-yyyy-MM-dd",
      alwaysIncludePattern: true,
      absolute: true
    }
  ],

  //log4js的输出级别6个: trace, debug, info, warn, error, fatal
  //如果想为某个类型的log设置打印级别,解开下面的注释并修改,表示低于某个级别的日志不会输出
  //levels: { 'http-access': "INFO", 'error': "INFO"},

  replaceConsole: false //让所有console.log() 输出到log4js日志中，以[INFO] console代替console默认样式
};


module.exports = cfg;