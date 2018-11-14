const assert = require('assert')

const Skeletons = require('../index')

const { dataset } = require('./testdata')

let skeletons = new Skeletons(Skeletons.Null(), { console: false })

describe('Skeletons.Null', function(){
  describe('default options' ,function(){
    it('default options',function(){
      const expect = {
        validator: null,
        required: true,
        default: undefined,
      }
      assert.deepEqual(skeletons.schema.opt,expect)
    })
  })
  
  describe('not Number' ,function(){
    dataset.not(null).forEach(d=>{
      it(`data: ${Skeletons.typeof(d)}`,function(){
        skeletons.validate(d)
        assert.strictEqual(skeletons.valid, false)
        assert.strictEqual(skeletons.warnings.length, 1)
        assert.strictEqual(skeletons.warnings[0].code, 0)
        assert.deepEqual(skeletons.warnings[0].depth, [])
      })
    })
  })
})