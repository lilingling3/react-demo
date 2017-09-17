/**
 * Created by zhongzhengkai on 16/4/14.
 */

var log4js = require('log4js');
var wrappedLoggerMap = {};
var slice = Array.prototype.slice;

var workerId,workerPid;
console._log = console.log;

exports.configure = function (worker, conf) {
	workerId = worker.id;
	workerPid = worker.process.pid;
	log4js.configure(conf);

	conf.appenders.filter(val=> val.category != null)
		.forEach(val=>makeWrappedLogger(val.category));
	// 凡是 console.log 打印的信息都打印到 debug.log 文件里
	console.log = function(){
		_getLogger('debug').log.apply(console,arguments);
	};
};


exports.getLogger = function getLogger(name) {
	return _getLogger(name);
};

/**
 * 对log4js进一步的封装,在整个进程还没有初始化workerCache的时候,调用原生的打印方法,
 * 如果workerCache已近初始化,则封装打印方法,打印信息里补上当前工作进程的id
 * @param name
 * @returns {*}
 * @private
 */
function _getLogger(name){
	var wrappedLogger = wrappedLoggerMap[name];
	if (wrappedLogger) {
		return wrappedLogger;
	} else {
		return makeWrappedLogger(name);
	}
}

function makeWrappedLogger(name){
	var prefix = '';
	if (workerId) {
		prefix = '[worker:' + workerId + '] ';
	} else {
		prefix = '[master] ' ;
	}

	//<<<------劫持logger里指定的methods,注入当前工作进程信息
	var wrappedLogger = {};
	var logger = log4js.getLogger(name);
	var methods = ['log','trace', 'debug', 'info', 'warn', 'error', 'fatal'];
	methods.forEach(function (method) {
		wrappedLogger[method] = function () {
			if (method === 'log')method = 'info';
			var args = slice.call(arguments);
			var firstElement = args[0];

			if(typeof firstElement ==='string'){
				//为了支持 logger.info('my name is %s','suck') 这样的写法
				firstElement = prefix + firstElement;
				args[0] = firstElement;
			}else{
				args.unshift(prefix);
			}

			logger[method].apply(logger, args);
		};
	});
	//------>>>

	wrappedLoggerMap[name] = wrappedLogger;
	return wrappedLogger;
}
