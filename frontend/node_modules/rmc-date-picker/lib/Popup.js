'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _classCallCheck2 = require('babel-runtime/helpers/classCallCheck');

var _classCallCheck3 = _interopRequireDefault(_classCallCheck2);

var _possibleConstructorReturn2 = require('babel-runtime/helpers/possibleConstructorReturn');

var _possibleConstructorReturn3 = _interopRequireDefault(_possibleConstructorReturn2);

var _inherits2 = require('babel-runtime/helpers/inherits');

var _inherits3 = _interopRequireDefault(_inherits2);

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _Popup = require('rmc-picker/lib/Popup');

var _Popup2 = _interopRequireDefault(_Popup);

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

function noop() {}

var PopupDatePicker = function (_React$Component) {
    (0, _inherits3["default"])(PopupDatePicker, _React$Component);

    function PopupDatePicker(props) {
        (0, _classCallCheck3["default"])(this, PopupDatePicker);

        var _this = (0, _possibleConstructorReturn3["default"])(this, _React$Component.call(this, props));

        _this.onPickerChange = function (pickerDate) {
            _this.setState({
                pickerDate: pickerDate
            });
            if (_this.props.datePicker.props.onDateChange) {
                _this.props.datePicker.props.onDateChange(pickerDate);
            }
        };
        _this.onOk = function () {
            var onChange = _this.props.onChange;

            if (onChange) {
                onChange(_this.datePicker.getDate());
            }
        };
        _this.saveRef = function (datePicker) {
            _this.datePicker = datePicker;
        };
        _this.fireVisibleChange = function (visible) {
            if (_this.state.visible !== visible) {
                if (!('visible' in _this.props)) {
                    _this.setVisibleState(visible);
                }
                var onVisibleChange = _this.props.onVisibleChange;

                if (onVisibleChange) {
                    onVisibleChange(visible);
                }
            }
        };
        _this.state = {
            pickerDate: null,
            visible: _this.props.visible || false
        };
        return _this;
    }

    PopupDatePicker.prototype.componentWillReceiveProps = function componentWillReceiveProps(nextProps) {
        if ('visible' in nextProps) {
            this.setVisibleState(nextProps.visible);
        }
    };

    PopupDatePicker.prototype.setVisibleState = function setVisibleState(visible) {
        this.setState({
            visible: visible
        });
        if (!visible) {
            this.setState({
                pickerDate: null
            });
        }
    };

    PopupDatePicker.prototype.render = function render() {
        var dataPicker = _react2["default"].cloneElement(this.props.datePicker, {
            date: this.state.pickerDate || this.props.date,
            onDateChange: this.onPickerChange,
            ref: this.saveRef
        });
        return _react2["default"].createElement(_Popup2["default"], __assign({}, this.props, { onVisibleChange: this.fireVisibleChange, onOk: this.onOk, content: dataPicker, visible: this.state.visible }));
    };

    return PopupDatePicker;
}(_react2["default"].Component);

exports["default"] = PopupDatePicker;

PopupDatePicker.defaultProps = {
    onVisibleChange: noop,
    prefixCls: 'rmc-picker-popup',
    onChange: noop,
    onDismiss: noop,
    onPickerChange: noop
};
module.exports = exports['default'];