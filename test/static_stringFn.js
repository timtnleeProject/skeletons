const assert = require('assert')

const Skeleton = require('../index')

describe('Skeleton.String', function(){
  it('no options', function(){
    let schema = Skeleton.String()
    let skeleton = new Skeleton(schema)
    skeleton.validate(1, { console: false })
    const warn = skeleton.warnings
    assert.equal(warn.length,1)
    assert.deepEqual(warn[0].depth,[])
    assert.equal(warn[0].code,0)
    assert.equal(skeleton.valid, false)
    skeleton.validate('', { console: false })
    assert.equal(skeleton.valid, true)
  })
  it('not required' ,function(){
    let schema = {
      a: String,
      b: Skeleton.String({
        required: false
      })
    }
    let skeleton = new Skeleton(schema)
    skeleton.validate({})
    let warn = skeleton.warnings
    assert.equal(skeleton.valid, false)
    assert.equal(warn.length, 1)
    assert.deepEqual(warn[0].depth,['a'])
  })
})