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
      },
      {
        data: function(){},
        expect: 'function'
      },
      {
        data: Symbol(),
        expect: 'symbol'
      }
    ]
    for(let type of types){
      assert.strictEqual(Skeletons.typeof(type.data), type.expect)
    }
  })
  describe('Skeletons.getKeyStr' ,function(){
    it('empty', function(){
      const keys = []
      const keyStr = Skeletons.getKeyStr(keys)
      assert.strictEqual(keyStr,' ')
    })
    it('[\'a\'][\'b\'][\'c\'][0][\'0\']' ,function(){
      const keys = ['a','b','c',0,'0']
      const keyStr = Skeletons.getKeyStr(keys)
      assert.strictEqual(keyStr,'[\'a\'][\'b\'][\'c\'][0][\'0\']')
    })
  })
  it('Skeletons.setDefault' ,function(){
    const opt = {
      a:true,
      b:2
    }
    const default_opt = {
      a: false,
      b:false,
      c:3
    }
    const result = Skeletons.setDefault(opt, default_opt)
    assert.deepEqual(result, {
      a: true,
      b:2,
      c:3
    })
  })
  it('new Skeletons.Warnings' ,function(){
    const options = {
      code: 1,
      log: 'log',
      type: '[test]',
      depth: []
    }
    const warnings = new Skeletons.Warnings(options)
    for(let k in warnings) {
      assert.deepEqual(warnings[k], options[k])
    }
  })
})