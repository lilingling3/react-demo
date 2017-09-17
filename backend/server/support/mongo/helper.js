/**
 * Created by zhongzhengkai on 16/4/14.
 */

var mongoManager = require('./lib/manager');

exports.find = mongoManager.find;

exports.insertMany = mongoManager.insertMany;

exports.findOneAndUpdate = mongoManager.findOneAndUpdate;

exports.deleteOne = mongoManager.deleteOne;

exports.count = mongoManager.count;

exports.stats = mongoManager.stats;

/**
 * 默认更新,如果不存在不会做插入,除非指定upsert为true
 *
 * example1,局部更新或插入某个对象:
 * updateOne('ciam', 'form', {id:3}, {$set:{_class:'m.Data',fieldKeys:[1,2,3,4]}}, function(){...}, {upsert:true});
 *
 * example2,覆盖更新或插入某个对象:
 * updateOne('ciam', 'form', {id:3}, {_class:'m.Data',fieldKeys:[1,2,3,4]}, function(){...}, {upsert:true});
 *
 * 这个命令在mongo窗口命令里可以执行,在updateOne里却报错,以提交给mongo官网,期待给我一个答复
 * db.form.update({_id:ObjectId('574fe4f70ee6c41917c4dfeb')},{$set:{_class:'mmm'}});
 *
 */
exports.updateOne = mongoManager.updateOne;

exports.createIndexes = mongoManager.createIndexes;
