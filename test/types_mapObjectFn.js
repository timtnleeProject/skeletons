const assert = require('assert')

const Skeletons = require('../index')

const { dataset } = require('./testdata')

let skeletons = new Skeletons(Skeletons.MapObject(), { console: false })

describe('Skeletons.MapObject', function(){
  describe('default options',function(){
    it('valid',function(){
      const expect = {
        validator: null,
        required: true,
        default: undefined,
        item: null,
        keyValidator: null
      }
      assert.deepEqual(skeletons.schema.opt,expect)
    })
  })
  describe('not MapObject' ,function(){
    dataset.not({}).forEach(d=>{
      it(`data: ${d}`,function(){
        skeletons.validate(d)
        assert.strictEqual(skeletons.valid, false)
        assert.strictEqual(skeletons.warnings.length, 1)
        assert.strictEqual(skeletons.warnings[0].code, 0)
        assert.deepEqual(skeletons.warnings[0].depth, [])
      })
    })
  })
  describe('item', function(){

  })
  describe('keyValidator', function(){
    let testleton = new Skeletons(null,{console: false})
    it('keyValidator(val,data) val correct' ,function(){
      const datasource = {
        keys: true,
        jfkff: true,
        aoodl: true
      }
      const keys = Object.keys(datasource)
      testleton.schema = Skeletons.MapObject({
        keyValidator: (val)=>{
          const i = keys.findIndex(k=>k===val)
          keys.splice(i, 1)
          return true
        }
      })      
      testleton.validate(datasource)
      assert.strictEqual(keys.length, 0)
      assert(testleton.valid)
    })
    it('keyValidator(val,data) data correct' ,function(){
      const datasource = {
        keys: true,
        a: []
      }
      testleton.schema = Skeletons.MapObject({
        keyValidator: (_val,data)=>{
          assert.strictEqual(data,datasource)
          return false
        }
      })      
      testleton.validate(datasource)
      assert.strictEqual(testleton.valid, false)
    })
  })
})