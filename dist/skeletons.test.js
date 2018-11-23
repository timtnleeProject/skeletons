(function(e, a) { for(var i in a) e[i] = a[i]; }(exports, /******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId]) {
/******/ 			return installedModules[moduleId].exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			i: moduleId,
/******/ 			l: false,
/******/ 			exports: {}
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.l = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// define getter function for harmony exports
/******/ 	__webpack_require__.d = function(exports, name, getter) {
/******/ 		if(!__webpack_require__.o(exports, name)) {
/******/ 			Object.defineProperty(exports, name, { enumerable: true, get: getter });
/******/ 		}
/******/ 	};
/******/
/******/ 	// define __esModule on exports
/******/ 	__webpack_require__.r = function(exports) {
/******/ 		if(typeof Symbol !== 'undefined' && Symbol.toStringTag) {
/******/ 			Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });
/******/ 		}
/******/ 		Object.defineProperty(exports, '__esModule', { value: true });
/******/ 	};
/******/
/******/ 	// create a fake namespace object
/******/ 	// mode & 1: value is a module id, require it
/******/ 	// mode & 2: merge all properties of value into the ns
/******/ 	// mode & 4: return value when already ns object
/******/ 	// mode & 8|1: behave like require
/******/ 	__webpack_require__.t = function(value, mode) {
/******/ 		if(mode & 1) value = __webpack_require__(value);
/******/ 		if(mode & 8) return value;
/******/ 		if((mode & 4) && typeof value === 'object' && value && value.__esModule) return value;
/******/ 		var ns = Object.create(null);
/******/ 		__webpack_require__.r(ns);
/******/ 		Object.defineProperty(ns, 'default', { enumerable: true, value: value });
/******/ 		if(mode & 2 && typeof value != 'string') for(var key in value) __webpack_require__.d(ns, key, function(key) { return value[key]; }.bind(null, key));
/******/ 		return ns;
/******/ 	};
/******/
/******/ 	// getDefaultExport function for compatibility with non-harmony modules
/******/ 	__webpack_require__.n = function(module) {
/******/ 		var getter = module && module.__esModule ?
/******/ 			function getDefault() { return module['default']; } :
/******/ 			function getModuleExports() { return module; };
/******/ 		__webpack_require__.d(getter, 'a', getter);
/******/ 		return getter;
/******/ 	};
/******/
/******/ 	// Object.prototype.hasOwnProperty.call
/******/ 	__webpack_require__.o = function(object, property) { return Object.prototype.hasOwnProperty.call(object, property); };
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";
/******/
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(__webpack_require__.s = "./index.js");
/******/ })
/************************************************************************/
/******/ ({

/***/ "./index.js":
/*!******************!*\
  !*** ./index.js ***!
  \******************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

eval("const staticFactory = __webpack_require__(/*! ./src/static */ \"./src/static.js\")\r\nconst protoFactory = __webpack_require__(/*! ./src/proto */ \"./src/proto.js\")\r\nconst protoDataFactory = __webpack_require__(/*! ./src/proto_data */ \"./src/proto_data.js\")\r\n\r\nfunction Skeletons(schema, opt={}) {\r\n  this.schema = schema\r\n  this.default = {\r\n    dataName: 'data',\r\n    schemaName: 'schema',\r\n    console: true,\r\n    throw: false,\r\n    rule: {\r\n      extraKey: false\r\n    }\r\n  }\r\n  this.default = Skeletons.setDefault(opt, this.default)\r\n}\r\n\r\nstaticFactory(Skeletons)\r\nprotoFactory(Skeletons)\r\nprotoDataFactory(Skeletons)\r\n\r\nmodule.exports = Skeletons\n\n//# sourceURL=webpack:///./index.js?");

/***/ }),

/***/ "./src/proto.js":
/*!**********************!*\
  !*** ./src/proto.js ***!
  \**********************/
