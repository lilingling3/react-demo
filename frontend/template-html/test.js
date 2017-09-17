/**
 * Created by ypf on 2016/12/30.
 */



// console.log(new Date().getTimezoneOffset())

// var date = new Date(2016, 11, 29);
// console.log(new Date(date.setHours(22, 1, 2)));

// console.log(new Date('2016-11-29 22:01:02').toLocaleTimeString())
//
// console.log(new Date('2016-11-29 22:01:02'))
//
//
//
// function Person(name){
//   //this.name = name || 'no name';
// }
// Person.prototype.name = 'prototype name';
//
// console.log(Person.__proto__);
// console.log(Person.__proto__.__proto__);
// console.log(Person.__proto__.__proto__.__proto__);

//var p = new Person;
//console.log(p.name);
//console.log(p.__proto__.name);
//
//
//var fn = new Function('console.log("new Function");');
//
//
//fn();
//console.log("--------------");
//
//
//var foo = 'out';
//
//
//(function(){
//  var foo = 'in';
//})();
//
//
//console.log(foo);

function getYearWeek(date) {
  var date2 = new Date(date.getFullYear(), 0, 1);
  var day1 = date.getDay();
  if (day1 == 0) day1 = 7;
  var day2 = date2.getDay();
  if (day2 == 0) day2 = 7;
  d = Math.round((date.getTime() - date2.getTime() + (day2 - day1) * (24 * 60 * 60 * 1000)) / 86400000);
  return Math.ceil(d / 7) + 1;
}

function theWeek(time) {
  var totalDays = 0;
  if (time) now = new Date(time);
  else now = new Date();
  var years = now.getYear()
  if (years < 1000) {
    years += 1900
  }

  var days = new Array(12);
  days[0] = 31;
  days[2] = 31;
  days[3] = 30;
  days[4] = 31;
  days[5] = 30;
  days[6] = 31;
  days[7] = 31;
  days[8] = 30;
  days[9] = 31;
  days[10] = 30;
  days[11] = 31;

  //判断是否为闰年，针对2月的天数进行计算
  if (Math.round(now.getYear() / 4) == now.getYear() / 4) {
    days[1] = 29
  } else {
    days[1] = 28
  }

  if (now.getMonth() == 0) {
    totalDays = totalDays + now.getDate();
  } else {
    var curMonth = now.getMonth();
    for (var count = 1; count <= curMonth; count++) {
      totalDays = totalDays + days[count - 1];
    }
    totalDays = totalDays + now.getDate();
  }
  //得到第几周
  var week = Math.round(totalDays / 7);
  return week;
}
var date = new Date();
date.setDate(31);
date.setMonth(11);
console.log(new Date(new Date().setDate(3)))






