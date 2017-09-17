'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _reactNative = require('react-native');

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _Picker = require('rmc-picker/lib/Picker');

var _Picker2 = _interopRequireDefault(_Picker);

var _DatePickerMixin = require('./DatePickerMixin');

var _DatePickerMixin2 = _interopRequireDefault(_DatePickerMixin);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

var styles = _reactNative.StyleSheet.create({
    smallPickerItem: {
        fontSize: 20
    },
    item: {
        flex: 1
    },
    root: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingTop: 10,
        paddingBottom: 10
    }
});
var DatePicker = _react2["default"].createClass({
    displayName: 'DatePicker',

    mixins: [_DatePickerMixin2["default"]],
    render: function render() {
        var _this = this;

        var _getValueDataSource = this.getValueDataSource(),
            value = _getValueDataSource.value,
            dataSource = _getValueDataSource.dataSource;

        var mode = this.props.mode;

        var inner = dataSource.map(function (items, i) {
            return _react2["default"].createElement(_reactNative.View, { style: styles.item, key: i }, _react2["default"].createElement(_Picker2["default"], { itemStyle: mode === 'datetime' ? styles.smallPickerItem : undefined, pure: false, selectedValue: value[i], onValueChange: function onValueChange(v) {
                    _this.onValueChange(i, v);
                } }, items));
        });
        return _react2["default"].createElement(_reactNative.View, { style: styles.root }, inner);
    }
});
exports["default"] = DatePicker;
module.exports = exports['default'];