/*! no static exports found */
/***/ (function(module, exports) {

eval("function protoFatory(Skeletons) {\r\n  Skeletons.prototype.validate = function(data, opt={}) {\r\n    const default_opt = Object.assign({\r\n      root: this, //內部使用\r\n      isbranch: false, //內部使用 驗證nested的資料，不throw也不console\r\n    },this.default)\r\n    \r\n    opt = Skeletons.setDefault(opt, default_opt)\r\n    \r\n    Object.assign(this,opt)\r\n    \r\n    //init setup\r\n    this.data = data\r\n    this.valid = true\r\n    this.warnings = []\r\n    this.lookup([])\r\n    return this\r\n  }\r\n\r\n  Skeletons.prototype.subValidate = function(data,target) {\r\n    return this.validate(data, {\r\n      isbranch: true,\r\n      root: target\r\n    })\r\n  }\r\n\r\n  Skeletons.prototype.lookup = function (depth=[]) {\r\n    let { schema_deep, data_deep } = this.getDepth(depth)\r\n    //optional的schema?\r\n    if (schema_deep instanceof Skeletons.Types) {\r\n      const type = schema_deep\r\n      this[type.fname](type.opt, depth)\r\n      return\r\n    }\r\n    //primitive type function(String,Boolean)的schema?\r\n    if (typeof schema_deep === 'function') {\r\n      const expect_type = typeof schema_deep()\r\n      const data_type = typeof data_deep\r\n      if (expect_type !== data_type) {\r\n        let show_type = Skeletons.typeof(data_deep)\r\n        this.warn(depth, `expect [${expect_type}] but got [${show_type}]`, 0)\r\n      }\r\n      return\r\n    }\r\n    const schema_type = Skeletons.typeof(schema_deep)\r\n    //array literal schema\r\n    if(schema_type==='array') {\r\n      const data_type = Skeletons.typeof(data_deep)\r\n      if(data_type!=='array') {\r\n        this.warn(depth,`expect [array] but got [${data_type}]`, 0)\r\n        return\r\n      }\r\n      schema_deep.forEach((_s,i)=>{\r\n        this.lookup([...depth,i])\r\n      })\r\n      if(schema_deep.length<data_deep.length) {\r\n        let i = schema_deep.length\r\n        while(i<data_deep.length) {\r\n          this.warn([...depth,i],`index [${i}] not defined in schema`,4)\r\n          i++\r\n        }\r\n      }\r\n      return\r\n    }\r\n    //not object literal schema, throw\r\n    if(schema_type!=='object') {\r\n      this.warn(depth,'is not a valid schema and will be ignored, please fixed it.',99) \r\n      return\r\n    }\r\n    //is object literal schema, 驗證資料\r\n    const data_type = Skeletons.typeof(data_deep)\r\n    if (data_type!='object') {\r\n      return this.warn(depth, `expect object, got ${data_type}`, 1)\r\n    }\r\n    let data_keys = {...data_deep}\r\n    for (let k in schema_deep) {\r\n      delete data_keys[k]\r\n      this.lookup([...depth, k])\r\n    }\r\n    // undefined keys?\r\n    if(this.rule.extraKey) return\r\n    for(let k in data_keys) {\r\n      this.warn(depth,`property '${k}' not defined in schema`,5)\r\n    }\r\n  }\r\n\r\n  Skeletons.prototype.getDepth = function (depth) {\r\n    let schema_deep = this.schema,\r\n      data_deep = this.data\r\n    depth.forEach(k => {\r\n      schema_deep = schema_deep[k]\r\n      data_deep = data_deep[k]\r\n    })\r\n    return { schema_deep, data_deep}\r\n  }\r\n\r\n  Skeletons.prototype.warn = function (depth, log, code) {\r\n    if (this.valid === true) this.valid = false\r\n    let type = ''\r\n    let source = (code>=10)? this.schemaName:this.dataName\r\n    //code >= 10 is schema error\r\n    switch (code) {\r\n    case 0:\r\n      type = '[Unexpected Type]'\r\n      break\r\n    case 2:\r\n      type = '[Value invalid]'\r\n      break\r\n    case 4:\r\n      type = '[Unknown index]'\r\n      break\r\n    case 5:\r\n      type = '[Unknown Property]'\r\n      break\r\n    case 6:\r\n      type = '[keyValidator failed]'\r\n      break\r\n    case 7:\r\n      type = '[Types Not Matched]'\r\n      break\r\n    case 8:\r\n      type = '[Class Not Matched]'\r\n      break\r\n    case 99:\r\n      type = '[Wrong Schema]'\r\n      break\r\n    }\r\n    const keystr = Skeletons.getKeyStr(depth) //keystr only\r\n    const output = `Skeletons Warn: ${type} at ${source}${keystr}: ${log}`\r\n    this.warnings.push(new Skeletons.Warnings({\r\n      code,\r\n      log,\r\n      type,\r\n      depth\r\n    })\r\n    )\r\n    if(this.isbranch) return\r\n\r\n    if(this.throw||(code>=10)) throw output\r\n    \r\n    if(this.console) return console.log(output)\r\n  }\r\n\r\n  Skeletons.prototype.useOriginWarn = function({ warnings,originDepth,schemaName}) { \r\n    //useOriginWarn的schemaName需要自己組，因為schema結構和Data不同 (會用Skeletons static function)\r\n    warnings.forEach(warn=>{\r\n      const origin_name = this.schemaName\r\n      this.schemaName = `${origin_name}: ${schemaName}`\r\n      let concat_depth = (warn.code>10)?[]:[...originDepth, ...warn.depth]\r\n      if(warn.code>10) this.isbranch = false// schema錯誤: 直接用throw\r\n      this.warn(concat_depth,warn.log,warn.code)\r\n      this.schemaName = origin_name\r\n    })\r\n  }\r\n}\r\n\r\n\r\nmodule.exports = protoFatory\n\n//# sourceURL=webpack:///./src/proto.js?");

/***/ }),

