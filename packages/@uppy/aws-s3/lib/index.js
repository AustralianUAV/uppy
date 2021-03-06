var _class, _temp;

function _assertThisInitialized(self) { if (self === void 0) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return self; }

function _inheritsLoose(subClass, superClass) { subClass.prototype = Object.create(superClass.prototype); subClass.prototype.constructor = subClass; subClass.__proto__ = superClass; }

function _extends() { _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; }; return _extends.apply(this, arguments); }

/**
 * This plugin is currently a A Big Hack™! The core reason for that is how this plugin
 * interacts with Uppy's current pipeline design. The pipeline can handle files in steps,
 * including preprocessing, uploading, and postprocessing steps. This plugin initially
 * was designed to do its work in a preprocessing step, and let XHRUpload deal with the
 * actual file upload as an uploading step. However, Uppy runs steps on all files at once,
 * sequentially: first, all files go through a preprocessing step, then, once they are all
 * done, they go through the uploading step.
 *
 * For S3, this causes severely broken behaviour when users upload many files. The
 * preprocessing step will request S3 upload URLs that are valid for a short time only,
 * but it has to do this for _all_ files, which can take a long time if there are hundreds
 * or even thousands of files. By the time the uploader step starts, the first URLs may
 * already have expired. If not, the uploading might take such a long time that later URLs
 * will expire before some files can be uploaded.
 *
 * The long-term solution to this problem is to change the upload pipeline so that files
 * can be sent to the next step individually. That requires a breakig change, so it is
 * planned for Uppy v2.
 *
 * In the mean time, this plugin is stuck with a hackier approach: the necessary parts
 * of the XHRUpload implementation were copied into this plugin, as the MiniXHRUpload
 * class, and this plugin calls into it immediately once it receives an upload URL.
 * This isn't as nicely modular as we'd like and requires us to maintain two copies of
 * the XHRUpload code, but at least it's not horrifically broken :)
 */
// If global `URL` constructor is available, use it
var URL_ = typeof URL === 'function' ? URL : require('url-parse');

var _require = require('@uppy/core'),
    Plugin = _require.Plugin;

var Translator = require('@uppy/utils/lib/Translator');

var RateLimitedQueue = require('@uppy/utils/lib/RateLimitedQueue');

var settle = require('@uppy/utils/lib/settle');

var hasProperty = require('@uppy/utils/lib/hasProperty');

var _require2 = require('@uppy/companion-client'),
    RequestClient = _require2.RequestClient;

var qsStringify = require('qs-stringify');

var MiniXHRUpload = require('./MiniXHRUpload');

var isXml = require('./isXml');

function resolveUrl(origin, link) {
  return origin ? new URL_(link, origin).toString() : new URL_(link).toString();
}
/**
 * Get the contents of a named tag in an XML source string.
 *
 * @param {string} source - The XML source string.
 * @param {string} tagName - The name of the tag.
 * @returns {string} The contents of the tag, or the empty string if the tag does not exist.
 */


function getXmlValue(source, tagName) {
  var start = source.indexOf("<" + tagName + ">");
  var end = source.indexOf("</" + tagName + ">", start);
  return start !== -1 && end !== -1 ? source.slice(start + tagName.length + 2, end) : '';
}

function assertServerError(res) {
  if (res && res.error) {
    var error = new Error(res.message);

    _extends(error, res.error);

    throw error;
  }

  return res;
} // warning deduplication flag: see `getResponseData()` XHRUpload option definition


