"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = _default;

function _typeof(obj) { if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

function _toConsumableArray(arr) { return _arrayWithoutHoles(arr) || _iterableToArray(arr) || _nonIterableSpread(); }

function _nonIterableSpread() { throw new TypeError("Invalid attempt to spread non-iterable instance"); }

function _iterableToArray(iter) { if (Symbol.iterator in Object(iter) || Object.prototype.toString.call(iter) === "[object Arguments]") return Array.from(iter); }

function _arrayWithoutHoles(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = new Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } }

function _default(Skeletons) {
  Skeletons.prototype.SOP = function (opt, depth, name, filter) {
    var _this$getDepth = this.getDepth(depth),
        data_deep = _this$getDepth.data_deep;

    if (opt.required === false && data_deep === undefined) return; //undefined, but not required

    if (opt["default"] !== undefined && data_deep === opt["default"]) return; // strictEqual to default value

    if (!filter(data_deep)) {
      // wrong type
      var data_type = Skeletons["typeof"](data_deep);
      this.warn(depth, "expect [".concat(name, "] but got [").concat(data_type, "]"), 0);
      return;
    }

    if (opt.validator) {
      if (typeof opt.validator !== 'function') return this.warn(depth, 'options.validator must be a function', 99);
      if (opt.validator(data_deep, this.root.data, this.root.store) !== true) return this.warn(depth, 'validation failed', 2);
    }

    return 200; //keep check extra options
  };

  Skeletons.prototype.ArrayFn = function (opt, depth) {
    var _this = this;

    var status = this.SOP(opt, depth, 'array', function (val) {
      return Array.isArray(val);
    });
    if (status != 200) return;

    var _this$getDepth2 = this.getDepth(depth),
        data_deep = _this$getDepth2.data_deep;

    if (opt.item) {
      var item_schema = new Skeletons(opt.item);
      data_deep.forEach(function (d, i) {
        item_schema.subValidate(d, _this.root);
        if (!item_schema.valid) _this.useOriginWarn({
          warnings: item_schema.warnings,
          originDepth: [].concat(_toConsumableArray(depth), [i]),
          schemaName: 'Skeletons.Array({ item }) options.item'
        });
      });
    }

    if (opt.array !== undefined) {
      var ary_schema = opt.array;
      if (Skeletons["typeof"](ary_schema) !== 'array') return this.warn(depth, 'Skeletons.Array({ array }) options.array must be an array iteral schema []', 99);
      var rule = new Skeletons(ary_schema);
      rule.subValidate(data_deep, this.root);
      if (!rule.valid) this.useOriginWarn({
        warnings: rule.warnings,
        originDepth: _toConsumableArray(depth),
        schemaName: 'Skeletons.Array({ array }) options.array'
      });
    }
  };

  Skeletons.prototype.ObjectFn = function (opt, depth) {
    var status = this.SOP(opt, depth, 'object', function (val) {
      return Skeletons["typeof"](val) === 'object';
    });
    if (status != 200) return;

    var _this$getDepth3 = this.getDepth(depth),
        data_deep = _this$getDepth3.data_deep;

    if (opt["class"]) {
      if (typeof opt["class"] !== 'function') return this.warn(depth, 'Skeletons.Object({ class }) options.class is not a function/class', 99);
      if (!(data_deep instanceof opt["class"])) this.warn(depth, "object expect instanceof [".concat(opt["class"].name, "] but got instanceof [").concat(Object.getPrototypeOf(data_deep).constructor.name, "]"), 8);
    }

    if (opt.object) {
      if (Skeletons["typeof"](opt.object) !== 'object') return this.warn(depth, 'Skeletons.Object({ object }) options.object must be an object {}', 99);
      if (opt.object instanceof Skeletons.Types) return this.warn(depth, 'Skeletons.Object({ object }) options.object can only use literal object schema {}', 99);
      var schema = new Skeletons(opt.object, {
        rule: {
          extraKey: opt.extraKey
        }
      });
      schema.subValidate(data_deep, this.root);

      if (!schema.valid) {
        this.useOriginWarn({
          warnings: schema.warnings,
          originDepth: depth,
          schemaName: 'Skeletons.Object({ object }) options.object'
        });
      }
    }
  };

  Skeletons.prototype.MapObjectFn = function (opt, depth) {
    var _this2 = this;

    var status = this.SOP(opt, depth, 'object', function (val) {
      return Skeletons["typeof"](val) === 'object';
    });
    if (status != 200) return;

    var _this$getDepth4 = this.getDepth(depth),
        data_deep = _this$getDepth4.data_deep;

    var exist = {
      keyValidator: false,
      validateItem: false
    };

    var keyValidator = function keyValidator(k) {
      if (!exist.keyValidator) return;
      if (opt.keyValidator(k, _this2.root.data, _this2.root.store) !== true) _this2.warn(depth, "keyValidator failed at key ".concat(k), 6);
    };

    var validateItem = function validateItem(k, data_deep, schema) {
      if (!exist.validateItem) return;
      schema.subValidate(data_deep[k], _this2.root);

      if (!schema.valid) {
        _this2.useOriginWarn({
          warnings: schema.warnings,
          originDepth: [].concat(_toConsumableArray(depth), [k]),
          schemaName: 'Skeletons.MapObject({ item }) options.item'
        });
      }
    };

    if (opt.keyValidator) {
      if (typeof opt.keyValidator !== 'function') return this.warn(depth, 'Skeletons.MapObject({ keyValidator }) options.keyValidator must be function', 99);
      exist.keyValidator = true;
    }

    if (opt.item) {
      exist.validateItem = true;
    }

    if (!exist.validateItem && !exist.keyValidator) return;
    var schema = new Skeletons(opt.item);

    for (var k in data_deep) {
      keyValidator(k);
      validateItem(k, data_deep, schema);
    }
  };

  Skeletons.prototype.FunctionFn = function (opt, depth) {
    this.SOP(opt, depth, 'function', function (val) {
      return Skeletons["typeof"](val) === 'function';
    });
  };

  Skeletons.prototype.NullFn = function (opt, depth) {
    this.SOP(opt, depth, 'null', function (val) {
      return Skeletons["typeof"](val) === 'null';
    });
  };

  Skeletons.prototype.StringFn = function (opt, depth) {
    var status = this.SOP(opt, depth, 'string', function (val) {
      return typeof val === 'string';
    });

    if (status === 200 && opt.match !== undefined) {
      if (!(opt.match instanceof RegExp)) return this.warn(depth, 'options.match must be a RegExp', 99);

      var _this$getDepth5 = this.getDepth(depth),
          data_deep = _this$getDepth5.data_deep;

      if (!data_deep.match(opt.match)) this.warn(depth, 'Skeletons.String({ match }), value do not matches', 2);
    }
  };

  Skeletons.prototype.NumberFn = function (opt, depth) {
    var status = this.SOP(opt, depth, 'number', function (val) {
      return typeof val === 'number';
    });
    if (status != 200) return;

    var _this$getDepth6 = this.getDepth(depth),
        data_deep = _this$getDepth6.data_deep;

    if (opt.allowNaN === false && isNaN(data_deep)) this.warn(depth, 'Skeletons.Number({ allowNaN:false }), NaN value not allowed', 0);

    if (opt.min !== undefined) {
      if (typeof opt.min !== 'number') return this.warn(depth, 'options.min must be a number', 99);
      if (data_deep < opt.min) return this.warn(depth, "Skelerons.Number({ min }), ".concat(data_deep, " is lower than ").concat(opt.min), 2);
    }

    if (opt.max !== undefined) {
      if (typeof opt.max !== 'number') return this.warn(depth, 'options.max must be a number', 99);
      if (data_deep > opt.max) return this.warn(depth, "Skelerons.Number({ max }), ".concat(data_deep, " is greater than ").concat(opt.max), 2);
    }
  };

  Skeletons.prototype.BooleanFn = function (opt, depth) {
    this.SOP(opt, depth, 'boolean', function (val) {
      return typeof val === 'boolean';
    });
  };

  Skeletons.prototype.SymbolFn = function (opt, depth) {
    this.SOP(opt, depth, 'symbol', function (val) {
      return _typeof(val) === 'symbol';
    });
  };

  Skeletons.prototype.AnyFn = function (opt, depth) {
    this.SOP(opt, depth, 'any', function () {
      return true;
    });
    if (opt.include && opt.exclude) return this.warn(depth, 'Skeletons.Any({ include, exclude }): you defined both include and exclude, which can only be one of them.', 99);

    if (opt.include) {
      if (!Array.isArray(opt.include)) return this.warn(depth, 'Skeletons.Any({ include }): include must be array', 99);

      var _this$getDepth7 = this.getDepth(depth),
          data_deep = _this$getDepth7.data_deep;

      var valid = false;

      for (var i = 0; i < opt.include.length; i++) {
        var schema = opt.include[i];
        var check = new Skeletons(schema);
        check.subValidate(data_deep, this.root);

        if (check.valid) {
          valid = true;
          break;
        }
      }

      if (!valid) this.warn(depth, 'validation fail at Skeletons.Any({ include }): ', 7);
    }

    if (opt.exclude) {
      if (!Array.isArray(opt.exclude)) return this.warn(depth, 'Skeletons.Any({ exclude }): exclude must be array', 99);

      var _this$getDepth8 = this.getDepth(depth),
          _data_deep = _this$getDepth8.data_deep;

      var _valid = true;

      for (var _i = 0; _i < opt.exclude.length; _i++) {
        var _schema = opt.exclude[_i];

        var _check = new Skeletons(_schema);

        _check.subValidate(_data_deep, this.root);

        if (_check.valid) {
          _valid = false;
          break;
        }
      }

      if (!_valid) this.warn(depth, 'validation fail at Skeletons.Any({ exclude })', 7);
    }
  };
}

module.exports = exports.default;
module.exports.default = exports.default;