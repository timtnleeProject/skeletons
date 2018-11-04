const assert = require('assert')

const Skeletons = require('../index')

describe('Skeletons.Array', function(){
  it('no options', function(){
    let schema = Skeletons.Array()
    let skeletons = new Skeletons(schema)
    skeletons.validate(1, { console: false })
    const warn = skeletons.warnings
    assert.equal(warn.length, 1)
    assert.deepEqual(warn[0].depth,[])
    assert.equal(warn[0].code,0)
    assert.equal(skeletons.valid, false)
    skeletons.validate([], { console: false })
    assert.equal(skeletons.valid, true)
  })
  it('search items' ,function(){
    let schema = Skeletons.Array({
      item: {
        x: Number
      }
    })
    let data = [{x:'1'}]
    let skeletons = new Skeletons(schema)
    skeletons.validate(data, { console: false })
    const warn = skeletons.warnings
    assert.equal(warn.length, 1)
    assert.equal(warn[0].code,0)
    assert.deepEqual(warn[0].depth,['0','x'])
  })
  it('validator value', function(){
    let schema = Skeletons.Array({
      validator: (ary)=>ary.length>3,
      item: Number
    })
    let skeletons = new Skeletons(schema)
    skeletons.validate([1,2], { console: false })
    const warn = skeletons.warnings
    assert.equal(warn.length,1)
    assert.equal(warn[0].code,2)
    assert.deepEqual(warn[0].depth,[])
  })

  it('validator data', function(){
    let schema = {
      number: Number,
      path: Skeletons.Array({
        validator: (ary, data)=>ary.length===data.number,
        item: String
      })
    }
    let skeletons = new Skeletons(schema)
    skeletons.validate({
      number: 2,
      path: ['a','b']
    }, { console: false })
    let warn = skeletons.warnings
    assert.equal(warn.length,0)
    assert.equal(skeletons.valid, true)
    
    skeletons.validate({
      number: 1,
      path: ['a','b','c']
    }, { console: false })
    warn = skeletons.warnings
    assert.equal(warn.length,1)
    assert.equal(skeletons.valid, false)
    assert.equal(warn[0].code,2)
    assert.deepEqual(warn[0].depth,['path'])
  })
})