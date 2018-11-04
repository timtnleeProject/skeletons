const assert = require('assert')

const Skeletons = require('../index')

describe('test cases', function(){
  describe('invalid input' ,function(){
    let schema = {
      a: Number,
      b: String,
    }
    it('input not object', function(){
      let dataset = [undefined,0,false,null,function(){},1]
      let skeletons = new Skeletons(schema)
      dataset.forEach(data=>{
        skeletons.validate(data, { console: false })
        const warn = skeletons.warnings
        assert.equal(warn.length,1)
        assert.deepEqual(warn[0].depth, [])
        assert.equal(warn[0].code, 1)
      })
    })
  })
  describe('one layer', function(){
    let schema = {
      a: Number,
      b: String,
    }
    it('wrong types' ,function() {
      let data = {
        a: 2,
        b: 1
      }
      let skeletons = new Skeletons(schema)
      skeletons.validate(data, { console: false })
      const warn = skeletons.warnings
      assert.equal(warn.length,1)
      assert.deepEqual(warn[0].depth, ['b'])
      assert.equal(warn[0].code, 0)
    })
    
    it('missing props' ,function() {
      let data = {
        a: 2,
      }
      let skeletons = new Skeletons(schema)
      skeletons.validate(data, { console: false })
      const warn = skeletons.warnings
      assert.equal(warn.length,1)
      assert.deepEqual(warn[0].depth, ['b'])  
      assert.equal(warn[0].code, 0)
    })
  })

  

  describe('two layer', function(){
    let schema = {
      a: Number,
      b: String,
      c: {
        c1: Boolean,
        c2: Boolean
      }
    }
    it('wrong type', function(){
      let data = {
        a: 2,
        b: '1',
        c: {
          c1: null,
          c2: true
        }
      }
      let skeletons = new Skeletons(schema)
      skeletons.validate(data, { console: false })
      const warn = skeletons.warnings
      assert.equal(warn.length,1)
      assert.deepEqual(warn[0].depth, ['c','c1'])  
      assert.equal(warn[0].code, 0)
    })
    it('missing props', function(){
      let data = {
        a: 2,
        b: '1',
        c: {
          c1: true,
        }
      }
      let skeletons = new Skeletons(schema)
      skeletons.validate(data, { console: false })
      const warn = skeletons.warnings
      assert.equal(warn.length,1)
      assert.deepEqual(warn[0].depth, ['c','c2'])  
      assert.equal(warn[0].code, 0)
    })
  })
})