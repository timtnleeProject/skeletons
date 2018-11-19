const staticFactory = require('./src/static')
const protoFactory = require('./src/proto')
const protoDataFactory = require('./src/proto_data')
const sk = require('./src/clone')

function Skeletons(schema, opt) {
  this.schema = schema
  this.default = {
    dataName: 'data',
    schemaName: 'schema',
    console: true,
    throw: false,
    rule: {}
  }
  // validate
  const rule = new sk(sk.Object({
    required: false,
    object:sk.Object({
      extraKey: false,
      object:{
        dataName: sk.String({ required: false }),
        schemaName: sk.String({ required: false }),
        console: sk.Boolean({ required: false }),
        throw: sk.Boolean({ required: false }),
        rule: sk.Object({ 
          extraKey: false,
          required: false, 
          object: { extraKey: sk.Boolean({ required: false }) } 
        }),
      }
    })
  }
  ), {
    dataName: 'new Skeletons(schema, options), options',
  })
  rule.validate(opt, {throw: true})
    
  this.default = Skeletons.setDefault(opt, this.default)

  const default_rule = {
    extraKey: false
  }
  Skeletons.setDefault(this.default.rule, default_rule)
}

staticFactory(Skeletons)
protoFactory(Skeletons)
protoDataFactory(Skeletons)

module.exports = Skeletons