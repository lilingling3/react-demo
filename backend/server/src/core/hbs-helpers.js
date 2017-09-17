/**
 * Created by zhongzhengkai on 16/6/6.
 */

module.exports = {

  //expression helper的实现,如：{{#expression a '==' b '&&' c '>' 0}}, {{#expression a 'instanceOf' 'Error'}}
  expression: function () {
    var exps = [];
    try {
      //最后一个参数作为展示内容，也就是平时的options。不作为逻辑表达式部分
      var arg_len = arguments.length;
      var len = arg_len - 1;
      for (var j = 0; j < len; j++) {
        exps.push(arguments[j]);
      }
      var result = eval(exps.join(' '));
      if (result) {
        return arguments[len].fn(this);
      } else {
        return arguments[len].inverse(this);
      }
    } catch (e) {
      throw new Error('Handlerbars Helper "expression" can not deal with wrong expression:' + exps.join(' ') + ".");
    }
  },

  compare:function(left, operator, right, options) {
    if (arguments.length < 3) {
      throw new Error('Handlerbars Helper "compare" needs 2 parameters');
    }
    var operators = {
      '==':     function(l, r) {return l == r; },
      '===':    function(l, r) {return l === r; },
      '!=':     function(l, r) {return l != r; },
      '!==':    function(l, r) {return l !== r; },
      '<':      function(l, r) {return l < r; },
      '>':      function(l, r) {return l > r; },
      '<=':     function(l, r) {return l <= r; },
      '>=':     function(l, r) {return l >= r; },
      'typeof': function(l, r) {return typeof l == r; }
    };

    if (!operators[operator]) {
      throw new Error('Handlerbars Helper "compare" doesn\'t know the operator ' + operator);
    }

    var result = operators[operator](left, right);

    if (result) {
      return options.fn(this);
    } else {
      return options.inverse(this);
    }
  },

  indexOf:function(sourceStr, targetStr, options){
    if(sourceStr.indexOf(targetStr)!=-1){
      return options.fn(this);
    }else{
      return options.inverse(this);
    }
  },

  incOne:function(number, options){
    number++;
    return number;
  },

  itemToTds: function (item, keys, options) {
    var tdStr = '';
    keys.forEach(function (key) {
      var value = item[key] || '';
      tdStr += '<td>' + value + ' </td>';
    });
    return tdStr;
  },

  JSON_stringify:(jsonObj)=>{
    return JSON.stringify(jsonObj);
  },

  Yujie:(params)=>{
    return '<h1 style="color:red">i am yujie ' +params +'</h1>'
  }
};
