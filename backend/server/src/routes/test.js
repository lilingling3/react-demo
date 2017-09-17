/**
 * Created by zhongzhengkai on 2017/5/4.
 */
var router = require('express').Router();
module.exports = router;
var g = require('../core/gateway');
var testCtrl = require('../controller/test/ctrl');

router.get('/page1', g.use(testCtrl.getPage1));

router.get('/page2', g.use(testCtrl.getPage2));

router.post('/commit-cmd', g.use(testCtrl.postPage1));

router.post('/save-vin-pic', g.use(testCtrl.saveVinPic));

router.post('/parse-excel', g.use(testCtrl.parseExcelFile));

