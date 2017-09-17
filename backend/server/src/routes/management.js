/**
 * Created by zhongzhengkai on 2017/6/14.
 */

var router = require('express').Router();
module.exports = router;
var g = require('../core/gateway');
var login = require('../controller/management/login');
var api = require('../controller/management/api');

router.get('/',g.use(login.GET));

router.get('/api/get-books',g.use(api.getBooks));

router.post('/api/test-post',g.use(api.testPost));

router.post('/api/get-info',g.use(api.getInfo));

