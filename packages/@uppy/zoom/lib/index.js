var _class, _temp;

function _assertThisInitialized(self) { if (self === void 0) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return self; }

function _inheritsLoose(subClass, superClass) { subClass.prototype = Object.create(superClass.prototype); subClass.prototype.constructor = subClass; subClass.__proto__ = superClass; }

var _require = require('@uppy/core'),
    Plugin = _require.Plugin;

var _require2 = require('@uppy/companion-client'),
    Provider = _require2.Provider;

var _require3 = require('@uppy/provider-views'),
    ProviderViews = _require3.ProviderViews;

var _require4 = require('preact'),
    h = _require4.h;

module.exports = (_temp = _class = /*#__PURE__*/function (_Plugin) {
  _inheritsLoose(Zoom, _Plugin);

  function Zoom(uppy, opts) {
    var _this;

    _this = _Plugin.call(this, uppy, opts) || this;
    _this.id = _this.opts.id || 'Zoom';
    Provider.initPlugin(_assertThisInitialized(_this), opts);
    _this.title = _this.opts.title || 'Zoom';

    _this.icon = function () {
      return h("svg", {
        "aria-hidden": "true",
        focusable: "false",
        width: "32",
        height: "32",
        viewBox: "0 0 32 32"
      }, h("rect", {
        width: "32",
        height: "32",
        rx: "16",
        fill: "#0E71EB"
      }), h("g", {
        fill: "none",
        "fill-rule": "evenodd"
      }, h("path", {
        fill: "#fff",
        d: "M29,31H14c-1.657,0-3-1.343-3-3V17h15c1.657,0,3,1.343,3,3V31z",
        style: "transform: translate(-5px, -5px) scale(0.9);"
      }), h("polygon", {
        fill: "#fff",
        points: "37,31 31,27 31,21 37,17",
        style: "transform: translate(-5px, -5px) scale(0.9);"
      })));
    };

    _this.provider = new Provider(uppy, {
      companionUrl: _this.opts.companionUrl,
      companionHeaders: _this.opts.companionHeaders || _this.opts.serverHeaders,
      provider: 'zoom',
      pluginId: _this.id
    });
    _this.onFirstRender = _this.onFirstRender.bind(_assertThisInitialized(_this));
    _this.render = _this.render.bind(_assertThisInitialized(_this));
    return _this;
  }

  var _proto = Zoom.prototype;

  _proto.install = function install() {
    this.view = new ProviderViews(this, {
      provider: this.provider
    });
    var target = this.opts.target;

    if (target) {
      this.mount(target, this);
    }
  };

  _proto.uninstall = function uninstall() {
    this.view.tearDown();
    this.unmount();
  };

  _proto.onFirstRender = function onFirstRender() {
    return this.view.getFolder();
  };

  _proto.render = function render(state) {
    return this.view.render(state);
  };

  return Zoom;
}(Plugin), _class.VERSION = require('../package.json').version, _temp);