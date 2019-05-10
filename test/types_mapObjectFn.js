const assert = require('assert')

const Skeletons = require('../lib/index')

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
      it(`data: ${Skeletons.typeof(d)}`,function(){
        skeletons.validate(d)
        assert.strictEqual(skeletons.valid, false)
        assert.strictEqual(skeletons.warnings.length, 1)
        assert.strictEqual(skeletons.warnings[0].code, 0)
        assert.deepEqual(skeletons.warnings[0].depth, [])
      })
    })
  })
  describe('item', function(){
    let rule = new Skeletons(Skeletons.MapObject({
      item: String
    }), { console: false })
    rule.validate({
      anykeys: 1
    })
    it('validate' ,function(){
      assert.strictEqual(rule.valid, false)
      assert.deepEqual(rule.warnings[0].depth, ['anykeys'])
    })
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
    it('default', function(){
      const rule = new Skeletons(Skeletons.MapObject({
        keyValidator: (_v,_d,store)=>{
          assert.strictEqual(store,rule.store)
          return true
        }
      }))
      rule.validate({})
    })
    it('set property', function(){
      const rule = new Skeletons(Skeletons.MapObject({
        keyValidator: (_v,_d,store)=>{
          store.test = 'a'
          return true
        },
        item: {
          a: Skeletons.MapObject({
            keyValidator: (_v,_d,store)=>{
              assert.strictEqual(store.test,'a')
              return true
            }
          })
        }
      }))
      rule.validate({a:{b:''}})
    })
    it('deep, use root store' ,function(){
      const rule = new Skeletons({
        a: Skeletons.Array({
          item: Skeletons.MapObject({
            keyValidator: (_v,_d,store)=>{
              assert.strictEqual(store, rule.store)
              return true
            }
          })
        })
      })
      rule.validate({
        a: [{}]
      })
    })
  })
})