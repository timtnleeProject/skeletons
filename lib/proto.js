"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; var ownKeys = Object.keys(source); if (typeof Object.getOwnPropertySymbols === 'function') { ownKeys = ownKeys.concat(Object.getOwnPropertySymbols(source).filter(function (sym) { return Object.getOwnPropertyDescriptor(source, sym).enumerable; })); } ownKeys.forEach(function (key) { _defineProperty(target, key, source[key]); }); } return target; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

function _toConsumableArray(arr) { return _arrayWithoutHoles(arr) || _iterableToArray(arr) || _nonIterableSpread(); }

function _nonIterableSpread() { throw new TypeError("Invalid attempt to spread non-iterable instance"); }

function _iterableToArray(iter) { if (Symbol.iterator in Object(iter) || Object.prototype.toString.call(iter) === "[object Arguments]") return Array.from(iter); }

function _arrayWithoutHoles(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = new Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } }

function _typeof(obj) { if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

function protoFatory(Skeletons) {
  Skeletons.prototype.validate = function (data) {
    var opt = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
    var default_opt = Object.assign({
      root: this,
      //內部使用
      isbranch: false //內部使用 驗證nested的資料，不throw也不console

    }, this["default"]);
    opt = Skeletons.setDefault(opt, default_opt);
    Object.assign(this, opt); //init setup

    this.data = data;
    this.valid = true; // this.store

    Object.defineProperty(this, 'store', {
      value: {},
      configurable: true,
      enumerable: true,
      writable: false
    });
    this.warnings = [];
    this.lookup([]);
    return this;
  };

  Skeletons.prototype.subValidate = function (data, target) {
    return this.validate(data, {
      isbranch: true,
      root: target
    });
  };

  Skeletons.prototype.lookup = function () {
    var _this = this;

    var depth = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : [];

    var _this$getDepth = this.getDepth(depth),
        schema_deep = _this$getDepth.schema_deep,
        data_deep = _this$getDepth.data_deep; //optional的schema?


    if (schema_deep instanceof Skeletons.Types) {
      var type = schema_deep;
      this[type.fname](type.opt, depth);
      return;
    } //primitive type function(String,Boolean)的schema?


    if (typeof schema_deep === 'function') {
      var expect_type = _typeof(schema_deep());

      var _data_type = _typeof(data_deep);

      if (expect_type !== _data_type) {
        var show_type = Skeletons["typeof"](data_deep);
        this.warn(depth, "expect [".concat(expect_type, "] but got [").concat(show_type, "]"), 0);
      }

      return;
    }

    var schema_type = Skeletons["typeof"](schema_deep); //array literal schema

    if (schema_type === 'array') {
      var _data_type2 = Skeletons["typeof"](data_deep);

      if (_data_type2 !== 'array') {
        this.warn(depth, "expect [array] but got [".concat(_data_type2, "]"), 0);
        return;
      }

      schema_deep.forEach(function (_s, i) {
        _this.lookup([].concat(_toConsumableArray(depth), [i]));
      });

      if (schema_deep.length < data_deep.length) {
        var i = schema_deep.length;

        while (i < data_deep.length) {
          this.warn([].concat(_toConsumableArray(depth), [i]), "index [".concat(i, "] not defined in schema"), 4);
          i++;
        }
      }

      return;
    } //not object literal schema, throw


    if (schema_type !== 'object') {
      this.warn(depth, 'is not a valid schema and will be ignored, please fixed it.', 99);
      return;
    } //is object literal schema, 驗證資料


    var data_type = Skeletons["typeof"](data_deep);

    if (data_type != 'object') {
      return this.warn(depth, "expect object, got ".concat(data_type), 1);
    }

    var data_keys = _objectSpread({}, data_deep);

    for (var k in schema_deep) {
      delete data_keys[k];
      this.lookup([].concat(_toConsumableArray(depth), [k]));
    } // undefined keys?


    if (this.rule.extraKey) return;

    for (var _k in data_keys) {
      this.warn(depth, "property '".concat(_k, "' not defined in schema"), 5);
    }
  };

  Skeletons.prototype.getDepth = function (depth) {
    var schema_deep = this.schema,
        data_deep = this.data;
    depth.forEach(function (k) {
      schema_deep = schema_deep[k];
      data_deep = data_deep[k];
    });
    return {
      schema_deep: schema_deep,
      data_deep: data_deep
    };
  };

  Skeletons.prototype.warn = function (depth, log, code) {
    if (this.valid === true) this.valid = false;
    var type = '';
    var source = code >= 10 ? this.schemaName : this.dataName; //code >= 10 is schema error

    switch (code) {
      case 0:
        type = '[Unexpected Type]';
        break;

      case 2:
        type = '[Value invalid]';
        break;

      case 4:
        type = '[Unknown index]';
        break;

      case 5:
        type = '[Unknown Property]';
        break;

      case 6:
        type = '[keyValidator failed]';
        break;

      case 7:
        type = '[Types Not Matched]';
        break;

      case 8:
        type = '[Class Not Matched]';
        break;

      case 99:
        type = '[Wrong Schema]';
        break;
    }

    var keystr = Skeletons.getKeyStr(depth); //keystr only

    var output = "Skeletons Warn: ".concat(type, " at ").concat(source).concat(keystr, ": ").concat(log);
    this.warnings.push(new Skeletons.Warnings({
      code: code,
      log: log,
      type: type,
      depth: depth
    }));
    if (this.isbranch) return;
    if (this["throw"] || code >= 10) throw output;
    if (this.console) return console.log(output);
  };

  Skeletons.prototype.useOriginWarn = function (_ref) {
    var _this2 = this;

    var warnings = _ref.warnings,
        originDepth = _ref.originDepth,
        schemaName = _ref.schemaName;
    //useOriginWarn的schemaName需要自己組，因為schema結構和Data不同 (會用Skeletons static function)
    warnings.forEach(function (warn) {
      var origin_name = _this2.schemaName;
      _this2.schemaName = "".concat(origin_name, ": ").concat(schemaName);
      var concat_depth = warn.code > 10 ? [] : [].concat(_toConsumableArray(originDepth), _toConsumableArray(warn.depth));
      if (warn.code > 10) _this2.isbranch = false; // schema錯誤: 直接用throw

      _this2.warn(concat_depth, warn.log, warn.code);

      _this2.schemaName = origin_name;
    });
  };
}

var _default = protoFatory;
exports["default"] = _default;
module.exports = exports.default;
module.exports.default = exports.default;