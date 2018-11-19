const assert = require('assert')

const Skeletons = require('../index')

describe('Skeletons', function(){
  describe('new Skeletons' ,function(){
    it('assign schema', function(){
      let schema_a = {
        a: Number,
        b: Boolean
      }
      let skeletons = new Skeletons(schema_a)
      assert.deepEqual(skeletons.schema, schema_a)  
    })
    it('schema is not freezed', function(){
      let schema_a = {
        a: Number,
        b: Boolean
      }
      let skeletons = new Skeletons(schema_a)
      schema_a.a = 1
      assert.strictEqual(skeletons.schema.a,1)
    })
  })
  describe('default options', function(){
    const default_rule = {
      extraKey: false
    }
    const options = {
      console: false,
      throw: true,
      dataName: 'data123',
      schemaName: 'schema123',
    }
    const skeletons = new Skeletons({}, options)
    it('default options setup', function(){
      for(let k in options) {
        assert.strictEqual(options[k], skeletons.default[k])
      }
    })
    it('this.rule default', function(){
      assert.deepEqual(skeletons.default.rule, default_rule)
    })
    it('this.rule setup' ,function(){
      let sk = new Skeletons({}, { rule: {extraKey: true} })
      assert.deepEqual(sk.default.rule, {extraKey: true})
    })
    it('Skeletons.prototype.validate use default options' ,function(){
      skeletons.validate({})
      for(let k in options) {
        assert.strictEqual(skeletons[k],options[k])
      }
    })
    it('Skeletons.prototype.validate use new options', function(){
      const new_options = {
        console: true,
        throw: false,
        dataName: 'myData',
        schemaName: 'mySchema'
      }
      skeletons.validate({}, new_options)
      for(let k in new_options) {
        assert.strictEqual(skeletons[k],new_options[k])
      }
    })
    it('default options remain the same', function(){
      skeletons.validate({})
      for(let k in options) {
        assert.strictEqual(skeletons[k],options[k])
      }
    })
  })
})
