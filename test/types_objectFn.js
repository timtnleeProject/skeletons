const assert = require('assert')

const Skeletons = require('../index')

const { dataset } = require('./testdata')

describe('Skeletons.Object', function(){
  describe('default options',function(){
    let skeletons = new Skeletons(Skeletons.Object(), { console: false })
    const expect = {
      validator: null,
      required: true,
      default: undefined,
      class: null,
      object: {},
      extraKey: false
    }
    it('valid' ,function(){
      assert.deepEqual(skeletons.schema.opt,expect)
    })
  })
  describe('not Object' ,function(){
    let skeletons = new Skeletons(Skeletons.Object(), { console: false })
    dataset.not({}).forEach(d=>{
      it(`data: ${Skeletons.typeof(d)}`,function(){
        skeletons.validate(d)
        assert.strictEqual(skeletons.valid, false)
        assert.strictEqual(skeletons.warnings.length, 1)
        assert.strictEqual(skeletons.warnings[0].code, 0)
        assert.deepEqual(skeletons.warnings[0].depth, [])
      })
    })
  })
  describe('class' ,function(){
    let skeletons = new Skeletons(Skeletons.Object(), { console: false })
    function User(){}
    class Dog{}
    const classes = [Date, User, Dog]
    classes.forEach((c,cIndex)=>{
      it(`class ${c.name}`,function(){
        skeletons.schema = Skeletons.Object({
          class: c
        })
        classes.forEach(($c,dIndex)=>{
          skeletons.validate(new $c())
          if(cIndex===dIndex) assert.strictEqual(skeletons.valid, true)
          else {
            assert.strictEqual(skeletons.valid, false)
            assert.strictEqual(skeletons.warnings[0].code, 8)
          }
        })
      })
    })
  })
  describe('object' ,function(){
    let skeletons = new Skeletons(Skeletons.Object(), { console: false })
    skeletons.schema = Skeletons.Object({
      object: {
        x: Number
      }
    })
    skeletons.validate({})
    it('valid' ,function(){
      assert.strictEqual(skeletons.valid, false)
      assert.strictEqual(skeletons.warnings.length, 1)
      assert.strictEqual(skeletons.warnings[0].code, 0)
      assert.deepEqual(skeletons.warnings[0].depth,['x'])
    })
  })
})