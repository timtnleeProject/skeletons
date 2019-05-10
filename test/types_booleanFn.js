const assert = require('assert')

const Skeletons = require('../lib/index')

const { dataset } = require('./testdata')

let skeletons = new Skeletons(Skeletons.Boolean(), { console: false })

describe('Skeletons.Boolean', function(){
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
  
  describe('not Boolean' ,function(){
    dataset.not(false).forEach(d=>{
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