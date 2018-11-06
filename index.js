const staticFactory = require('./src/static')
const protoFactory = require('./src/proto')
const protoDataFactory = require('./src/proto_data')

function Skeletons(schema, opt) {
  this.schema = schema
  this.default = {
    dataName: 'data',
    schemaName: 'schema',
    console: true,
    throw: false,
  }
  opt = Skeletons.setDefault(opt, this.default)
  for(let k in opt) {
    this.default[k] = opt[k]
  }
}

staticFactory(Skeletons)
protoFactory(Skeletons)
protoDataFactory(Skeletons)

module.exports = Skeletons