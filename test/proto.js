const assert = require('assert')

const Skeletons = require('../lib/index')
const { dataset } = require('./testdata')

describe('Skeletons.prototype',function(){
  describe('Skeletons.prototype.validate' ,function(){
    it('default options' ,function(){
      const skeletons = new Skeletons({})
      const default_opt = {
        dataName: 'data',
        schemaName: 'schema',
        console: true,
        root: skeletons,
        isbranch: false, //驗證nested的資料，不throw也不console
        throw: false,
      }
      skeletons.validate({})
      for(let k in default_opt) {
        assert.deepStrictEqual(default_opt[k], skeletons[k])
      }
    })
    it('pass options' ,function(){
      const skeletons = new Skeletons({})
      const options = {
        dataName: 'test_data',
        schemaName: 'test_schema',
        console: false,
        root: {data:133},
        isbranch: true, //驗證nested的資料，不throw也不console
        throw: true,
      }
      skeletons.validate({},options)
      for(let k in options) {
        assert.deepStrictEqual(options[k], skeletons[k])
      }
    })
    it('invalid schema' ,function(){
      dataset.not({}).not(function(){}).forEach(d=>{
        let skeletons = new Skeletons({
          a: d
        })
        try {
          skeletons.validate({a:1}, {console: false})
        } catch (error) {
          let warn = skeletons.warnings
          assert.strictEqual(skeletons.valid, false)
          assert.strictEqual(warn.length, 1)
          assert.strictEqual(warn[0].code,99)
          assert.deepEqual(warn[0].depth,['a'])
        }
      })
    })
    it('return rule' ,function(){
      let rule = new Skeletons({})
      let rule2 = rule.validate({})
      assert.strictEqual(rule, rule2)
    })
  })  
  describe('Array iteral schema', function(){
    it('check array' ,function(){
      const rule = new Skeletons([],{ console: false }).validate([])
      assert.strictEqual(rule.valid, true)
    })  
    it('not array', function(){
      const rule = new Skeletons([],{ console: false })
      dataset.not([]).forEach(d=>{
        rule.validate(d)
        assert.strictEqual(rule.valid, false)
        assert.strictEqual(rule.warnings.length,1)
        assert.strictEqual(rule.warnings[0].code,0)
      })
    })
    it('array element number' ,function(){
      let num=0
      const {schema, data} = (function(){
        let schema = []
        let data = []
        num = Math.floor(Math.random()*5)+1
        for(let i=0;i<num;i++){
          schema.push(Number)
          data.push(1)
        }
        return {schema, data} 
      }())
      const rule = new Skeletons(schema,{ console: false })
      rule.validate([])
      assert.strictEqual(rule.valid,false)
      assert.strictEqual(rule.warnings.length,num)
      assert.strictEqual(rule.warnings[0].code,0)
      rule.validate(data)
      assert.strictEqual(rule.valid, true)
      data.push(1)
      rule.validate(data)
      assert.strictEqual(rule.valid,false)
      assert.strictEqual(rule.warnings.length,1)
      assert.strictEqual(rule.warnings[0].code,4)
    })
    it('one passed case' ,function(){
      const rule = new Skeletons([
        Number,
        Skeletons.Number({ allowNaN: false }),
        String,
        [
          Boolean,
          Number
        ],
        Skeletons.Function()
      ])
      rule.validate(
        [
          1,
          2,
          '1',
          [ true, 1 ],
          function(a,b){ return a+b }
        ]
      )
      assert.strictEqual(rule.valid, true)
    })
  })
  describe('Object literal validate => lookup execute count' ,function(){
    //isbranch的 lookup 無法套用 因此Skeletons.Array等另外測
    let count = 0
    //constructor
    const Skeletons_Fake = function(...args){ Skeletons.apply(this, args) }
    for(let k in Skeletons) {//static
      Skeletons_Fake[k] = Skeletons[k]
    }
    //prototype
    Skeletons_Fake.prototype = {...Skeletons.prototype}
    Skeletons_Fake.prototype.lookup = function(...opt){
      Skeletons.prototype.lookup.apply(this, opt)
      count++
    }
    const skeletons = new Skeletons_Fake({}, {console: false})
    it('once' ,function(){
      skeletons.validate({})
      assert.strictEqual(count, 1)
    })
    it('twice' ,function(){
      count = 0
      skeletons.schema = {
        x: Number,
      }
      skeletons.validate({})
      assert.strictEqual(count, 2)
    })
    it('three times' ,function(){
      count = 0
      skeletons.schema = {
        x: Number,
        y: Number,
      }
      skeletons.validate({})
      assert.strictEqual(count, 3)
    })
    it('four times (1)' ,function(){
      count = 0
      skeletons.schema = {
        b: {
          c: Number,
          d: Skeletons.String()
        }
      }
      skeletons.validate({
        b: {}
      })
      assert.strictEqual(count, 4)
    })
    it('four times (2)' ,function(){
      count = 0
      skeletons.schema = {
        a: {
          b: {
            c: Number
          }
        }
      }
      skeletons.validate({
        a: {
          b: {
            c: String
          }
        }
      })
      assert.strictEqual(count, 4)
    })
  })
  describe('Skeletons.prototype.getDepth', function(){
    const schema = { 
      name: String,
      id: String,
      friends: Skeletons.Array({
        item: {
          name: String,
          id: String
        }
      }),
      depth1: {
        depth2: {
          depth3: String
        }
      }
    }
    const data = {
      name: 'tim',
      id: 'tlcpal3d',
      friends: [{
        name: 'alex',
        id: 'ckcam19d'
      }],
      depth1: {
        depth2: {
          depth3: 'hello'
        }
      }
    }
    it('depth 0',function(){
      const { schema_deep, data_deep } = Skeletons.prototype.getDepth.call({
        schema,
        data
      },[])
      assert.deepStrictEqual(schema_deep,schema)
      assert.deepStrictEqual(data_deep,data)
    })
    it('depth 3' ,function(){
      const { schema_deep, data_deep } = Skeletons.prototype.getDepth.call({
        schema,
        data
      },['depth1','depth2','depth3'])
      assert.deepStrictEqual(schema_deep, String)
      assert.deepStrictEqual(data_deep, 'hello')
    })    
  })
})