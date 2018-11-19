const protoFactory = require('./proto')
const protoDataFactory = require('./proto_data')
const staticFactory = require('./static')

function clone(schema, opt) {
  this.schema = schema
  this.default = {
    dataName: 'data',
    schemaName: 'schema',
    console: true,
    throw: false,
    rule: {}
  }
  this.default = clone.setDefault(opt, this.default)
  
  const default_rule = {
    extraKey: false
  }
  clone.setDefault(this.default.rule, default_rule)
}

staticFactory(clone)
protoFactory(clone)
protoDataFactory(clone)

module.exports = clone