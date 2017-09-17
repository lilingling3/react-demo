/**
 * Created by bykj on 2017-7-5.
 */
// var name = "The Window";
// var object = {
//   name : "My Object",
//   getNameFunc : function(){
//     var that = this;
//     return function(){
//       return this.name;
//     };
//   }
// };
// console.log(object.getNameFunc()());
// console.log('-----------');


// function NumAscSort(a,b)
// {
//   return a - b;
// }
// function NumDescSort(a,b)
// {
//   return b - a;
// }
// var arr = new Array( 3600, 5010, 10100, 801);
// arr.sort(NumDescSort);
// console.log(arr);
// arr.sort(NumAscSort);
// console.log(arr);


// var result;
//
// function cal(money) {
//   var singlePrice = 2;
//   var gaiNum;
//   var pinNum;
//   result = gaiNum = pinNum = parseInt(money / singlePrice);
//   transfer(gaiNum, pinNum);
//   console.log('result==' + result);
// }
//
// function transfer(gaiNum, pinNum) {
//   var newJiu = parseInt(gaiNum / 4) + parseInt(pinNum / 2);
//   var restGai = gaiNum % 4;
//   var restPin = pinNum % 2;
//   //console.log(newJiu);
//   result += newJiu;
//   if (restGai < 4 && restPin < 2 && newJiu == 0) {
//     return 0;
//   } else {
//     return transfer(restGai + newJiu, restPin + newJiu);
//   }
// }
//
// cal(10);

// function format(arr) {
//   return arr.map(function (s) {
//     var array = [];
//     var newString = '';
//     for (var i = 0; i < s.length; i++) {
//       var word = s.substring(i, i + 1);
//       if (i == 0) {
//         word = word.toUpperCase();
//       } else {
//         word = word.toLowerCase();
//       }
//       array.push(word);
//       newString = newString+word;
//     }
//   //  return array.join('');
//     return newString;
//   });
// }
// console.log(format(['LIST', 'aDMiN']));

