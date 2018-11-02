const staticFactory = require('./static')
const protoFactory = require('./proto')

function Skeleton(schema) {
  this.schema = schema
}

staticFactory(Skeleton)
protoFactory(Skeleton)

module.exports = Skeleton