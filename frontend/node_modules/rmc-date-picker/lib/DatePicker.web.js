'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _index = require('rmc-picker/lib/index.web');

var _index2 = _interopRequireDefault(_index);

var _classnames = require('classnames');

var _classnames2 = _interopRequireDefault(_classnames);

var _DatePickerMixin = require('./DatePickerMixin');

var _DatePickerMixin2 = _interopRequireDefault(_DatePickerMixin);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

var __assign = undefined && undefined.__assign || Object.assign || function (t) {
    for (var s, i = 1, n = arguments.length; i < n; i++) {
        s = arguments[i];
        for (var p in s) {
            if (Object.prototype.hasOwnProperty.call(s, p)) t[p] = s[p];
        }
    }
    return t;
};

var DatePickerWeb = _react2["default"].createClass({
    displayName: 'DatePickerWeb',

    mixins: [_DatePickerMixin2["default"]],
    getDefaultProps: function getDefaultProps() {
        return {
            prefixCls: 'rmc-date-picker',
            pickerPrefixCls: 'rmc-picker',
            disabled: false
        };
    },
    render: function render() {
        var _this = this;

        var props = this.props;
        var prefixCls = props.prefixCls,
            pickerPrefixCls = props.pickerPrefixCls,
            className = props.className,
            rootNativeProps = props.rootNativeProps,
            disabled = props.disabled;

        var _getValueDataSource = this.getValueDataSource(),
            value = _getValueDataSource.value,
            dataSource = _getValueDataSource.dataSource;

        var inner = dataSource.map(function (items, i) {
            return _react2["default"].createElement("div", { key: i, className: prefixCls + '-item' }, _react2["default"].createElement(_index2["default"], { disabled: disabled, prefixCls: pickerPrefixCls, pure: false, selectedValue: value[i], onValueChange: function onValueChange(v) {
                    _this.onValueChange(i, v);
                } }, items));
        });
        return _react2["default"].createElement("div", __assign({}, rootNativeProps, { className: (0, _classnames2["default"])(className, prefixCls) }), inner);
    }
});
exports["default"] = DatePickerWeb;
module.exports = exports['default'];