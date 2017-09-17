/**
 * Created by bykj on 2016/6/30.
 */
var db = require("./manager");
var images = [{'picName': 'corner1.png', 'groupName': 'selects'}, {'picName': 'corner2.jpg', 'groupName': 'selects'}];
// db.insertMany('ciam', 'images', images, function (err, result) {
//   console.log(err, result);
// });
db.find('ciam', 'images', {}, function (err, result) {
  console.log(err, result);
})
