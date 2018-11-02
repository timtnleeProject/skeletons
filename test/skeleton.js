const assert = require('assert')

const Skeleton = require('../index')

describe('Skeleton', function(){
  describe('new Skeleton' ,function(){
    it('assign schema', function(){
      let schema_a = {
        a: Number,
        b: Boolean
      }
      let skeleton = new Skeleton(schema_a)
      assert.deepEqual(skeleton.schema, schema_a)  
    })
    it('schema is freezed', function(){
      let schema_a = {
        a: Number,
        b: Boolean
      }
      let skeleton = new Skeleton(schema_a)
      schema_a.a = 1
      assert.equal(skeleton.schema.a,1)
    })
  })

  describe('Skeleton.prototype.validate', function(){
    it('default options' ,function(){
      let skeleton = new Skeleton({})
      const expect_default = {
        dataName: 'data',
        schemaName: 'schema',
        console: true,
        throw: false,
      }
      skeleton.validate({})
      for(let k in expect_default) {
        if(k!=='root') assert.equal(expect_default[k],skeleton[k])
        else assert.deepEqual(skeleton,skeleton.root)
      }
    }) 

    it('assign options' ,function(){
      let skeleton = new Skeleton({})
      const root = { a:1, b:2 }
      const options = {
        dataName: 'mydata',
        schemaName: 'options',
        console: false,
        throw: true,
        root,
      }
      skeleton.validate({}, options)
      for(let k in options) {
        if(k!=='root') assert.equal(options[k],skeleton[k])
        else assert.deepEqual(root,skeleton.root)
      }
    })
    it('invalid schema' ,function(){
      let skeleton = new Skeleton({
        a: 1
      })
      skeleton.validate({a:1}, {console: false})
      let warn = skeleton.warnings
      assert.equal(skeleton.valid, false)
      assert.equal(warn.length, 1)
      assert.equal(warn[0].code,99)
      assert.deepEqual(warn[0].depth,['a'])
    })
  })
})
