var _class, _temp;

function _extends() { _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; }; return _extends.apply(this, arguments); }

function _assertThisInitialized(self) { if (self === void 0) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return self; }

function _inheritsLoose(subClass, superClass) { subClass.prototype = Object.create(superClass.prototype); subClass.prototype.constructor = subClass; subClass.__proto__ = superClass; }

var _require = require('@uppy/core'),
    Plugin = _require.Plugin;

var findDOMElement = require('@uppy/utils/lib/findDOMElement');

var toArray = require('@uppy/utils/lib/toArray'); // Rollup uses get-form-data's ES modules build, and rollup-plugin-commonjs automatically resolves `.default`.
// So, if we are being built using rollup, this require() won't have a `.default` property.


var getFormData = require('get-form-data').default || require('get-form-data');
/**
 * Form
 */


module.exports = (_temp = _class = /*#__PURE__*/function (_Plugin) {
  _inheritsLoose(Form, _Plugin);

  function Form(uppy, opts) {
    var _this;

    _this = _Plugin.call(this, uppy, opts) || this;
    _this.type = 'acquirer';
    _this.id = _this.opts.id || 'Form';
    _this.title = 'Form'; // set default options

    var defaultOptions = {
      target: null,
      resultName: 'uppyResult',
      getMetaFromForm: true,
      addResultToForm: true,
      multipleResults: false,
      submitOnSuccess: false,
      triggerUploadOnSubmit: false
    }; // merge default options with the ones set by user

    _this.opts = _extends({}, defaultOptions, opts);
    _this.handleFormSubmit = _this.handleFormSubmit.bind(_assertThisInitialized(_this));
    _this.handleUploadStart = _this.handleUploadStart.bind(_assertThisInitialized(_this));
    _this.handleSuccess = _this.handleSuccess.bind(_assertThisInitialized(_this));
    _this.addResultToForm = _this.addResultToForm.bind(_assertThisInitialized(_this));
    _this.getMetaFromForm = _this.getMetaFromForm.bind(_assertThisInitialized(_this));
    return _this;
  }

  var _proto = Form.prototype;

  _proto.handleUploadStart = function handleUploadStart() {
    if (this.opts.getMetaFromForm) {
      this.getMetaFromForm();
    }
  };

  _proto.handleSuccess = function handleSuccess(result) {
    if (this.opts.addResultToForm) {
      this.addResultToForm(result);
    }

    if (this.opts.submitOnSuccess) {
      this.form.submit();
    }
  };

  _proto.handleFormSubmit = function handleFormSubmit(ev) {
    var _this2 = this;

    if (this.opts.triggerUploadOnSubmit) {
      ev.preventDefault();
      var elements = toArray(ev.target.elements);
      var disabledByUppy = [];
      elements.forEach(function (el) {
        var isButton = el.tagName === 'BUTTON' || el.tagName === 'INPUT' && el.type === 'submit';

        if (isButton && !el.disabled) {
          el.disabled = true;
          disabledByUppy.push(el);
        }
      });
      this.uppy.upload().then(function () {
        disabledByUppy.forEach(function (button) {
          button.disabled = false;
        });
      }, function (err) {
        disabledByUppy.forEach(function (button) {
          button.disabled = false;
        });
        return Promise.reject(err);
      }).catch(function (err) {
        _this2.uppy.log(err.stack || err.message || err);
      });
    }
  };

  _proto.addResultToForm = function addResultToForm(result) {
    this.uppy.log('[Form] Adding result to the original form:');
    this.uppy.log(result);
    var resultInput = this.form.querySelector("[name=\"" + this.opts.resultName + "\"]");

    if (resultInput) {
      if (this.opts.multipleResults) {
        // Append new result to the previous result array.
        // If the previous result is empty, or not an array,
        // set it to an empty array.
        var updatedResult;

        try {
          updatedResult = JSON.parse(resultInput.value);
        } catch (err) {// Nothing, since we check for array below anyway
        }

        if (!Array.isArray(updatedResult)) {
          updatedResult = [];
        }

        updatedResult.push(result);
        resultInput.value = JSON.stringify(updatedResult);
      } else {
        // Replace existing result with the newer result on `complete` event.
        // This behavior is not ideal, since you most likely want to always keep
        // all results in the input. This is kept for backwards compatability until 2.0.
        resultInput.value = JSON.stringify(result);
      }

      return;
    }

    resultInput = document.createElement('input');
    resultInput.name = this.opts.resultName;
    resultInput.type = 'hidden';

    if (this.opts.multipleResults) {
      // Wrap result in an array so we can have multiple results
      resultInput.value = JSON.stringify([result]);
    } else {
      // Result is an object, kept for backwards compatability until 2.0
      resultInput.value = JSON.stringify(result);
    }

    this.form.appendChild(resultInput);
  };

  _proto.getMetaFromForm = function getMetaFromForm() {
    var formMeta = getFormData(this.form); // We want to exclude meta the the Form plugin itself has added
    // See https://github.com/transloadit/uppy/issues/1637

    delete formMeta[this.opts.resultName];
    this.uppy.setMeta(formMeta);
  };

  _proto.install = function install() {
    this.form = findDOMElement(this.opts.target);

    if (!this.form || this.form.nodeName !== 'FORM') {
      this.uppy.log('Form plugin requires a <form> target element passed in options to operate, none was found', 'error');
      return;
    }

    this.form.addEventListener('submit', this.handleFormSubmit);
    this.uppy.on('upload', this.handleUploadStart);
    this.uppy.on('complete', this.handleSuccess);
  };

  _proto.uninstall = function uninstall() {
    this.form.removeEventListener('submit', this.handleFormSubmit);
    this.uppy.off('upload', this.handleUploadStart);
    this.uppy.off('complete', this.handleSuccess);
  };

  return Form;
}(Plugin), _class.VERSION = require('../package.json').version, _temp);