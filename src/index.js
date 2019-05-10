import staticFactory from './static'
import protoFactory from './proto'
import protoDataFactory from './proto_data'

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

export default Skeletons