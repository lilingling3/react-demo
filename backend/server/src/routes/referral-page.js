/**
 * Created by zhongzhengkai on 2017/5/4.
 */
var router = require('express').Router();
module.exports = router;
var g = require('../core/gateway');
var login = require('../controller/referral-page/login');

router.get('/login',g.use(login.GET));
