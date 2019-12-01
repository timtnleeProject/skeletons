"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

var _static = _interopRequireDefault(require("./static"));

var _proto = _interopRequireDefault(require("./proto"));

var _proto_data = _interopRequireDefault(require("./proto_data"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

function Skeletons(schema) {
  var opt = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
  this.schema = schema;
  this["default"] = {
    dataName: 'data',
    schemaName: 'schema',
    console: true,
    "throw": false,
    rule: {
      extraKey: false
    }
  };
  this["default"] = Skeletons.setDefault(opt, this["default"]);
}

(0, _static["default"])(Skeletons);
(0, _proto["default"])(Skeletons);
(0, _proto_data["default"])(Skeletons);
var _default = Skeletons;
exports["default"] = _default;
module.exports = exports.default;
module.exports.default = exports.default;