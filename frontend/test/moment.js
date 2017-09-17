/**
 * Created by zhongzhengkai on 2017/5/19.
 */

var moment = require('moment');

console.log(moment(new Date().getTime()).format('YYYY-MM-DD HH:ii:ss'))

var arr = [11,2,3,8,5,6,7,4,9,10,1];
var arr2 = [{age:2},{age:22},{age:1}];

// console.log(arr2.sort(function (o1, o2){
//   if(o1.age>o2.age)return 1;
//   else if(o1.age==o2.age)return 0;
//   else return -1;
// }));


// console.log(arr2.slice(0,1));
// console.log(arr2);


// console.log([1,2,3,2,2,2].indexOf(2));

// console.log([1,2,3,4].join(':'));



// var A = new Function('.......');

// function A(a){
//   this.a = a;
// }

// A.prototype.a = 1;
// var a = new A(11);


function bb(){
  // var b = [];
  return function aa() {
    var a = 1;
    return function () {
      return "a:" + (a++) + "b:" + (b++);
    }
  }
}


function aa(a) {
  return function (b) {
    return 's'+a+b;
  }
}

// var aa = (a)=> (b) => 's'+a+b;

// var hook= aa(1);
// console.log(hook(2));
// console.log(hook(3));