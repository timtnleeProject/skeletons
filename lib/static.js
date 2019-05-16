"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

function _typeof(obj) { if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

function staticFactory(Skeletons) {
  Skeletons._version_ = '0.1.0';

  Skeletons.String = function (opt) {
    var extend_opt = {};
    return new Skeletons.Types(opt, 'StringFn', extend_opt);
  };

  Skeletons.Array = function (opt) {
    var extend_opt = {
      item: null,
      array: undefined
    };
    return new Skeletons.Types(opt, 'ArrayFn', extend_opt);
  };

  Skeletons.Boolean = function (opt) {
    var extend_opt = {};
    return new Skeletons.Types(opt, 'BooleanFn', extend_opt);
  };

  Skeletons.Number = function (opt) {
    var extend_opt = {
      allowNaN: true
    };
    return new Skeletons.Types(opt, 'NumberFn', extend_opt);
  };

  Skeletons.Object = function (opt) {
    var extend_opt = {
      "class": null,
      extraKey: false,
      object: {}
    };
    return new Skeletons.Types(opt, 'ObjectFn', extend_opt);
  };

  Skeletons.MapObject = function (opt) {
    var extend_opt = {
      keyValidator: null,
      item: null
    };
    return new Skeletons.Types(opt, 'MapObjectFn', extend_opt);
  };

  Skeletons.Function = function (opt) {
    var extend_opt = {};
    return new Skeletons.Types(opt, 'FunctionFn', extend_opt);
  };

  Skeletons.Symbol = function (opt) {
    var extend_opt = {};
    return new Skeletons.Types(opt, 'SymbolFn', extend_opt);
  };

  Skeletons.Null = function (opt) {
    return new Skeletons.Types(opt, 'NullFn', {});
  };

  Skeletons.Any = function (opt) {
    var extend_opt = {
      exclude: null,
      include: null
    };
    return new Skeletons.Types(opt, 'AnyFn', extend_opt);
  };

  Skeletons.Types = function () {
    var opt = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
    var fname = arguments.length > 1 ? arguments[1] : undefined;
    var more_opt = arguments.length > 2 ? arguments[2] : undefined;
    var glob_opt = {
      required: true,
      "default": undefined,
      validator: null
    };
    var default_opt = Object.assign(glob_opt, more_opt);
    this.opt = Skeletons.setDefault(opt, default_opt);
    this.fname = fname;
  };

  Skeletons.Warnings = function (opt) {
    var options = new Skeletons({
      code: Number,
      log: String,
      type: String,
      depth: Skeletons.Array()
    });
    options.validate(opt, {
      "throw": true //避免maximum call stack

    });

    for (var k in opt) {
      this[k] = opt[k];
    }
  };

  Skeletons["typeof"] = function (data) {
    return data === null ? 'null' : Array.isArray(data) ? 'array' : _typeof(data);
  };

  Skeletons.getKeyStr = function (depth) {
    var keystr = '';
    depth.forEach(function (k) {
      var kstr = typeof k === 'string' ? "'".concat(k, "'") : k;
      keystr += "[".concat(kstr, "]");
    });
    return keystr ? keystr : ' ';
  };

  Skeletons.setDefault = function (opt, default_opt) {
    if (!opt) return default_opt;
    if (Skeletons["typeof"](opt) !== 'object') throw 'Skeletons.setDefault(data, options), options must be object'; //options

    for (var k in default_opt) {
      if (opt[k] === undefined) opt[k] = default_opt[k];
    }

    return opt;
  };

  Skeletons.expectType = function (schema) {
    if (schema instanceof Skeletons.Types) {
      return schema.name.toLowerCase();
    } //primitive type function(String,Boolean)的schema?


    if (typeof schema === 'function') {
      return Skeletons["typeof"](schema());
    }

    return Skeletons["typeof"](schema);
  };
}

var _default = staticFactory;
exports["default"] = _default;
module.exports = exports.default;