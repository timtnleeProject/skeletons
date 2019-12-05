const assert = require('assert')

const Skeletons = require('../lib/index')

const { dataset } = require('./testdata')

let skeletons = new Skeletons(Skeletons.String(), { console: false })

describe('Skeletons.String', function(){
  describe('default options' ,function(){
    it('valid',function(){
      const expect = {
        validator: null,
        required: true,
        default: undefined,
      }
      assert.deepEqual(skeletons.schema.opt,expect)
    })
  })
  describe('not String' ,function(){
    dataset.not('string').forEach(d=>{
      it(`data: ${Skeletons.typeof(d)}`,function(){
        skeletons.validate(d)
        assert.strictEqual(skeletons.valid, false)
        assert.strictEqual(skeletons.warnings.length, 1)
        assert.strictEqual(skeletons.warnings[0].code, 0)
        assert.deepEqual(skeletons.warnings[0].depth, [])
      })
    })
  })
  describe('RegExp', () => {
    const skeletonsRegExp = new Skeletons(Skeletons.String({
      match: /^[a-z]*$/
    }), {
      console: false
    })
    const skeletonsRegExpWrongSyntax = new Skeletons(Skeletons.String({
      match: '^[a-z]*$'
    }))
    it('data: matches', () => {
      skeletonsRegExp.validate('abc')
      assert.strictEqual(true, skeletonsRegExp.valid)
    })
    it('data: don\'t matches', () => {
      skeletonsRegExp.validate('123')
      assert.strictEqual(false, skeletonsRegExp.valid)
    })
    it('wrong syntax', () => {
      assert.throws(() => {
        skeletonsRegExpWrongSyntax.validate('abc')
      })
    })
  })
  describe('minLength', () => {
    const skeletonsInvalidMin = new Skeletons(Skeletons.String({
      minLength: '3'
    }), {
      console: false
    });
    const skeletonsMinTest = new Skeletons(Skeletons.String({
      minLength: 3
    }), {
      console: false
    });
    it('invalid schema', () => {
      assert.throws(() => {
        skeletonsInvalidMin.validate('')
      })
    })
    it('less', () => {
      assert.strictEqual(skeletonsMinTest.validate('').valid, false);
    })
    it('equals', () => {
      assert.strictEqual(skeletonsMinTest.validate('abc').valid, true);
    })
    it('more', () => {
      assert.strictEqual(skeletonsMinTest.validate('abcd').valid, true);
    })
  })
  describe('maxLength', () => {
    const skeletonsInvalidMax = new Skeletons(Skeletons.String({
      maxLength: '3'
    }), {
      console: false
    });
    const skeletonsMaxTest = new Skeletons(Skeletons.String({
      maxLength: 3
    }), {
      console: false
    });
    it('invalid schema', () => {
      assert.throws(() => {
        skeletonsInvalidMax.validate('')
      })
    })
    it('less', () => {
      assert.strictEqual(skeletonsMaxTest.validate('').valid, true);
    })
    it('equals', () => {
      assert.strictEqual(skeletonsMaxTest.validate('abc').valid, true);
    })
    it('more', () => {
      assert.strictEqual(skeletonsMaxTest.validate('abcd').valid, false);
    })
  })
})