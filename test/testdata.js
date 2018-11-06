const Skeletons = require('../index')
const testing = {}
const types = [
  'String',
  'Boolean',
  'Array',
  'Object',
  'Number',
  'Null',
  'Any',
  'MapObject',
  'Function'
]
const dataset = [
  '0',
  false,
  [],
  {},
  0,
  null,
  'any type',
  {},
  function(){},
  undefined

]
types.not = function(val){
  const clone = [...this].filter(c=>c!=val)
  clone.not = types.not
  return clone
}
Object.defineProperty(testing,'types',{
  get(){
    return types
  }
})

dataset.not = function(val){
  const clone = [...this].filter(c=>Skeletons.typeof(c)!==Skeletons.typeof(val))
  clone.not = dataset.not
  return clone
}
Object.defineProperty(testing,'dataset',{
  get(){
    return dataset
  }
})

const assert = require('assert')

describe('Test data',function(){
  it('types',function(){
    assert.deepEqual(testing.types, types)
  })
  it('types.not()',function(){
    const expect = [
      'Boolean',
      'Array',
      'Object',
      'Number',
      'Null',
      'Any',
      'MapObject',
      'Function'
    ]
    testing.types.not('String').forEach((t,i)=>{
      assert.strictEqual(t,expect[i])
    })
  })
  it('types.not().not()',function(){
    const expect = [
      'Array',
      'Object',
      'Number',
      'Null',
      'Any',
      'MapObject',
      'Function'
    ]
    testing.types.not('String').not('Boolean').forEach((t,i)=>{
      assert.strictEqual(t,expect[i])
    })
  })
  it('dataset',function(){
    assert.deepEqual(testing.dataset, dataset)
  })
  it('dataset.not()',function(){
    const expect =[
      '0',
      false,
      [],
      {},
      0,
      null,
      'any type',
      {},
      undefined
    ]
    testing.dataset.not(function(){}).forEach((t,i)=>{
      assert.deepEqual(t, expect[i])
    })
  })
  it('dataset.not().not()',function(){
    const expect =[
      false,
      [],
      {},
      0,
      null,
      {},
      undefined
    ]
    testing.dataset.not(function(){}).not('str').forEach((t,i)=>{
      assert.deepEqual(t, expect[i])
    })
  })
})

module.exports = testing