const assert = require('assert')

const Skeletons = require('../index')

describe('Skeletons.String', function(){
  it('no options', function(){
    let schema = Skeletons.String()
    let skeletons = new Skeletons(schema)
    skeletons.validate(1, { console: false })
    const warn = skeletons.warnings
    assert.equal(warn.length,1)
    assert.deepEqual(warn[0].depth,[])
    assert.equal(warn[0].code,0)
    assert.equal(skeletons.valid, false)
    skeletons.validate('', { console: false })
    assert.equal(skeletons.valid, true)
  })
  it('not required' ,function(){
    let schema = {
      a: String,
      b: Skeletons.String({
        required: false
      })
    }
    let skeletons = new Skeletons(schema)
    skeletons.validate({},{console: false})
    let warn = skeletons.warnings
    assert.equal(skeletons.valid, false)
    assert.equal(warn.length, 1)
    assert.deepEqual(warn[0].depth,['a'])
  })
})