/***/ "./src/proto_data.js":
/*!***************************!*\
  !*** ./src/proto_data.js ***!
  \***************************/
/*! no static exports found */
/***/ (function(module, exports) {

eval("module.exports = function (Skeletons) {\r\n  Skeletons.prototype.SOP = function (opt, depth, name, filter) {\r\n    let { data_deep } = this.getDepth(depth)\r\n    if (opt.required === false && data_deep === undefined) return //undefined, but not required\r\n    if(opt.default!==undefined && data_deep === opt.default) return // strictEqual to default value\r\n    if (!filter(data_deep)) { // wrong type\r\n      const data_type = Skeletons.typeof(data_deep)\r\n      this.warn(depth, `expect [${name}] but got [${data_type}]`, 0)\r\n      return \r\n    }\r\n    if (opt.validator) {\r\n      if (typeof opt.validator !== 'function') return this.warn(depth, 'options.validator must be a function', 99)\r\n      if (opt.validator(data_deep, this.root.data)!== true) return this.warn(depth, 'validation failed', 2)\r\n    }\r\n    return 200 //keep check extra options\r\n  }\r\n  Skeletons.prototype.ArrayFn = function (opt, depth) {\r\n    const status = this.SOP(opt, depth, 'array', (val) => Array.isArray(val))\r\n    if (status != 200) return\r\n    const { data_deep } = this.getDepth(depth)\r\n    if (opt.item) {\r\n      const item_schema = new Skeletons(opt.item) \r\n      data_deep.forEach((d,i) => {\r\n        item_schema.subValidate(d,this)\r\n        if(!item_schema.valid) this.useOriginWarn({\r\n          warnings: item_schema.warnings,\r\n          originDepth: [...depth,i],\r\n          schemaName: 'Skeletons.Array({ item }) options.item'\r\n        })\r\n      })\r\n    }\r\n    if (opt.array!==undefined) {\r\n      const ary_schema = opt.array\r\n      if(Skeletons.typeof(ary_schema)!=='array') return this.warn(depth,'Skeletons.Array({ array }) options.array must be an array iteral schema []',99)\r\n      const rule = new Skeletons(ary_schema)\r\n      rule.subValidate(data_deep, this)\r\n      if(!rule.valid) this.useOriginWarn({\r\n        warnings: rule.warnings,\r\n        originDepth: [...depth],\r\n        schemaName: 'Skeletons.Array({ array }) options.array'\r\n      })\r\n    }\r\n  }\r\n  Skeletons.prototype.ObjectFn = function(opt, depth){\r\n    const status = this.SOP(opt, depth, 'object', (val)=> Skeletons.typeof(val)==='object')\r\n    if (status != 200) return\r\n    const { data_deep } = this.getDepth(depth)\r\n    if(opt.class) {\r\n      if(typeof opt.class !== 'function')  return this.warn(depth,'Skeletons.Object({ class }) options.class is not a function/class',99)\r\n      if(!(data_deep instanceof opt.class)) this.warn(depth,`object expect instanceof [${opt.class.name}] but got instanceof [${Object.getPrototypeOf(data_deep).constructor.name}]`,8)\r\n    }\r\n    if(opt.object) {\r\n      if(Skeletons.typeof(opt.object)!=='object') return this.warn(depth,'Skeletons.Object({ object }) options.object must be an object {}',99)\r\n      if(opt.object instanceof Skeletons.Types) return this.warn(depth,'Skeletons.Object({ object }) options.object can only use literal object schema {}',99)\r\n      const schema = new Skeletons(opt.object, { rule: { extraKey: opt.extraKey } })\r\n      schema.subValidate(data_deep, this)\r\n      if(!schema.valid) {\r\n        this.useOriginWarn({\r\n          warnings: schema.warnings,\r\n          originDepth: depth,\r\n          schemaName: 'Skeletons.Object({ object }) options.object'\r\n        })\r\n      }\r\n    }\r\n  }\r\n  Skeletons.prototype.MapObjectFn = function(opt, depth) {\r\n    const status = this.SOP(opt, depth, 'object', (val)=> Skeletons.typeof(val)==='object')\r\n    if (status != 200) return\r\n    const { data_deep } = this.getDepth(depth)\r\n    if(opt.keyValidator) {\r\n      if(typeof opt.keyValidator!=='function') return this.warn(depth, 'Skeletons.MapObject({ keyValidator }) options.keyValidator must be function',99)\r\n      for(let k in data_deep) {\r\n        if(opt.keyValidator(k, this.root.data)!==true) this.warn(depth,`keyValidator failed at key ${k}`,6)\r\n      }\r\n    }\r\n    if(opt.item) {\r\n      const schema = new Skeletons(opt.item)\r\n      for(let k in data_deep) {\r\n        schema.subValidate(data_deep[k],this)\r\n        if(!schema.valid) {\r\n          this.useOriginWarn({\r\n            warnings: schema.warnings,\r\n            originDepth: [...depth,k],\r\n            schemaName: 'Skeletons.MapObject({ item }) options.item'\r\n          })\r\n        }\r\n      }\r\n    }\r\n  }\r\n  Skeletons.prototype.FunctionFn = function(opt, depth) {\r\n    this.SOP(opt,depth, 'function', (val)=> Skeletons.typeof(val)==='function')\r\n  }\r\n  Skeletons.prototype.NullFn = function (opt, depth){\r\n    this.SOP(opt, depth, 'null', (val)=> Skeletons.typeof(val)==='null')\r\n  }\r\n  Skeletons.prototype.StringFn = function (opt, depth) {\r\n    this.SOP(opt, depth, 'string', (val) => typeof val === 'string')\r\n  }\r\n  Skeletons.prototype.NumberFn = function(opt, depth){\r\n    const status = this.SOP(opt, depth, 'number', (val) => typeof val === 'number')\r\n    if (status != 200) return\r\n    const { data_deep } = this.getDepth(depth)\r\n    if(opt.allowNaN===false&& isNaN(data_deep)) this.warn(depth,'Skeletons.Number({ allowNaN:false }), NaN value not allowed',0)\r\n  }\r\n  Skeletons.prototype.BooleanFn = function (opt, depth) {\r\n    this.SOP(opt, depth, 'boolean', (val) => typeof val === 'boolean')\r\n  }\r\n  Skeletons.prototype.SymbolFn = function(opt, depth) {\r\n    this.SOP(opt, depth, 'symbol', (val)=> typeof val === 'symbol')\r\n  }\r\n  Skeletons.prototype.AnyFn = function(opt, depth) {\r\n    this.SOP(opt, depth, 'any', ()=>true )\r\n    if(opt.include && opt.exclude) return this.warn(depth,'Skeletons.Any({ include, exclude }): you defined both include and exclude, which can only be one of them.',99)\r\n    if(opt.include) {\r\n      if(!Array.isArray(opt.include)) return this.warn(depth,'Skeletons.Any({ include }): include must be array',99)\r\n      const { data_deep } = this.getDepth(depth)\r\n      let valid = false\r\n      for(let i=0;i<opt.include.length;i++){\r\n        let schema =opt.include[i]\r\n        let check = new Skeletons(schema)\r\n        check.subValidate(data_deep, this)\r\n        if(check.valid) { \r\n          valid = true\r\n          break\r\n        }\r\n      }\r\n      if(!valid) this.warn(depth, 'validation fail at Skeletons.Any({ include }): ', 7)\r\n    }\r\n    if(opt.exclude) {\r\n      if(!Array.isArray(opt.exclude)) return this.warn(depth,'Skeletons.Any({ exclude }): exclude must be array',99)\r\n      const { data_deep } = this.getDepth(depth)\r\n      let valid = true\r\n      for(let i=0;i<opt.exclude.length;i++){\r\n        let schema =opt.exclude[i]\r\n        let check = new Skeletons(schema)\r\n        check.subValidate(data_deep, this)\r\n        if(check.valid) { \r\n          valid = false\r\n          break\r\n        }\r\n      }\r\n      if(!valid) this.warn(depth, 'validation fail at Skeletons.Any({ exclude })', 7)\r\n    }\r\n  }\r\n}\n\n//# sourceURL=webpack:///./src/proto_data.js?");

/***/ }),

