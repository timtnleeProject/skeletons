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
        item: null
      }
      skeletons.schema = Skeletons.Array()
      assert.deepEqual(skeletons.schema.opt,expect)
    })
  })
  describe('not array',function(){
    skeletons.schema = Skeletons.Array()
    dataset.not([]).forEach((data)=>{
      it(`data: ${data}`,function(){
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
})