var warnedSuccessActionStatus = false;
module.exports = (_temp = _class = /*#__PURE__*/function (_Plugin) {
  _inheritsLoose(AwsS3, _Plugin);

  function AwsS3(uppy, opts) {
    var _this;

    _this = _Plugin.call(this, uppy, opts) || this;
    _this.type = 'uploader';
    _this.id = _this.opts.id || 'AwsS3';
    _this.title = 'AWS S3';
    _this.defaultLocale = {
      strings: {
        timedOut: 'Upload stalled for %{seconds} seconds, aborting.'
      }
    };
    var defaultOptions = {
      timeout: 30 * 1000,
      limit: 0,
      metaFields: [],
      // have to opt in
      getUploadParameters: _this.getUploadParameters.bind(_assertThisInitialized(_this))
    };
    _this.opts = _extends({}, defaultOptions, opts);

    _this.i18nInit();

    _this.client = new RequestClient(uppy, opts);
    _this.handleUpload = _this.handleUpload.bind(_assertThisInitialized(_this));
    _this.requests = new RateLimitedQueue(_this.opts.limit);
    return _this;
  }

  var _proto = AwsS3.prototype;

  _proto.setOptions = function setOptions(newOpts) {
    _Plugin.prototype.setOptions.call(this, newOpts);

    this.i18nInit();
  };

  _proto.i18nInit = function i18nInit() {
    this.translator = new Translator([this.defaultLocale, this.uppy.locale, this.opts.locale]);
    this.i18n = this.translator.translate.bind(this.translator);
    this.setPluginState(); // so that UI re-renders and we see the updated locale
  };

  _proto.getUploadParameters = function getUploadParameters(file) {
    if (!this.opts.companionUrl) {
      throw new Error('Expected a `companionUrl` option containing a Companion address.');
    }

    var filename = file.meta.name;
    var type = file.meta.type;
    var metadata = {};
    this.opts.metaFields.forEach(function (key) {
      if (file.meta[key] != null) {
        metadata[key] = file.meta[key].toString();
      }
    });
    var query = qsStringify({
      filename: filename,
      type: type,
      metadata: metadata
    });
    return this.client.get("s3/params?" + query).then(assertServerError);
  };

  _proto.validateParameters = function validateParameters(file, params) {
    var valid = typeof params === 'object' && params && typeof params.url === 'string' && (typeof params.fields === 'object' || params.fields == null);

    if (!valid) {
      var err = new TypeError("AwsS3: got incorrect result from 'getUploadParameters()' for file '" + file.name + "', expected an object '{ url, method, fields, headers }' but got '" + JSON.stringify(params) + "' instead.\nSee https://uppy.io/docs/aws-s3/#getUploadParameters-file for more on the expected format.");
      console.error(err);
      throw err;
    }

    var methodIsValid = params.method == null || /^(put|post)$/i.test(params.method);

    if (!methodIsValid) {
      var _err = new TypeError("AwsS3: got incorrect method from 'getUploadParameters()' for file '" + file.name + "', expected  'put' or 'post' but got '" + params.method + "' instead.\nSee https://uppy.io/docs/aws-s3/#getUploadParameters-file for more on the expected format.");

      console.error(_err);
      throw _err;
    }
  };

  _proto.handleUpload = function handleUpload(fileIDs) {
    var _this2 = this;

    /**
     * keep track of `getUploadParameters()` responses
     * so we can cancel the calls individually using just a file ID
     *
     * @type {object.<string, Promise>}
     */
    var paramsPromises = Object.create(null);

    function onremove(file) {
      var id = file.id;

      if (hasProperty(paramsPromises, id)) {
        paramsPromises[id].abort();
      }
    }

    this.uppy.on('file-removed', onremove);
    fileIDs.forEach(function (id) {
      var file = _this2.uppy.getFile(id);

      _this2.uppy.emit('upload-started', file);
    });
    var getUploadParameters = this.requests.wrapPromiseFunction(function (file) {
      return _this2.opts.getUploadParameters(file);
    });
    var numberOfFiles = fileIDs.length;
    return settle(fileIDs.map(function (id, index) {
      paramsPromises[id] = getUploadParameters(_this2.uppy.getFile(id));
      return paramsPromises[id].then(function (params) {
        delete paramsPromises[id];

        var file = _this2.uppy.getFile(id);

        _this2.validateParameters(file, params);

        var _params$method = params.method,
            method = _params$method === void 0 ? 'post' : _params$method,
            url = params.url,
            fields = params.fields,
            headers = params.headers;
        var xhrOpts = {
          method: method,
          formData: method.toLowerCase() === 'post',
          endpoint: url,
          metaFields: fields ? Object.keys(fields) : []
        };

        if (headers) {
          xhrOpts.headers = headers;
        }

        _this2.uppy.setFileState(file.id, {
          meta: _extends({}, file.meta, fields),
          xhrUpload: xhrOpts
        });

        return _this2._uploader.uploadFile(file.id, index, numberOfFiles);
      }).catch(function (error) {
        delete paramsPromises[id];

        var file = _this2.uppy.getFile(id);

        _this2.uppy.emit('upload-error', file, error);
      });
    })).then(function (settled) {
      // cleanup.
      _this2.uppy.off('file-removed', onremove);

      return settled;
    });
  };

  _proto.install = function install() {
    var uppy = this.uppy;
    this.uppy.addUploader(this.handleUpload); // Get the response data from a successful XMLHttpRequest instance.
    // `content` is the S3 response as a string.
    // `xhr` is the XMLHttpRequest instance.

    function defaultGetResponseData(content, xhr) {
      var opts = this; // If no response, we've hopefully done a PUT request to the file
      // in the bucket on its full URL.

      if (!isXml(content, xhr)) {
        if (opts.method.toUpperCase() === 'POST') {
          if (!warnedSuccessActionStatus) {
            uppy.log('[AwsS3] No response data found, make sure to set the success_action_status AWS SDK option to 201. See https://uppy.io/docs/aws-s3/#POST-Uploads', 'warning');
            warnedSuccessActionStatus = true;
          } // The responseURL won't contain the object key. Give up.


          return {
            location: null
          };
        } // responseURL is not available in older browsers.


        if (!xhr.responseURL) {
          return {
            location: null
          };
        } // Trim the query string because it's going to be a bunch of presign
        // parameters for a PUT request—doing a GET request with those will
        // always result in an error


        return {
          location: xhr.responseURL.replace(/\?.*$/, '')
        };
      }

      return {
        // Some S3 alternatives do not reply with an absolute URL.
        // Eg DigitalOcean Spaces uses /$bucketName/xyz
        location: resolveUrl(xhr.responseURL, getXmlValue(content, 'Location')),
        bucket: getXmlValue(content, 'Bucket'),
        key: getXmlValue(content, 'Key'),
        etag: getXmlValue(content, 'ETag')
      };
    } // Get the error data from a failed XMLHttpRequest instance.
    // `content` is the S3 response as a string.
    // `xhr` is the XMLHttpRequest instance.


    function defaultGetResponseError(content, xhr) {
      // If no response, we don't have a specific error message, use the default.
      if (!isXml(content, xhr)) {
        return;
      }

      var error = getXmlValue(content, 'Message');
      return new Error(error);
    }

    var xhrOptions = {
      fieldName: 'file',
      responseUrlFieldName: 'location',
      timeout: this.opts.timeout,
      // Share the rate limiting queue with XHRUpload.
      __queue: this.requests,
      responseType: 'text',
      getResponseData: this.opts.getResponseData || defaultGetResponseData,
      getResponseError: defaultGetResponseError
    }; // Only for MiniXHRUpload, remove once we can depend on XHRUpload directly again

    xhrOptions.i18n = this.i18n; // Revert to `this.uppy.use(XHRUpload)` once the big comment block at the top of
    // this file is solved

    this._uploader = new MiniXHRUpload(this.uppy, xhrOptions);
  };

  _proto.uninstall = function uninstall() {
    this.uppy.removePreProcessor(this.handleUpload);
  };

  return AwsS3;
}(Plugin), _class.VERSION = require('../package.json').version, _temp);