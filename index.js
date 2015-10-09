'use strict';

exports.__esModule = true;

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

function _inherits(subClass, superClass) { if (typeof superClass !== 'function' && superClass !== null) { throw new TypeError('Super expression must either be null or a function, not ' + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

/* global window: false */
/* global document: false */

var AnimatedPanel = (function (_React$Component) {
  _inherits(AnimatedPanel, _React$Component);

  _createClass(AnimatedPanel, null, [{
    key: 'propTypes',
    get: function get() {
      return {
        animated: _react2['default'].PropTypes.bool,
        adTag: _react2['default'].PropTypes.string,
        lazyLoad: _react2['default'].PropTypes.bool,
        lazyLoadMargin: _react2['default'].PropTypes.number,
        sizes: _react2['default'].PropTypes.arrayOf(_react2['default'].PropTypes.array),
        reserveHeight: _react2['default'].PropTypes.number,
        styled: _react2['default'].PropTypes.bool
      };
    }
  }, {
    key: 'defaultProps',
    get: function get() {
      return {
        animated: true,
        lazyLoad: true,
        lazyLoadMargin: 350,
        sizes: [[60, 60], [70, 70], [300, 250], [1024, 768]],
        styled: true
      };
    }
  }]);

  function AnimatedPanel() {
    _classCallCheck(this, AnimatedPanel);

    for (var _len = arguments.length, args = Array(_len), _key = 0; _key < _len; _key++) {
      args[_key] = arguments[_key];
    }

    _React$Component.call.apply(_React$Component, [this].concat(args));
    this.loadElementWhenInView = this.loadElementWhenInView.bind(this);
  }

  AnimatedPanel.prototype.componentWillMount = function componentWillMount() {
    this.setState({
      tagId: 'googlead-' + (Math.random() * 1e17).toString(16),
      adGenerated: false
    });
  };

  AnimatedPanel.prototype.componentDidMount = function componentDidMount() {
    if (this.state && this.state.tagId) {
      /* global window document */
      if (typeof window !== 'undefined' && window.document && !window.googletag) {
        window.googletag = { cmd: [] };
        var gads = document.createElement('script');
        gads.async = true;
        gads.type = 'text/javascript';
        var useSSL = 'https:' === window.location.protocol;
        gads.src = (useSSL ? 'https:' : 'http:') + '//www.googletagservices.com/tag/js/gpt.js';
        document.head.appendChild(gads);
      }
    }
    if (!this.props.lazyLoad && this.state && this.state.tagId && !this.state.adGenerated) {
      this.generateAd();
    }
    window.addEventListener('scroll', this.loadElementWhenInView);
    window.addEventListener('resize', this.loadElementWhenInView);
    this.loadElementWhenInView();
  };

  AnimatedPanel.prototype.componentWillUnmount = function componentWillUnmount() {
    this.cleanupEventListeners();
  };

  AnimatedPanel.prototype.isElementInViewport = function isElementInViewport(elm) {
    var margin = arguments.length <= 1 || arguments[1] === undefined ? 0 : arguments[1];

    var rect = _react2['default'].findDOMNode(elm).getBoundingClientRect();
    return rect.bottom > -margin && rect.right > -margin && rect.left < (window.innerWidth || document.documentElement.clientWidth) + margin && rect.top < (window.innerHeight || document.documentElement.clientHeight) + margin;
  };

  AnimatedPanel.prototype.loadElementWhenInView = function loadElementWhenInView() {
    var containerElement = this.refs.container;
    if (!this.state.adGenerated && this.props.lazyLoad && this.isElementInViewport(containerElement, this.props.lazyLoadMargin)) {
      this.generateAd();
    }
    if (this.isElementInViewport(containerElement) === true) {
      var targetContainerElement = _react2['default'].findDOMNode(containerElement);
      targetContainerElement.className += ' animatedpanel--visible';
      this.cleanupEventListeners();
    }
  };

  AnimatedPanel.prototype.cleanupEventListeners = function cleanupEventListeners() {
    window.removeEventListener('scroll', this.loadElementWhenInView);
    window.removeEventListener('resize', this.loadElementWhenInView);
  };

  AnimatedPanel.prototype.generateAd = function generateAd() {
    var _this = this;

    this.setState({ adGenerated: true });
    if (window.googletag && this.props.adTag) {
      (function () {
        var googleTag = window.googletag;
        googleTag.cmd.push(function () {
          var mappingAd = window.googletag.sizeMapping().addSize([980, 200], [1024, 768]).addSize([0, 0], [300, 250]).build();
          var slot = googleTag.defineSlot(_this.props.adTag, _this.props.sizes, _this.state.tagId).setTargeting('resp_mpu_inline_ad', 'refresh').addService(googleTag.pubads());
          if (_this.props.sizes && _this.props.sizes.length > 1) {
            slot.defineSizeMapping(mappingAd);
          }
          googleTag.pubads().enableSingleRequest();
          googleTag.enableServices();
          googleTag.display(_this.state.tagId);
        });
      })();
    } else {
      var adToHide = _react2['default'].findDOMNode(this.refs.container);
      adToHide.style.display = 'none';
      if (typeof console !== 'undefined' && console.error) {
        console.error('window.googletag not present, please put googletag js into html');
      }
    }
  };

  AnimatedPanel.prototype.render = function render() {
    var tag = undefined;
    if (this.state && this.state.tagId) {
      var adStyle = {
        minHeight: this.props.reserveHeight || undefined
      };
      tag = _react2['default'].createElement('div', { className: 'animatedpanel__googlead', id: this.state.tagId, style: adStyle });
    }
    var rootClassNames = ['animatedpanel__container'];
    var title = undefined;
    if (this.props.styled) {
      rootClassNames.push('animatedpanel__container--styled');
      title = _react2['default'].createElement(
        'span',
        { ref: 'title', className: 'animatedpanel__title' },
        'Advertisement'
      );
    }
    if (this.props.animated) {
      rootClassNames.push('animatedpanel__animated');
    }
    var aria = {
      role: 'complementary',
      itemscope: 'https://schema.org/WPAdBlock'
    };
    return _react2['default'].createElement(
      'div',
      _extends({ ref: 'container', className: rootClassNames.join(' ') }, aria),
      title,
      tag
    );
  };

  return AnimatedPanel;
})(_react2['default'].Component);

exports['default'] = AnimatedPanel;
module.exports = exports['default'];