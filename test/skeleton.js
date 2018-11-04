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
      assert.equal(skeletons.schema.a,1)
    })
  })

  describe('Skeletons.prototype.validate', function(){
    it('default options' ,function(){
      let skeletons = new Skeletons({})
      const expect_default = {
        dataName: 'data',
        schemaName: 'schema',
        console: true,
        throw: false,
      }
      skeletons.validate({})
      for(let k in expect_default) {
        if(k!=='root') assert.equal(expect_default[k],skeletons[k])
        else assert.deepEqual(skeletons,skeletons.root)
      }
    }) 

    it('assign options' ,function(){
      let skeletons = new Skeletons({})
      const root = { a:1, b:2 }
      const options = {
        dataName: 'mydata',
        schemaName: 'options',
        console: false,
        throw: true,
        root,
      }
      skeletons.validate({}, options)
      for(let k in options) {
        if(k!=='root') assert.equal(options[k],skeletons[k])
        else assert.deepEqual(root,skeletons.root)
      }
    })
    it('invalid schema' ,function(){
      let skeletons = new Skeletons({
        a: 1
      })
      try {
        skeletons.validate({a:1}, {console: false})
      } catch (error) {
        let warn = skeletons.warnings
        assert.equal(skeletons.valid, false)
        assert.equal(warn.length, 1)
        assert.equal(warn[0].code,99)
        assert.deepEqual(warn[0].depth,['a'])
      }
    })
  })
})
