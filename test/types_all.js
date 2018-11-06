const assert = require('assert')

const Skeletons = require('../index')

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