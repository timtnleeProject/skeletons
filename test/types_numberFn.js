const assert = require('assert')

const Skeletons = require('../index')

const { dataset } = require('./testdata')

let skeletons = new Skeletons(Skeletons.Number(), { console: false })

describe('Skeletons.Number', function(){
  describe('default options',function(){
    it('valid' ,function(){
      const expect = {
        validator: null,
        required: true,
        default: undefined,
        allowNaN: true
      }
      assert.deepEqual(skeletons.schema.opt,expect)
    })
  })
  describe('not Number' ,function(){
    dataset.not(1).forEach(d=>{
      it(`data: ${Skeletons.typeof(d)}`,function(){
        skeletons.validate(d)
        assert.strictEqual(skeletons.valid, false)
        assert.strictEqual(skeletons.warnings.length, 1)
        assert.strictEqual(skeletons.warnings[0].code, 0)
        assert.deepEqual(skeletons.warnings[0].depth, [])
      })
    })
  })
  describe('allowNaN' ,function(){
    it('false' ,function(){
      skeletons.schema = Skeletons.Number({
        allowNaN: false
      })
      skeletons.validate(NaN)
      assert.strictEqual(skeletons.valid, false)
    })
  })
})