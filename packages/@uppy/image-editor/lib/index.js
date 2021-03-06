var _class, _temp;

function _extends() { _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; }; return _extends.apply(this, arguments); }

function _inheritsLoose(subClass, superClass) { subClass.prototype = Object.create(superClass.prototype); subClass.prototype.constructor = subClass; subClass.__proto__ = superClass; }

var _require = require('@uppy/core'),
    Plugin = _require.Plugin;

var Editor = require('./Editor');

var Translator = require('@uppy/utils/lib/Translator');

var _require2 = require('preact'),
    h = _require2.h;

module.exports = (_temp = _class = /*#__PURE__*/function (_Plugin) {
  _inheritsLoose(ImageEditor, _Plugin);

  function ImageEditor(uppy, opts) {
    var _this;

    _this = _Plugin.call(this, uppy, opts) || this;

    _this.save = function (blob) {
      var _this$getPluginState = _this.getPluginState(),
          currentImage = _this$getPluginState.currentImage;

      _this.uppy.setFileState(currentImage.id, {
        data: blob,
        size: blob.size,
        preview: null
      });

      var updatedFile = _this.uppy.getFile(currentImage.id);

      _this.uppy.emit('thumbnail:request', updatedFile);

      _this.setPluginState({
        currentImage: updatedFile
      });

      _this.uppy.emit('file-editor:complete', updatedFile);
    };

    _this.selectFile = function (file) {
      _this.uppy.emit('file-editor:start', file);

      _this.setPluginState({
        currentImage: file
      });
    };

    _this.id = _this.opts.id || 'ImageEditor';
    _this.title = 'Image Editor';
    _this.type = 'editor';
    _this.defaultLocale = {
      strings: {
        save: 'Save',
        revert: 'Revert',
        rotate: 'Rotate',
        zoomIn: 'Zoom in',
        zoomOut: 'Zoom out',
        flipHorizontal: 'Flip horizonal',
        aspectRatioSquare: 'Crop square',
        aspectRatioLandscape: 'Crop landscape (16:9)',
        aspectRatioPortrait: 'Crop portrait (9:16)'
      }
    };
    var defaultCropperOptions = {
      viewMode: 1,
      background: false,
      autoCropArea: 1,
      responsive: true
    };
    var defaultActions = {
      revert: true,
      rotate: true,
      flip: true,
      zoomIn: true,
      zoomOut: true,
      cropSquare: true,
      cropWidescreen: true,
      cropWidescreenVertical: true
    };
    var defaultOptions = {
      quality: 0.8
    };
    _this.opts = _extends({}, defaultOptions, opts, {
      actions: _extends({}, defaultActions, opts.actions),
      cropperOptions: _extends({}, defaultCropperOptions, opts.cropperOptions)
    });

    _this.i18nInit();

    return _this;
  }

  var _proto = ImageEditor.prototype;

  _proto.setOptions = function setOptions(newOpts) {
    _Plugin.prototype.setOptions.call(this, newOpts);

    this.i18nInit();
  };

  _proto.i18nInit = function i18nInit() {
    this.translator = new Translator([this.defaultLocale, this.uppy.locale, this.opts.locale]);
    this.i18n = this.translator.translate.bind(this.translator); // this.i18nArray = this.translator.translateArray.bind(this.translator)

    this.setPluginState(); // so that UI re-renders and we see the updated locale
  };

  _proto.canEditFile = function canEditFile(file) {
    if (!file.type || file.isRemote) {
      return false;
    }

    var fileTypeSpecific = file.type.split('/')[1];

    if (/^(jpe?g|gif|png|bmp|webp)$/.test(fileTypeSpecific)) {
      return true;
    }

    return false;
  };

  _proto.install = function install() {
    this.setPluginState({
      currentImage: null
    });
    var target = this.opts.target;

    if (target) {
      this.mount(target, this);
    }
  };

  _proto.uninstall = function uninstall() {
    this.unmount();
  };

  _proto.render = function render() {
    var _this$getPluginState2 = this.getPluginState(),
        currentImage = _this$getPluginState2.currentImage;

    if (currentImage === null || currentImage.isRemote) {
      return;
    }

    return h(Editor, {
      currentImage: currentImage,
      save: this.save,
      opts: this.opts,
      i18n: this.i18n
    });
  };

  return ImageEditor;
}(Plugin), _class.VERSION = require('../package.json').version, _temp);