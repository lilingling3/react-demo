/**
 * Created by zhongzhengkai on 16/4/15.
 *
 * 涉及到需要热替换的文件模块,都通过hot.js来require,该文件只是负责main函数,
 * 因为main函数里的调用的require只会被触发一次,所以通过hot.require来达到多次触发的目的
 *
 * 涉及到需要热替换的方法,通过重写hot-funcs.js里的方法,在hot.js里暴露出去达到热替换的目的
 *
 */


exports.handleAllHttpAccess = function (req, res, next) {
	require('./hot-funcs').handleAllHttpAccess(req, res, next);
};
