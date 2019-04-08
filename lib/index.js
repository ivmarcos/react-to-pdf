'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _jspdf = require('jspdf');

var _jspdf2 = _interopRequireDefault(_jspdf);

var _html2canvas = require('html2canvas');

var _html2canvas2 = _interopRequireDefault(_html2canvas);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var ReactToPdf = function (_PureComponent) {
  _inherits(ReactToPdf, _PureComponent);

  function ReactToPdf(props) {
    _classCallCheck(this, ReactToPdf);

    var _this = _possibleConstructorReturn(this, (ReactToPdf.__proto__ || Object.getPrototypeOf(ReactToPdf)).call(this, props));

    _this.toPdf = _this.toPdf.bind(_this);
    _this.targetRef = _react2.default.createRef();
    return _this;
  }

  _createClass(ReactToPdf, [{
    key: 'toPdf',
    value: function toPdf() {
      var _props = this.props,
          targetRef = _props.targetRef,
          filename = _props.filename,
          x = _props.x,
          y = _props.y,
          options = _props.options,
          onComplete = _props.onComplete;

      var source = targetRef || this.targetRef;
      var targetComponent = source.current || source;
      if (!targetComponent) {
        throw new Error('Target ref must be used or informed. See https://github.com/ivmarcos/react-to-pdf#usage.');
      }
      (0, _html2canvas2.default)(targetComponent, { logging: false }).then(function (canvas) {
        var imgData = canvas.toDataURL('image/png');
        var pdf = new _jspdf2.default(options);
        pdf.addImage(imgData, 'JPEG', x, y);
        pdf.save(filename);
        if (onComplete) onComplete();
      });
    }
  }, {
    key: 'render',
    value: function render() {
      var children = this.props.children;

      return children({ toPdf: this.toPdf, targetRef: this.targetRef });
    }
  }]);

  return ReactToPdf;
}(_react.PureComponent);

ReactToPdf.defaultProps = {
  filename: 'download.pdf',
  x: 0,
  y: 0,
  onComplete: undefined,
  targetRef: undefined
};

exports.default = ReactToPdf;
