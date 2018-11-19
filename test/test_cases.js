const assert = require('assert')

const Skeletons = require('../index')

const { dataset } = require('./testdata')

describe('Test cases', function(){
  describe('warning code' ,function(){
    let schema = {
      a: Number,
      b: String,
    }
    it('[Unexpected Type]' ,function() {
      let data = {
        a: 2,
        b: 1
      }
      let skeletons = new Skeletons(schema)
      skeletons.validate(data, { console: false })
      const warn = skeletons.warnings
      assert.strictEqual(warn.length,1)
      assert.deepEqual(warn[0].depth, ['b'])
      assert.strictEqual(warn[0].code, 0)
    })
    it('[Unexpected Type]', function(){
      let skeletons = new Skeletons(schema)
      dataset.not({}).forEach(data=>{
        skeletons.validate(data, { console: false })
        const warn = skeletons.warnings
        assert.strictEqual(warn.length,1)
        assert.deepEqual(warn[0].depth, [])
        assert.strictEqual(warn[0].code, 1)
      })
    })
    it('[Value invalid]' ,function(){
      let skeletons = new Skeletons(Skeletons.String({
        validator: (val)=>val.length<5
      }))
      skeletons.validate('dffkdkdfkd', { console: false })
      const warn = skeletons.warnings
      assert.strictEqual(warn.length,1)
      assert.deepEqual(warn[0].depth, [])
      assert.strictEqual(warn[0].code, 2)
    })
    it('[Unknown Property]' ,function(){
      let data = {
        a: 2,
        b: 'str',
        c: 4
      }
      let skeletons = new Skeletons(schema)
      skeletons.validate(data, { console: false })
      const warn = skeletons.warnings
      assert.strictEqual(warn.length,1)
      assert.deepEqual(warn[0].depth, [])  
      assert.strictEqual(warn[0].code, 5)
    })
    it('allow [Unknown Property]' ,function(){
      let data = {
        a: 2,
        b: 'str',
        c: 4
      }
      let skeletons = new Skeletons(Skeletons.Object({
        extraKey: true,
        object: {
          a: Number,
          b: String,
        }
      }))
      skeletons.validate(data, { console: false })
      assert.strictEqual(skeletons.valid, true)
    })
    it('allow [Unknown Property], check exist key' ,function(){
      let data = {
        a: '',
        b: 'str',
        c: 4
      }
      let skeletons = new Skeletons(Skeletons.Object({
        extraKey: true,
        object: {
          a: Number,
          b: String,
        }
      }))
      skeletons.validate(data, { console: false })
      assert.strictEqual(skeletons.valid, false)
      assert.strictEqual(skeletons.warnings.length,1)
      assert.deepEqual(skeletons.warnings[0].depth,['a'])
    })
    it('[keyValidator failed]' ,function(){
      let skeletons = new Skeletons(Skeletons.MapObject({
        keyValidator: (val)=>val.length===3
      }))
      skeletons.validate({
        aaa: true,
        bbbb: true
      }, { console: false })
      const warn = skeletons.warnings
      assert.strictEqual(warn.length,1)
      assert.deepEqual(warn[0].depth, [])  
      assert.strictEqual(warn[0].code, 6)
    })
    it('schema err' ,function(){
      let skeletons = new Skeletons({
        a: 1
      })
      try {
        skeletons.validate({a:1})
      } catch (_error) {
        const warn = skeletons.warnings
        assert.strictEqual(warn.length,1)
        assert.deepEqual(warn[0].depth, ['a'])  
        assert.strictEqual(warn[0].code, 99)
      }
    })
  })

  describe('two layer', function(){
    let schema = {
      a: Number,
      b: String,
      c: {
        c1: Boolean,
        c2: Boolean
      }
    }
    it('wrong type', function(){
      let data = {
        a: 2,
        b: '1',
        c: {
          c1: null,
          c2: true
        }
      }
      let skeletons = new Skeletons(schema)
      skeletons.validate(data, { console: false })
      const warn = skeletons.warnings
      assert.strictEqual(warn.length,1)
      assert.deepEqual(warn[0].depth, ['c','c1'])  
      assert.strictEqual(warn[0].code, 0)
    })
    it('missing props', function(){
      let data = {
        a: 2,
        b: '1',
        c: {
          c1: true,
        }
      }
      let skeletons = new Skeletons(schema)
      skeletons.validate(data, { console: false })
      const warn = skeletons.warnings
      assert.strictEqual(warn.length,1)
      assert.deepEqual(warn[0].depth, ['c','c2'])  
      assert.strictEqual(warn[0].code, 0)
    })
  })

  describe('complex data' ,function(){
    let skeletons = new Skeletons({
      name:String,
      id: Skeletons.String({
        validator: (val)=>val.length===7
      }),
      friends: Skeletons.Array({
        item: {
          name: String,
          id: Skeletons.String({
            validator: (val)=>val.length===7
          })
        }
      }),
      age: Number,
      grownup: Skeletons.Boolean({
        validator: (_val, data) => data.age>=18
      })
    }, { console: false })
    skeletons.validate({
      name: 'Tim',
      id: 'djfo1k3',
      friends: [{
        name: 'Alex',
        id: 'zkfap1d'
      },{
        name: 'Jack',
        id: 'ckfp1ld'
      }],
      age: 23,
      grownup: true
    })
    assert(skeletons.valid)
  })
  
})