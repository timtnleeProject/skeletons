function staticFactory(Skeleton) {
  Skeleton.String = function(opt){
    const extend_opt = {
      default: false
    }
    return new Skeleton.Types(opt,'StringFn', extend_opt)
  }
  
  Skeleton.Number = function(){}
  Skeleton.Array = function(opt){
    const extend_opt = {
      item: null,
    }
    return new Skeleton.Types(opt, 'ArrayFn', extend_opt)
  }
  Skeleton.Boolean = function(opt) {
    const extend_opt = {

    }
    return new Skeleton.Types(opt, 'BooleanFn', extend_opt)
  }
  Skeleton.Object = function(){}
  Skeleton.Any = function(opt) {
    const extend_opt = {
      exclude: null,
      include: null
    }
    return new Skeleton.Types(opt, 'AnyFn', extend_opt)
  }
  Skeleton.Types = function(opt,fname, more_opt){
    const glob_opt = {
      required: true,
      validator: null
    }
    const default_opt = Object.assign(glob_opt, more_opt)
    this.opt = Skeleton.setDefault(opt, default_opt)
    this.fname = fname
    this.default_opt = default_opt
  }
  Skeleton.Warnings = function(opt){
    const options = new Skeleton({
      code: Number,
      log: String,
      type: String,
      depth: Skeleton.Array()
    })
    options.validate(opt ,{
      throw: true //避免maximum call stack
    })
    for(let k in opt){
      this[k] = opt[k]
    }
  }
  Skeleton.typeof = function(data){
    return (data)===null ? 'null': ( (Array.isArray(data))?'array': typeof data )
  }
  Skeleton.setDefault = function(opt, default_opt) {
    if(!opt) opt = default_opt
    if(Skeleton.typeof(opt)!=='object') throw 'Skeleton.valid(data, options), options must be object'
    
    //options
    for(let k in default_opt) {
      if(opt[k]===undefined) opt[k] = default_opt[k]
    }
    return opt
  }
}

module.exports = staticFactory
