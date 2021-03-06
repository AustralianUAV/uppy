var _class, _temp;

function _extends() { _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; }; return _extends.apply(this, arguments); }

function _inheritsLoose(subClass, superClass) { subClass.prototype = Object.create(superClass.prototype); subClass.prototype.constructor = subClass; subClass.__proto__ = superClass; }

var _require = require('@uppy/core'),
    Plugin = _require.Plugin;

var _require2 = require('preact'),
    h = _require2.h;

var _require3 = require('@uppy/companion-client'),
    SearchProvider = _require3.SearchProvider;

var _require4 = require('@uppy/provider-views'),
    SearchProviderViews = _require4.SearchProviderViews;
/**
 * Unsplash
 *
 */


module.exports = (_temp = _class = /*#__PURE__*/function (_Plugin) {
  _inheritsLoose(Unsplash, _Plugin);

  function Unsplash(uppy, opts) {
    var _this;

    _this = _Plugin.call(this, uppy, opts) || this;
    _this.id = _this.opts.id || 'Unsplash';
    _this.title = _this.opts.title || 'Unsplash';
    _this.type = 'acquirer';

    _this.icon = function () {
      return h("svg", {
        viewBox: "0 0 32 32",
        height: "32",
        width: "32",
        "aria-hidden": "true"
      }, h("path", {
        d: "M46.575 10.883v-9h12v9zm12 5h10v18h-32v-18h10v9h12z",
        fill: "#fff"
      }), h("rect", {
        width: "32",
        height: "32",
        rx: "16"
      }), h("path", {
        d: "M13 12.5V8h6v4.5zm6 2.5h5v9H8v-9h5v4.5h6z",
        fill: "#fff"
      }));
    };

    var defaultOptions = {};
    _this.opts = _extends({}, defaultOptions, opts);
    _this.hostname = _this.opts.companionUrl;

    if (!_this.hostname) {
      throw new Error('Companion hostname is required, please consult https://uppy.io/docs/companion');
    }

    _this.provider = new SearchProvider(uppy, {
      companionUrl: _this.opts.companionUrl,
      companionHeaders: _this.opts.companionHeaders,
      provider: 'unsplash',
      pluginId: _this.id
    });
    return _this;
  }

  var _proto = Unsplash.prototype;

  _proto.install = function install() {
    this.view = new SearchProviderViews(this, {
      provider: this.provider
    });
    var target = this.opts.target;

    if (target) {
      this.mount(target, this);
    }
  };

  _proto.onFirstRender = function onFirstRender() {// do nothing
  };

  _proto.render = function render(state) {
    return this.view.render(state);
  };

  _proto.uninstall = function uninstall() {
    this.unmount();
  };

  return Unsplash;
}(Plugin), _class.VERSION = require('../package.json').version, _temp);