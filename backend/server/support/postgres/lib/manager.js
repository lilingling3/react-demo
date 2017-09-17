/**
 * Created by zhongzhengkai on 16/8/19.
 */

//后面采用require('pg').native来加速查询速度
var pg = require('pg');
//@see https://github.com/tgriesser/knex/issues/387,
//让 bigint numeric 都不以string返回,而是转为正确的格式
pg.types.setTypeParser(20, 'text', parseInt);
pg.types.setTypeParser(1700, 'text', parseFloat);//让numeric也从string,变成float
var async = require('async');
var sqlComposer = require('./sqlComposer');
var sqlLogger = require('../../logger/helper').getLogger('sql');

config = require('../../../config/env/project').postgres;

//this initializes a connection pool
//it will keep idle connections open for a 30 seconds
//and set a limit of maximum 10 idle clients
var pool;
initPool(config);

/**
 * 初始化连接池对象
 * @param config
 */
function initPool(config) {
  console.log('-------initPool--------');
  console.log(config);
  console.log('------------------------');
  console.log();
  pool = new pg.Pool(config);
}

/**
 * 从连接池里获得一个连接对象
 * @param cb
 */
function acquirePoolClient(cb) {
  pool.connect(function (err, client, done) {//这里回去连接池里获取一个连接对象
    if (err) {
      console.error('error fetching client from pool', err);
      cb(err, null);
    } else {
      cb(null, client, done);
    }
  });
}

/**
 * 使用预置好的配置初始化后得到的连接池来做查询操作
 * 适合服务器端的应用程序去查询pg server
 * @param sql {String} - 欲执行的sql语句
 * @param args {Array} - sql语句里占位符实际要替换的字符串参数列表
 * use case : query('select * from company where age > $1 and address = $2',[190,'BeiJing'], function(err, result){})
 * @param cb
 */
function query(sql, args, cb) {
  sqlLogger.info(sql, args);
  acquirePoolClient(function (err, client, done) {//这里回去连接池里获取一个连接对象
    if (err) {
      cb(err, null);
    } else {
      client.query(sql, args, function (err, result) {
        done();//归还client给连接池
        if (err) {
          console.error('error running query', err);
          sqlLogger.error(err);
          cb(err, null);
        } else {
          cb(null, result);//result.rows 是需要的数据
        }
      });
    }
  });
}


function wrapOperation(operation, sqls, results, opMap) {
  var cmd = Object.keys(operation)[0];
  var payload = operation[cmd];
  var tag = payload.tag;
  if (results) {
    if (results[tag])throw new Error('queryWithTransaction: tag duplicated:' + tag);
    results[tag] = tag;
  }
  opMap[tag] = payload;
  if (payload.preHandler) {//不生成sql语句,在事务执行过程中再生成
    sqls.push({tag: payload.tag, operation: operation, cmd: cmd});
  } else {
    var item = generateSqlItem(operation, cmd);
    if (item)sqls.push(item);
  }
}

function generateSqlItem(operation, cmd) {
  var payload = operation[cmd];
  var returnFields = payload.returnFields || ['id'];
  var sc;// sqlComposer's result
  switch (cmd) {
    case '$insert':
      sc = sqlComposer.prepareInsertSql(payload.tableName, payload.toInsert, returnFields, true);
      break;
    case '$insertBatch':
      if(payload.toInserts.length==0)throw new Error('queryWithTransaction: $insertBatch can not accept empty array!');
      sc = sqlComposer.prepareBatchInsertSql(payload.tableName, payload.toInserts, returnFields, true);
      break;
    case '$update':
      sc = sqlComposer.prepareUpdateSql(payload.tableName, payload.filter, payload.toUpdate, returnFields, true);
      break;
    case '$updateBatch':
      if(payload.toUpdates.length==0)throw new Error('queryWithTransaction: $updateBatch can not accept empty array!');
      sc = sqlComposer.prepareBatchUpdateSql(payload.tableName, payload.toUpdates, payload.filterKey, returnFields);
      break;
    case '$select':
      sc = sqlComposer.prepareSelectSql(payload.tableName, payload.filter, payload.fields, true);
      break;
    case '$delete':
      sc = sqlComposer.prepareDeleteSql(payload.tableName, payload.filter, true);
      break;
    case '$rawSql':
      sc = {sql: payload.sql, args: payload.args || []};
      break;
    default:
      throw new Error('queryWithTransaction: unsupported cmd:' + cmd);
  }
  return {sql: sc.sql, args: sc.args, tag: payload.tag, operation: operation, cmd: cmd};
}


