const assert = require('assert')

const Skeletons = require('../index')

const { dataset } = require('./testdata')

let skeletons = new Skeletons(Skeletons.Any(), { console: false })

describe('Skeletons.Any', function(){
  it('default options',function(){
    const expect = {
      validator: null,
      required: true,
      default: undefined,
      include: null,
      exclude: null
    }
    assert.deepEqual(skeletons.schema.opt,expect)
  })
  it('any value is allowed, including undefined' ,function(){
    dataset.forEach(d=>{
      it(`data: ${d}`,function(){
        skeletons.validate(d)
        assert.strictEqual(skeletons.valid, true)
        assert.strictEqual(skeletons.warnings.length, 0)
      })
    })
  })
  it('exclude' ,function(){
    skeletons.schema = Skeletons.Any({
      exclude: [Number,Skeletons.String()]
    })
    skeletons.validate(1)
    assert.strictEqual(skeletons.valid, false)
    assert.strictEqual(skeletons.warnings[0].code, 7)
    skeletons.validate('str')
    assert.strictEqual(skeletons.valid, false)
    assert.strictEqual(skeletons.warnings[0].code, 7)
    dataset.not('str').not(1).forEach(d=>{
      skeletons.validate(d)
      assert(skeletons.valid)
    })
  })
  it('include' ,function(){
    skeletons.schema = Skeletons.Any({
      include: [Number,Skeletons.String()]
    })
    skeletons.validate(1)
    assert(skeletons.valid)
    skeletons.validate('str')
    assert(skeletons.valid)
    dataset.not('str').not(1).forEach(d=>{
      skeletons.validate(d)
      assert.strictEqual(skeletons.valid, false)
      assert.strictEqual(skeletons.warnings[0].code, 7)
    })
  })
})