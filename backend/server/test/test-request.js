/**
 * Created by zhongzhengkai on 2017/5/23.
 */



var rp = require('request-promise');
var options = {
  method: 'POST',
  uri: 'https://form.boldseas.com/apiqy/f/v1/prod/porsche/car-owner-authentication/phone-code',
  body: {"phoneNumber": "18600393748"},
  headers:{apiKey:'ddfCXxxEE134PREJYB!De12','Content-Type':'application/json'},
  json: true
};

rp(options).then(function (parsedBody) {
  console.log(parsedBody)
}).catch(function (err) {
  console.log(err)
});


