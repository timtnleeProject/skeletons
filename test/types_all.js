const assert = require('assert')

const Skeletons = require('../lib/index')

const { types, dataset } = require('./testdata')

describe('data normal SOP' ,function(){
  const skeletons = new Skeletons(null, {console: false})
  describe('default options' ,function(){
    const expect = {
      validator: null,
      required: true,
      default: undefined
    }
    skeletons.schema = {}
    for(let type of types) {
      it(`type ${type}` ,function(){
        const result = Skeletons[type]()
        skeletons.validate(null)
        for(let k in expect){
          assert.strictEqual(expect[k], result.opt[k])
        }
      })
    }
  })
  describe('required: false, allow undefined', function(){
    for(let type of types.not('Any')) {
      it(`type ${type}` ,function(){
        skeletons.schema = Skeletons[type]({
          required: false
        })
        skeletons.validate(undefined)
        assert.strictEqual(skeletons.valid, true)
        skeletons.schema = Skeletons[type]()
        skeletons.validate(undefined)
        assert.strictEqual(skeletons.valid, false)
      })
    }
  })
  describe('strictEquals', () => {
    const skeletonsEqualsTests = new Skeletons(Skeletons.Any({
      strictEquals: 42
    }))
    it('strict equals', () => {
      assert.strictEqual(skeletonsEqualsTests.validate(42).valid, true)
    })
    it('not strict equals', () => {
      assert.strictEqual(skeletonsEqualsTests.validate('42').valid, false)
    })
    it('not equals', () => {
      assert.strictEqual(skeletonsEqualsTests.validate(12).valid, false)
    })
    it('not equals at all', () => {
      assert.strictEqual(skeletonsEqualsTests.validate('12').valid, false)
    })
  })
  describe('validator' ,function(){
    describe('validator not function' ,function(){
      types.forEach((type,i)=>{
        it(`type ${type}` ,function(){
          skeletons.schema = Skeletons[type]({
            validator: true
          })
          skeletons.validate(dataset[i], { isbranch: true })
          assert.strictEqual(skeletons.valid, false)
          assert.strictEqual(skeletons.warnings[0].code, 99)
        })
      })
    })
    describe('return true, success',function(){
      types.forEach((type,i)=>{
        it(`type ${type}` ,function(){
          skeletons.schema = Skeletons[type]({
            validator: ()=>true
          })
          skeletons.validate(dataset[i])
          assert.strictEqual(skeletons.valid, true)
        })
      })
    })
    describe('return false, fail' ,function(){
      types.forEach((type,i)=>{
        it(`type ${type}` ,function(){
          skeletons.schema = Skeletons[type]({
            validator: ()=>false
          })
          skeletons.validate(dataset[i])
          assert.strictEqual(skeletons.valid, false)
        })
      })
    })
    describe('validator(val, data), val is correct' ,function(){
      types.forEach((type,i)=>{
        it(`type ${type}` ,function(){
          const schema = {
            a: Skeletons[type]({
              validator: (val)=>{
                assert.strictEqual(val, dataset[i])
                return true
              }
            })
          }
          const data = {
            a: dataset[i]
          }
          skeletons.schema = schema
          skeletons.validate(data)
        })
      })
    })
    describe('validator(val, data), data is correct' ,function(){
      types.forEach((type,i)=>{
        it(`type ${type}` ,function(){
          const data = {
            a: dataset[i]
          }
          const schema = {
            a: Skeletons[type]({
              validator: (_val, whole_data)=>{
                assert.strictEqual(whole_data, data)
                return true
              }
            })
          }
          skeletons.schema = schema
          skeletons.validate(data)
        })
      })
      it('deep structure', function(){
        const data = {
          a: {
            b:{
              c: [
                '1'
              ]
            }
          }
        }
        new Skeletons(Skeletons.MapObject({
          item: {
            b: {
              c: Skeletons.Array({
                item : Skeletons.String({
                  validator: (_v,d)=>{
                    assert.strictEqual(d,data)
                    return true
                  }
                })
              })
            }
          }
        })).validate(data)
      })
    })
    describe('validator(_v,_d,store) store is correct', function(){
      it('default', function(){
        const rule = new Skeletons(Skeletons.Object({
          validator: (_v,_d,store)=>{
            assert.strictEqual(store,rule.store)
            return true
          }
        }))
        rule.validate({})
      })
      it('set property', function(){
        const rule = new Skeletons(Skeletons.Object({
          validator: (_v,_d,store)=>{
            store.test = 'a'
            return true
          },
          object: {
            a: Skeletons.String({
              validator: (_v,_d,store)=>{
                assert.strictEqual(store.test,'a')
                return true
              }
            })
          }
        }))
        rule.validate({})
      })
      it('deep, use root store' ,function(){
        const rule = new Skeletons({
          a: Skeletons.Array({
            item: Skeletons.Object({
              validator: (_v,_d,store)=>{
                assert.strictEqual(store, rule.store)
                return true
              }
            })
          })
        })
        rule.validate({
          a: [{}]
        })
      })
    })
  })
  describe('default',function(){
    for(let type of types){
      it(`type ${type}`,function(){
        skeletons.schema = Skeletons[type]({
          default : false
        })
        skeletons.validate(false)
        assert.strictEqual(skeletons.valid, true)
      })
    }
  })
})