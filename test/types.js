const assert = require('assert')

const Skeletons = require('../lib/index')

const { types } = require('./testdata')
describe('Skeletons.Types', function(){
  it('new Skeletons.Types()' ,function(){
    const test = new Skeletons.Types({b:true},'test',{b:false})
    assert.strictEqual(test.opt.b,true)
    assert.strictEqual(test.fname,'test')
  })
})
describe('All Skeletons Types' ,function(){
  describe('All Type static function exist' ,function(){
    for(let type of types) {
      it(`static function Skeletons.${type} exist`, function(){
        assert.strictEqual(typeof Skeletons[type],'function')
      })
    }
  })
  describe('All Type static function return right object' ,function(){
    for(let type of types) {
      it(`static function Skeletons.${type} exist`, function(){
        const skType = Skeletons[type]()
        assert(skType instanceof Skeletons.Types)
        assert.strictEqual(skType.fname, type+'Fn')
      })
    }
  })
  describe('Skeletons.prototype.{dataFn}' ,function(){
    const skeletons = new Skeletons()
    for(let type of types) {
      const fname = type+'Fn'
      it(`Skeletons.prototype.${fname} exist`, function(){
        assert.strictEqual(typeof skeletons[fname],'function')
      })
    }
  })
})