const assert = require('assert')

const Skeletons = require('../index')

const types = [
  'String',
  'Boolean',
  'Array',
  'Object',
  'Number',
  'Null',
  'Any',
  'MapObject',
]
describe('Skeletons.Types', function(){
  it('new Skeletons.Types()' ,function(){
    const test = new Skeletons.Types({b:true},'test',{b:false})
    assert.equal(test.opt.b,true)
    assert.equal(test.fname,'test')
  })
})
describe('All Skeletons Types' ,function(){
  describe('All Type static function exist' ,function(){
    for(let type of types) {
      it(`static function Skeletons.${type} exist`, function(){
        assert.equal(typeof Skeletons[type],'function')
      })
    }
  })
  describe('All Type static function return right object' ,function(){
    for(let type of types) {
      it(`static function Skeletons.${type} exist`, function(){
        const skType = Skeletons[type]()
        assert(skType instanceof Skeletons.Types)
        assert.equal(skType.fname, type+'Fn')
      })
    }
  })
  describe('Skeletons.prototype.{dataFn}' ,function(){
    const skeletons = new Skeletons()
    for(let type of types) {
      const fname = type+'Fn'
      it(`Skeletons.prototype.${fname} exist`, function(){
        assert.equal(typeof skeletons[fname],'function')
      })
    }
  })
})