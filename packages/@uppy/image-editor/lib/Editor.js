var _temp;

function _inheritsLoose(subClass, superClass) { subClass.prototype = Object.create(superClass.prototype); subClass.prototype.constructor = subClass; subClass.__proto__ = superClass; }

var Cropper = require('cropperjs');

var _require = require('preact'),
    h = _require.h,
    Component = _require.Component;

module.exports = (_temp = /*#__PURE__*/function (_Component) {
  _inheritsLoose(Editor, _Component);

  function Editor() {
    var _this;

    for (var _len = arguments.length, args = new Array(_len), _key = 0; _key < _len; _key++) {
      args[_key] = arguments[_key];
    }

    _this = _Component.call.apply(_Component, [this].concat(args)) || this;

    _this.save = function () {
      _this.cropper.getCroppedCanvas().toBlob(function (blob) {
        return _this.props.save(blob);
      }, _this.props.currentImage.type, _this.props.opts.quality);
    };

    return _this;
  }

  var _proto = Editor.prototype;

  _proto.componentDidMount = function componentDidMount() {
    this.cropper = new Cropper(this.imgElement, this.props.opts.cropperOptions);
  };

  _proto.componentWillUnmount = function componentWillUnmount() {
    this.cropper.destroy();
  };

  _proto.renderRevert = function renderRevert() {
    var _this2 = this;

    return h("button", {
      type: "button",
      class: "uppy-u-reset uppy-c-btn",
      "aria-label": this.props.i18n('revert'),
      "data-microtip-position": "top",
      role: "tooltip",
      onClick: function onClick() {
        _this2.cropper.reset();

        _this2.cropper.setAspectRatio(0);
      }
    }, h("svg", {
      "aria-hidden": "true",
      class: "uppy-c-icon",
      width: "24",
      height: "24",
      viewBox: "0 0 24 24"
    }, h("path", {
      d: "M0 0h24v24H0z",
      fill: "none"
    }), h("path", {
      d: "M13 3c-4.97 0-9 4.03-9 9H1l3.89 3.89.07.14L9 12H6c0-3.87 3.13-7 7-7s7 3.13 7 7-3.13 7-7 7c-1.93 0-3.68-.79-4.94-2.06l-1.42 1.42C8.27 19.99 10.51 21 13 21c4.97 0 9-4.03 9-9s-4.03-9-9-9zm-1 5v5l4.28 2.54.72-1.21-3.5-2.08V8H12z"
    })));
  };

  _proto.renderRotate = function renderRotate() {
    var _this3 = this;

    return h("button", {
      type: "button",
      class: "uppy-u-reset uppy-c-btn",
      onClick: function onClick() {
        return _this3.cropper.rotate(90);
      },
      "aria-label": this.props.i18n('rotate'),
      "data-microtip-position": "top",
      role: "tooltip"
    }, h("svg", {
      "aria-hidden": "true",
      class: "uppy-c-icon",
      width: "24",
      height: "24",
      viewBox: "0 0 24 24"
    }, h("path", {
      d: "M0 0h24v24H0V0zm0 0h24v24H0V0z",
      fill: "none"
    }), h("path", {
      d: "M7.47 21.49C4.2 19.93 1.86 16.76 1.5 13H0c.51 6.16 5.66 11 11.95 11 .23 0 .44-.02.66-.03L8.8 20.15l-1.33 1.34zM12.05 0c-.23 0-.44.02-.66.04l3.81 3.81 1.33-1.33C19.8 4.07 22.14 7.24 22.5 11H24c-.51-6.16-5.66-11-11.95-11zM16 14h2V8c0-1.11-.9-2-2-2h-6v2h6v6zm-8 2V4H6v2H4v2h2v8c0 1.1.89 2 2 2h8v2h2v-2h2v-2H8z"
    })));
  };

  _proto.renderFlip = function renderFlip() {
    var _this4 = this;

    return h("button", {
      type: "button",
      class: "uppy-u-reset uppy-c-btn",
      "aria-label": this.props.i18n('flipHorizontal'),
      "data-microtip-position": "top",
      role: "tooltip",
      onClick: function onClick() {
        return _this4.cropper.scaleX(-_this4.cropper.getData().scaleX || -1);
      }
    }, h("svg", {
      "aria-hidden": "true",
      class: "uppy-c-icon",
      width: "24",
      height: "24",
      viewBox: "0 0 24 24"
    }, h("path", {
      d: "M0 0h24v24H0z",
      fill: "none"
    }), h("path", {
      d: "M15 21h2v-2h-2v2zm4-12h2V7h-2v2zM3 5v14c0 1.1.9 2 2 2h4v-2H5V5h4V3H5c-1.1 0-2 .9-2 2zm16-2v2h2c0-1.1-.9-2-2-2zm-8 20h2V1h-2v22zm8-6h2v-2h-2v2zM15 5h2V3h-2v2zm4 8h2v-2h-2v2zm0 8c1.1 0 2-.9 2-2h-2v2z"
    })));
  };

  _proto.renderZoomIn = function renderZoomIn() {
    var _this5 = this;

    return h("button", {
      type: "button",
      class: "uppy-u-reset uppy-c-btn",
      "aria-label": this.props.i18n('zoomIn'),
      "data-microtip-position": "top",
      role: "tooltip",
      onClick: function onClick() {
        return _this5.cropper.zoom(0.1);
      }
    }, h("svg", {
      "aria-hidden": "true",
      class: "uppy-c-icon",
      height: "24",
      viewBox: "0 0 24 24",
      width: "24"
    }, h("path", {
      d: "M0 0h24v24H0V0z",
      fill: "none"
    }), h("path", {
      d: "M15.5 14h-.79l-.28-.27C15.41 12.59 16 11.11 16 9.5 16 5.91 13.09 3 9.5 3S3 5.91 3 9.5 5.91 16 9.5 16c1.61 0 3.09-.59 4.23-1.57l.27.28v.79l5 4.99L20.49 19l-4.99-5zm-6 0C7.01 14 5 11.99 5 9.5S7.01 5 9.5 5 14 7.01 14 9.5 11.99 14 9.5 14z"
    }), h("path", {
      d: "M12 10h-2v2H9v-2H7V9h2V7h1v2h2v1z"
    })));
  };

  _proto.renderZoomOut = function renderZoomOut() {
    var _this6 = this;

    return h("button", {
      type: "button",
      class: "uppy-u-reset uppy-c-btn",
      "aria-label": this.props.i18n('zoomOut'),
      "data-microtip-position": "top",
      role: "tooltip",
      onClick: function onClick() {
        return _this6.cropper.zoom(-0.1);
      }
    }, h("svg", {
      "aria-hidden": "true",
      class: "uppy-c-icon",
      width: "24",
      height: "24",
      viewBox: "0 0 24 24"
    }, h("path", {
      d: "M0 0h24v24H0V0z",
      fill: "none"
    }), h("path", {
      d: "M15.5 14h-.79l-.28-.27C15.41 12.59 16 11.11 16 9.5 16 5.91 13.09 3 9.5 3S3 5.91 3 9.5 5.91 16 9.5 16c1.61 0 3.09-.59 4.23-1.57l.27.28v.79l5 4.99L20.49 19l-4.99-5zm-6 0C7.01 14 5 11.99 5 9.5S7.01 5 9.5 5 14 7.01 14 9.5 11.99 14 9.5 14zM7 9h5v1H7z"
    })));
  };

  _proto.renderCropSquare = function renderCropSquare() {
    var _this7 = this;

    return h("button", {
      type: "button",
      class: "uppy-u-reset uppy-c-btn",
      "aria-label": this.props.i18n('aspectRatioSquare'),
      "data-microtip-position": "top",
      role: "tooltip",
      onClick: function onClick() {
        return _this7.cropper.setAspectRatio(1);
      }
    }, h("svg", {
      "aria-hidden": "true",
      class: "uppy-c-icon",
      width: "24",
      height: "24",
      viewBox: "0 0 24 24"
    }, h("path", {
      d: "M0 0h24v24H0z",
      fill: "none"
    }), h("path", {
      d: "M19 5v14H5V5h14m0-2H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2z"
    })));
  };

  _proto.renderCropWidescreen = function renderCropWidescreen() {
    var _this8 = this;

    return h("button", {
      type: "button",
      class: "uppy-u-reset uppy-c-btn",
      "aria-label": this.props.i18n('aspectRatioLandscape'),
      "data-microtip-position": "top",
      role: "tooltip",
      onClick: function onClick() {
        return _this8.cropper.setAspectRatio(16 / 9);
      }
    }, h("svg", {
      "aria-hidden": "true",
      class: "uppy-c-icon",
      width: "24",
      height: "24",
      viewBox: "0 0 24 24"
    }, h("path", {
      d: "M 19,4.9999992 V 17.000001 H 4.9999998 V 6.9999992 H 19 m 0,-2 H 4.9999998 c -1.0999999,0 -1.9999999,0.9000001 -1.9999999,2 V 17.000001 c 0,1.1 0.9,2 1.9999999,2 H 19 c 1.1,0 2,-0.9 2,-2 V 6.9999992 c 0,-1.0999999 -0.9,-2 -2,-2 z"
    }), h("path", {
      fill: "none",
      d: "M0 0h24v24H0z"
    })));
  };

  _proto.renderCropWidescreenVertical = function renderCropWidescreenVertical() {
    var _this9 = this;

    return h("button", {
      type: "button",
      class: "uppy-u-reset uppy-c-btn",
      "aria-label": this.props.i18n('aspectRatioPortrait'),
      "data-microtip-position": "top",
      role: "tooltip",
      onClick: function onClick() {
        return _this9.cropper.setAspectRatio(9 / 16);
      }
    }, h("svg", {
      "aria-hidden": "true",
      class: "uppy-c-icon",
      width: "24",
      height: "24",
      viewBox: "0 0 24 24"
    }, h("path", {
      d: "M 19.000001,19 H 6.999999 V 5 h 10.000002 v 14 m 2,0 V 5 c 0,-1.0999999 -0.9,-1.9999999 -2,-1.9999999 H 6.999999 c -1.1,0 -2,0.9 -2,1.9999999 v 14 c 0,1.1 0.9,2 2,2 h 10.000002 c 1.1,0 2,-0.9 2,-2 z"
    }), h("path", {
      d: "M0 0h24v24H0z",
      fill: "none"
    })));
  };

  _proto.render = function render() {
    var _this10 = this;

    var _this$props = this.props,
        currentImage = _this$props.currentImage,
        i18n = _this$props.i18n,
        opts = _this$props.opts;
    var actions = opts.actions; // eslint-disable-next-line compat/compat

    var imageURL = URL.createObjectURL(currentImage.data);
    return h("div", {
      class: "uppy-ImageCropper"
    }, h("div", {
      class: "uppy-ImageCropper-container"
    }, h("img", {
      class: "uppy-ImageCropper-image",
      alt: currentImage.name,
      src: imageURL,
      ref: function ref(_ref) {
        _this10.imgElement = _ref;
      }
    })), h("div", {
      class: "uppy-ImageCropper-controls"
    }, h("button", {
      type: "button",
      class: "uppy-u-reset uppy-c-btn",
      "aria-label": i18n('save'),
      "data-microtip-position": "top",
      role: "tooltip",
      onClick: function onClick() {
        return _this10.save();
      }
    }, h("svg", {
      "aria-hidden": "true",
      class: "uppy-c-icon",
      width: "24",
      height: "24",
      viewBox: "0 0 24 24"
    }, h("path", {
      d: "M0 0h24v24H0z",
      fill: "none"
    }), h("path", {
      d: "M9 16.2L4.8 12l-1.4 1.4L9 19 21 7l-1.4-1.4L9 16.2z"
    }))), actions.revert && this.renderRevert(), actions.rotate && this.renderRotate(), actions.flip && this.renderFlip(), actions.zoomIn && this.renderZoomIn(), actions.zoomOut && this.renderZoomOut(), actions.cropSquare && this.renderCropSquare(), actions.cropWidescreen && this.renderCropWidescreen(), actions.cropWidescreenVertical && this.renderCropWidescreenVertical()));
  };

  return Editor;
}(Component), _temp);