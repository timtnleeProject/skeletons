const assert = require('assert')

const Skeletons = require('../index')

describe('Skeletons static',function(){
  it('Skeletons.typeof' ,function(){
    const types = [
      {
        data: 0,
        expect: 'number'
      },
      {
        data: '',
        expect: 'string'
      },
      {
        data: false,
        expect: 'boolean'
      },
      {
        data: [],
        expect: 'array'
      },
      {
        data: null,
        expect: 'null'
      },
      {
        data: undefined,
        expect: 'undefined'
      },
      {
        data: {},
        expect: 'object'
      }
    ]
    for(let type of types){
      assert.equal(Skeletons.typeof(type.data), type.expect)
    }
  })
})