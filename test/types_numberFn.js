const assert = require('assert')

const Skeletons = require('../lib/index')

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
  describe('min', () => {
    const skeletonsInvalidMin = new Skeletons(Skeletons.Number({
      min: '10'
    }), {
      console: false
    });
    const skeletonsMinTest = new Skeletons(Skeletons.Number({
      min: 10
    }), {
      console: false
    });
    it('invalid schema', () => {
      assert.throws(() => {
        skeletonsInvalidMin.validate(0)
      })
    })
    it('less', () => {
      assert.strictEqual(skeletonsMinTest.validate(-1).valid, false);
    })
    it('equals', () => {
      assert.strictEqual(skeletonsMinTest.validate(10).valid, true);
    })
    it('more', () => {
      assert.strictEqual(skeletonsMinTest.validate(42).valid, true);
    })
  })
  describe('max', () => {
    const skeletonsInvalidMax = new Skeletons(Skeletons.Number({
      max: '10'
    }), {
      console: false
    });
    const skeletonsMaxTest = new Skeletons(Skeletons.Number({
      max: 10
    }), {
      console: false
    });
    it('invalid schema', () => {
      assert.throws(() => {
        skeletonsInvalidMax.validate(0)
      })
    })
    it('less', () => {
      assert.strictEqual(skeletonsMaxTest.validate(-1).valid, true);
    })
    it('equals', () => {
      assert.strictEqual(skeletonsMaxTest.validate(10).valid, true);
    })
    it('more', () => {
      assert.strictEqual(skeletonsMaxTest.validate(42).valid, false);
    })
  })
})