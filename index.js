const staticFactory = require('./static')
const protoFactory = require('./proto')
const protoDataFactory = require('./proto_data')

function Skeletons(schema) {
  this.schema = schema
}

staticFactory(Skeletons)
protoFactory(Skeletons)
protoDataFactory(Skeletons)

module.exports = Skeletons