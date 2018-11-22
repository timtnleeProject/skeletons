const staticFactory = require('./src/static')
const protoFactory = require('./src/proto')
const protoDataFactory = require('./src/proto_data')

function Skeletons(schema, opt={}) {
  this.schema = schema
  this.default = {
    dataName: 'data',
    schemaName: 'schema',
    console: true,
    throw: false,
    rule: {
      extraKey: false
    }
  }
  this.default = Skeletons.setDefault(opt, this.default)
}

staticFactory(Skeletons)
protoFactory(Skeletons)
protoDataFactory(Skeletons)

module.exports = Skeletons