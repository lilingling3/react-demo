/**
 * Created by zhongzhengkai on 16/4/14.
 * 将mongo模块介入generic-pool,达到池化管理mongoDB客户端连接对象
 */
var Pool = require('generic-pool').Pool;
var MongoClient = require('mongodb').MongoClient;
var errLogger = require("../../logger/helper").getLogger("error");
var mongoConfig = require('../../../config/env/project').mongo;
//mongoClientMap拥有多个mongoClient对象，key: $mongoDbUrl , value: mongoClient
//每个mongo的db会对应一个连接池connPool，该连接池里的所有连接只负责连某个db并提供服务
var mongoConnPoolMap = {};
var MAX_ATTEMPTS = 3;

for (var dbName in mongoConfig) {
  var dbUrl = mongoConfig[dbName];
  mongoConnPoolMap[dbUrl] = _buildConnPool(dbName, dbUrl);
}

var me = module.exports;

/**
 * 得到某个db的连接池对象
 */
me.getConnPool = function (dbName) {
  return _getConnPool(dbName);
};

/**
 * 外部自己要去connPool.release(dbClient),将连接对象归还连接池
 * @param dbName
 * @param cb (err, {connPool: connPool, client: dbClient})
 */
me.getInternalClient = function (dbName, cb) {
  return _getConnPool(dbName).getInternalClient(cb);
};

me.insertMany = function (dbName, collectionName, docs, cb) {
  return _getConnPool(dbName).insertMany(collectionName, docs, cb);
};

me.find = function (dbName, collectionName, condition, cb, options) {
  return _getConnPool(dbName).find(collectionName, condition, cb, options);
};

me.findOneAndUpdate = function (dbName, collectionName, filter, update, cb, options) {
  return _getConnPool(dbName).findOneAndUpdate(collectionName, filter, update, cb, options);
};

me.deleteOne = function (dbName, collectionName, filter, cb, options) {
  return _getConnPool(dbName).deleteOne(collectionName, filter, cb, options);
};

me.count = function (dbName, collectionName, filter, cb, options) {
  return _getConnPool(dbName).count(collectionName, filter, cb, options);
};

me.stats = function (dbName, collectionName, cb, options) {
  return _getConnPool(dbName).stats(collectionName, cb, options);
};

//reply: { result: { ok: 1, nModified: 1, n: 1 }, ... }
//reply: { result: { ok: 1, nModified: 0, n: 1, upserted: [ [Object] ] }, ... }
me.updateOne = function (dbName, collectionName, filter, toSet, cb, options) {
  return _getConnPool(dbName).updateOne(collectionName, filter, toSet, cb, options);
};

me.createIndexes = function (dbName, collectionName, indexSpecs, cb) {
  return _getConnPool(dbName).createIndexes(collectionName, indexSpecs, cb);
};

function _getConnPool(dbName) {
  var dbUrl = mongoConfig[dbName];
  if (dbUrl) {
    return mongoConnPoolMap[dbUrl];
  } else {
    throw new Error('mongoDB:' + dbName + ' not defined in configuration file');
  }
}


function _buildConnPool(dbName, dbUrl) {
  return _initConnPool(_newConnPool(dbName, dbUrl));
}


function _newConnPool(dbName, dbUrl) {
  var pool = new Pool({
    name: 'mongo-' + dbName,

    create: function (callback) {
      MongoClient.connect(dbUrl, function (err, db) {
        if (mongoConfig.username) {
          //需要认证
          db.authenticate(mongoConfig.username, mongoConfig.password, function (err, result) {
            if (result == false) {
              callback("authenticate failure for mongo client", db);
            } else {
              callback(err, db);
            }
          })
        } else {
          callback(err, db);
        }
      });
    },

    destroy: function (client) {
      client.close(function (err) {
        if (err) {
          errLogger.error('error occurred while mongo connection pool:' + dbName + ' call destroy method');
          errLogger.error(err.toString() + '\n');
        }
      });
    },

    max: 100,

    // optional. if you set this, make sure to drain() (see step 3)
    //min: 2,

    // specifies how long a resource can stay idle in pool before being removed
    idleTimeoutMillis: 30000,

    reapIntervalMillis: 5000,//检查闲置连接的频率

    // if true, logs via console.log - can also be a function
    log: false
  });
  return pool;
}