/**
 * 执行事务性的一组操作
 * @param operations {Array}
 * 操作对象形如以下示例,tag用于记录返回的结果,:
 * {'$insert':{tableName:'company',toInsert:{...},tag:'insertCompany'}}
 * {'$insertBatch':{tableName:'company',toInserts:{...},tag:'insertCompany'}}
 * {'$update':{tableName:'company',filter:{...},toUpdate:{...},tag:'updateCompany'}}
 * {'$select':{tableName:'company',filter:{...},fields:[],tag:'selectCompany'}}
 * {'$delete':{tableName:'company',filter:{...},tag:'deleteCompany'}}
 * {'$rawSql':{sql:'select salary,id from company',args:[],tag:'getMySalary'}}
 * @param cb
 */
function queryWithTransaction(operations, cb) {
  acquirePoolClient(function (err, client, done) {
    if (err) {
      cb(err, null);
    } else {
      var results = {};
      var sqls = [];
      var opMap = {};
      try{
        operations.forEach(function (v) {
          wrapOperation(v, sqls, results, opMap);
        });
      }catch(ex){
        return cb(ex);
      }

      client.query('begin');//开始事务
      async.mapSeries(sqls, function (sqlItem, callback) {
        var operation = sqlItem.operation;
        var cmd = sqlItem.cmd;
        var payload = operation[cmd];
        var preHandler = payload.preHandler;
        if (preHandler) {
          try{
            preHandler(payload, results, opMap);
            sqlItem = generateSqlItem(operation, cmd);
          }catch(ex){
            return callback (ex);
          }
        }
        client.query(sqlItem.sql, sqlItem.args, function (err, result) {
          if (err) {
            callback(err, null);
          } else {
            results[sqlItem.tag] = result;
            callback(null, sqlItem);
          }
        });
      }, function (err, asyncResults) {
        done();//归还连接对象给连接池
        if (err) {
          sqlLogger.error(err);
          client.query('rollback', function () {
            cb(err, results, opMap);
          });//回滚事务
        } else {
          client.query('commit', function () {
            asyncResults.forEach(val=> {
              sqlLogger.info(val.sql, val.args);
            });
            cb(null, results, opMap);
          });//提交事务
        }
      });
    }
  });
}


/**
 * 使用指定的配置,做一次临时的查询操作
 * 适合执行完即结束的脚本操作
 * @param cfg
 * @param sql
 * @param args
 * @param cb
 */
function queryOnce(cfg, sql, args, cb) {
  var client = new pg.Client(cfg);
  client.connect(function (err) {
    if (err) {
      console.error('error connecting pg server', err);
      return cb(err, null);
    }
    client.query(sql, args, function (err, result) {
      if (err) {
        console.error('error running query', err);
        cb(err, null);
      } else {
        client.end(function (err) {
          if (err) console.error('error disconnect the client', err);
        });
        cb(null, result);//result.rows 是需要的数据
      }
    });
  });
}

function select(tableName, filter, fields, cb) {
  var cbFunc = cb;
  if (typeof fields == 'function') {
    cbFunc = fields;
    fields = [];
  }
  var sc = sqlComposer.prepareSelectSql(tableName, filter, fields, true);
  query(sc.sql, sc.args, cbFunc);
}

function update(tableName, filter, toUpdate, returnFields, cb) {
  var sc = sqlComposer.prepareUpdateSql(tableName, filter, toUpdate, returnFields, true);
  query(sc.sql, sc.args, cb);
}

function updateBatch(tableName, toUpdates, filterKey, returnFields, cb) {
  var sc = sqlComposer.prepareBatchUpdateSql(tableName, toUpdates, filterKey, returnFields);
  query(sc.sql, sc.args, cb);
}

function insert(tableName, toInsert,returnFields, cb) {
  var sc = sqlComposer.prepareInsertSql(tableName, toInsert, returnFields, true);
  query(sc.sql, sc.args, cb);
}

function insertBatch(tableName, toInserts, returnFields, cb) {
  try{
    var sc = sqlComposer.prepareBatchInsertSql(tableName, toInserts, returnFields, true);
    query(sc.sql, sc.args, cb);
  }catch(ex){
    cb(ex.message);
  }
}

function remove(tableName, filter, cb) {
  var sc = sqlComposer.prepareDeleteSql(tableName, filter, true);
  query(sc.sql, sc.args, cb);
}

module.exports = {
  acquirePoolClient: acquirePoolClient,
  initPool: initPool,
  query: query,
  queryOnce: queryOnce,
  queryWithTransaction: queryWithTransaction,
  insert: insert,
  insertBatch: insertBatch,
  update: update,
  updateBatch:updateBatch,
  select: select,
  remove: remove,
  jsonbSet:sqlComposer.jsonbSet
};