/***/ "./src/static.js":
/*!***********************!*\
  !*** ./src/static.js ***!
  \***********************/
/*! no static exports found */
/***/ (function(module, exports) {

eval("function staticFactory(Skeletons) {\r\n  Skeletons._version_ = '0.0.9'\r\n\r\n  Skeletons.String = function(opt){\r\n    const extend_opt = {}\r\n    return new Skeletons.Types(opt,'StringFn', extend_opt)\r\n  }\r\n  \r\n  Skeletons.Array = function(opt){\r\n    const extend_opt = {\r\n      item: null,\r\n      array: undefined\r\n    }\r\n    return new Skeletons.Types(opt, 'ArrayFn', extend_opt)\r\n  }\r\n\r\n  Skeletons.Boolean = function(opt) {\r\n    const extend_opt = {}\r\n    return new Skeletons.Types(opt, 'BooleanFn', extend_opt)\r\n  }\r\n\r\n  Skeletons.Number = function(opt) {\r\n    const extend_opt = {\r\n      allowNaN: true\r\n    }\r\n    return new Skeletons.Types(opt, 'NumberFn', extend_opt)\r\n  }\r\n\r\n  Skeletons.Object = function(opt){\r\n    const extend_opt = {\r\n      class: null,\r\n      extraKey: false,\r\n      object: {}\r\n    }\r\n    return new Skeletons.Types(opt, 'ObjectFn', extend_opt)\r\n  }\r\n\r\n  Skeletons.MapObject = function(opt){\r\n    const extend_opt = {\r\n      keyValidator: null,\r\n      item: null\r\n    }\r\n    return new Skeletons.Types(opt, 'MapObjectFn', extend_opt)\r\n  }\r\n\r\n  Skeletons.Function = function(opt){\r\n    const extend_opt = {}\r\n    return new Skeletons.Types(opt, 'FunctionFn', extend_opt)\r\n  }\r\n\r\n  Skeletons.Symbol = function(opt) {\r\n    const extend_opt = {}\r\n    return new Skeletons.Types(opt, 'SymbolFn', extend_opt)\r\n  }\r\n\r\n  Skeletons.Null = function(opt) {\r\n    return new Skeletons.Types(opt, 'NullFn', {})\r\n  }\r\n\r\n  Skeletons.Any = function(opt) {\r\n    const extend_opt = {\r\n      exclude: null,\r\n      include: null\r\n    }\r\n    return new Skeletons.Types(opt, 'AnyFn', extend_opt)\r\n  }\r\n\r\n  Skeletons.Types = function(opt={},fname, more_opt){\r\n    const glob_opt = {\r\n      required: true,\r\n      default: undefined,\r\n      validator: null,\r\n    }\r\n    const default_opt = Object.assign(glob_opt, more_opt)\r\n    this.opt = Skeletons.setDefault(opt, default_opt)\r\n    this.fname = fname\r\n  }\r\n\r\n  Skeletons.Warnings = function(opt){\r\n    const options = new Skeletons({\r\n      code: Number,\r\n      log: String,\r\n      type: String,\r\n      depth: Skeletons.Array()\r\n    })\r\n    options.validate(opt ,{\r\n      throw: true //避免maximum call stack\r\n    })\r\n    for(let k in opt){\r\n      this[k] = opt[k]\r\n    }\r\n  }\r\n\r\n  Skeletons.typeof = function(data){\r\n    return (data)===null ? 'null': ( (Array.isArray(data))?'array': typeof data )\r\n  }\r\n\r\n  Skeletons.getKeyStr = function(depth) {\r\n    let keystr = ''\r\n    depth.forEach(k => {\r\n      const kstr = (typeof k ==='string')?`'${k}'`:k\r\n      keystr += `[${kstr}]`\r\n    })\r\n    return (keystr)?keystr: ' '\r\n  }\r\n\r\n  Skeletons.setDefault = function(opt, default_opt) {\r\n    if(!opt) return default_opt\r\n    if(Skeletons.typeof(opt)!=='object') throw 'Skeletons.setDefault(data, options), options must be object'\r\n    \r\n    //options\r\n    for(let k in default_opt) {\r\n      if(opt[k]===undefined) opt[k] = default_opt[k]\r\n    }\r\n    return opt\r\n  }\r\n\r\n  Skeletons.expectType = function(schema) {\r\n    if (schema instanceof Skeletons.Types) {\r\n      return schema.name.toLowerCase()\r\n    }\r\n    //primitive type function(String,Boolean)的schema?\r\n    if (typeof schema === 'function') {\r\n      return Skeletons.typeof(schema())\r\n    }\r\n    return Skeletons.typeof(schema)\r\n  }\r\n}\r\n\r\nmodule.exports = staticFactory\r\n\n\n//# sourceURL=webpack:///./src/static.js?");

/***/ })

/******/ })));