/**
 * 初始化连接池,为连接池附加一些通用的方法，方便外部调用
 * @param connPool
 * @returns {*}
 * @private
 */
function _initConnPool(connPool) {

  //拿到操作某个mongoDb实例的具体句柄,把连接池对象和client对象一起返回出去
  //外界操作完client后,要在client提供的回调里手动调用 connPool.release(client)
  connPool.getInternalClient = function (cb) {
    connPool.acquire(function (err, dbClient) {
      cb(err, {connPool: connPool, client: dbClient});
    });
  };

  //如果不想每次都手动release来归还client对象,则需要吧client的方法都在此包装一遍,如:包装insertMany方法
  connPool.insertMany = function (collectionName, docs, cb) {
    connPool.acquire(function (err, dbClient) {
      if (err) return cb(err, null);
      var collectionHandler = dbClient.collection(collectionName);
      collectionHandler.insertMany(docs, function (err, result) {
        connPool.release(dbClient);//不再手动dbClient.close(),将dbClient归还给连接池,交给连接池去维护
        cb(err, result);
      });
    }, 0);
  };

  connPool.find = function (collectionName, condition, cb, options) {
    connPool.acquire(function (err, dbClient) {
      if (err) return cb(err, null);
      var collectionHandler = dbClient.collection(collectionName);

      if (options && options.fields) {//返回的字段: {_class:1,name:1}
        var ref = collectionHandler.find(condition, options.fields);
      } else {
        var ref = collectionHandler.find(condition);
      }

      if (options) {
        if (options.skip) {
          ref = ref.skip(options.skip);
        }
        if (options.limit) {
          ref = ref.limit(options.limit);
        }
      }
      ref.toArray(function (err, result) {
        connPool.release(dbClient);
        cb(err, result);
      });
    }, 0);
  };

  connPool.findOneAndUpdate = function (collectionName, filter, update, cb, options) {
    connPool.acquire(function (err, dbClient) {
      if (err) return cb(err, null);
      var collectionHandler = dbClient.collection(collectionName);
      collectionHandler.findOneAndUpdate(filter, update, options, function (err, result) {
        connPool.release(dbClient);
        cb(err, result);
      });
    }, 0);
  };

  connPool.deleteOne = function (collectionName, filter, cb, options) {
    connPool.acquire(function (err, dbClient) {
      if (err) return cb(err, null);
      var collectionHandler = dbClient.collection(collectionName);
      collectionHandler.deleteOne(filter, options, function (err, result) {
        connPool.release(dbClient);
        cb(err, result);
      });
    }, 0);
  };

  connPool.count = function (collectionName, filter, cb, options) {
    connPool.acquire(function (err, dbClient) {
      if (err) return cb(err, null);
      var collectionHandler = dbClient.collection(collectionName);
      collectionHandler.count(filter, options, function (err, result) {
        connPool.release(dbClient);
        cb(err, result);
      });
    }, 0);
  };

  connPool.stats = function (collectionName, cb, inputOptions) {
    connPool.acquire(function (err, dbClient) {
      if (err) return cb(err, null);
      try {
        var collectionHandler = dbClient.collection(collectionName);
      } catch (err) {
        return cb(err);
      }

      var options = inputOptions || {};
      collectionHandler.stats(options, function (err, result) {
        connPool.release(dbClient);
        cb(err, result);
      });
    }, 0);
  };

  connPool.updateOne = function (collectionName, filter, toSet, cb, options) {
    connPool.acquire(function (err, dbClient) {
      if (err) return cb(err, null);
      var collectionHandler = dbClient.collection(collectionName);
      collectionHandler.updateOne(filter, toSet, options, function (err, result) {
        connPool.release(dbClient);
        cb(err, result);
      });
    }, 0);
  };


  /**
   [
   {
     key: {
       phoneNumber: 1,
     },
     name: "phoneNumber",
     unique: true
   }
   ]
   */
  connPool.createIndexes = function (collectionName, indexSpecs, cb) {
    connPool.acquire(function (err, dbClient) {
      if (err) return cb(err, null);
      var collectionHandler = dbClient.collection(collectionName);
      collectionHandler.createIndexes(indexSpecs, function (err, result) {
        connPool.release(dbClient);
        cb(err, result);
      });
    }, 0);
  };


  return connPool;
}

