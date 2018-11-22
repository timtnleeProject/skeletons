const assert = require('assert')

const Skeletons = require('../index')

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
      dataset.not([]).push(Skeletons.Array({}), String).forEach(sh=>{
        const rule = new Skeletons(Skeletons.Array({
          array: sh
        })).valid([],{ console: false })
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
})