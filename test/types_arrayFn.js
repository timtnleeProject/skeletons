const assert = require('assert')

const Skeletons = require('../lib/index')

const { dataset } = require('./testdata')

let skeletons = new Skeletons(null, { console: false })

describe('Skeletons.Array', function(){
  describe('default options' ,function(){
    it('valid',function(){
      const expect = {
        validator: null,
        required: true,
        default: undefined,
        item: null,
        array: undefined
      }
      skeletons.schema = Skeletons.Array()
      assert.deepEqual(skeletons.schema.opt,expect)
    })
  })
  describe('not array',function(){
    skeletons.schema = Skeletons.Array()
    dataset.not([]).forEach((data)=>{
      it(`data: ${Skeletons.typeof(data)}`,function(){
        skeletons.validate(data)
        const warn = skeletons.warnings
        assert.strictEqual(warn.length, 1)
        assert.deepEqual(warn[0].depth,[])
        assert.strictEqual(warn[0].code,0)
        assert.strictEqual(skeletons.valid, false)
      })
    })
  })
  it('search items' ,function(){
    skeletons.schema = Skeletons.Array({
      item: {
        x: Number
      }
    })
    const random = Math.floor(Math.random()*5) + 1
    let item = {x:'1'}
    let data = ((item)=>{
      let slot = []
      for(let i=0;i<random;i++){
        slot.push(item)
      }
      return slot
    })(item)
    skeletons.validate(data)
    const warn = skeletons.warnings
    assert.strictEqual(warn.length, random)
    warn.forEach((w,i)=>{
      assert.strictEqual(w.code,0)
      assert.deepEqual(w.depth,[i,'x'])
    })
  })
  describe('options.array' ,function(){
    it('array literal' ,function(){
      const rule = new Skeletons(Skeletons.Array({
        array: []
      })).validate([],{ console: false })
      assert.strictEqual(rule.valid, true)
    })
    it('not array literal', function(){
      const test = dataset.not([]).not(undefined)
      test.push(Skeletons.Array({}), String)
      test.forEach(sh=>{
        const rule = new Skeletons(Skeletons.Array({
          array: sh
        })).validate([],{ isbranch: true })
        assert.strictEqual(rule.valid, false)
        assert.strictEqual(rule.warnings.length,1)
        assert.strictEqual(rule.warnings[0].code, 99)
      })
    })
    it('check array' ,function(){
      const rule = new Skeletons(Skeletons.Array({
        array: [
          Number,
          Boolean
        ]
      }),{ console: false }).validate([1,true])
      assert.strictEqual(rule.valid, true)
    })
  })
  describe('minLength', () => {
    const skeletonsInvalidMin = new Skeletons(Skeletons.Array({
      minLength: '3'
    }), {
      console: false
    });
    const skeletonsMinTest = new Skeletons(Skeletons.Array({
      minLength: 3
    }), {
      console: false
    });
    it('invalid schema', () => {
      assert.throws(() => {
        skeletonsInvalidMin.validate([])
      })
    })
    it('less', () => {
      assert.strictEqual(skeletonsMinTest.validate([]).valid, false);
    })
    it('equals', () => {
      assert.strictEqual(skeletonsMinTest.validate(['a', 'b', 'c']).valid, true);
    })
    it('more', () => {
      assert.strictEqual(skeletonsMinTest.validate(['a', 'b', 'c', 'd']).valid, true);
    })
  })
  describe('maxLength', () => {
    const skeletonsInvalidMax = new Skeletons(Skeletons.Array({
      maxLength: '3'
    }), {
      console: false
    });
    const skeletonsMaxTest = new Skeletons(Skeletons.Array({
      maxLength: 3
    }), {
      console: false
    });
    it('invalid schema', () => {
      assert.throws(() => {
        skeletonsInvalidMax.validate([])
      })
    })
    it('less', () => {
      assert.strictEqual(skeletonsMaxTest.validate([]).valid, true);
    })
    it('equals', () => {
      assert.strictEqual(skeletonsMaxTest.validate(['a', 'b', 'c']).valid, true);
    })
    it('more', () => {
      assert.strictEqual(skeletonsMaxTest.validate(['a', 'b', 'c', 'd']).valid, false);
    })
  })
})