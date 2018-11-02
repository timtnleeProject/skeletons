const assert = require('assert')

const Skeleton = require('../index')

describe('Skeleton.Array', function(){
  it('no options', function(){
    let schema = Skeleton.Array()
    let skeleton = new Skeleton(schema)
    skeleton.validate(1, { console: false })
    const warn = skeleton.warnings
    assert.equal(warn.length, 1)
    assert.deepEqual(warn[0].depth,[])
    assert.equal(warn[0].code,0)
    assert.equal(skeleton.valid, false)
    skeleton.validate([], { console: false })
    assert.equal(skeleton.valid, true)
  })
  it('search items' ,function(){
    let schema = Skeleton.Array({
      item: {
        x: Number
      }
    })
    let data = [{x:'1'}]
    let skeleton = new Skeleton(schema)
    skeleton.validate(data, { console: false })
    const warn = skeleton.warnings
    assert.equal(warn.length, 1)
    assert.equal(warn[0].code,0)
    assert.deepEqual(warn[0].depth,['0','x'])
  })
  it('validator value', function(){
    let schema = Skeleton.Array({
      validator: (ary)=>ary.length>3,
      item: Number
    })
    let skeleton = new Skeleton(schema)
    skeleton.validate([1,2], { console: false })
    const warn = skeleton.warnings
    assert.equal(warn.length,1)
    assert.equal(warn[0].code,2)
    assert.deepEqual(warn[0].depth,[])
  })

  it('validator data', function(){
    let schema = {
      number: Number,
      path: Skeleton.Array({
        validator: (ary, data)=>ary.length===data.number,
        item: String
      })
    }
    let skeleton = new Skeleton(schema)
    skeleton.validate({
      number: 2,
      path: ['a','b']
    }, { console: false })
    let warn = skeleton.warnings
    assert.equal(warn.length,0)
    assert.equal(skeleton.valid, true)
    
    skeleton.validate({
      number: 1,
      path: ['a','b','c']
    }, { console: false })
    warn = skeleton.warnings
    assert.equal(warn.length,1)
    assert.equal(skeleton.valid, false)
    assert.equal(warn[0].code,2)
    assert.deepEqual(warn[0].depth,['path'])
  })
})