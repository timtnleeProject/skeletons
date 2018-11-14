function staticFactory(Skeletons) {
  Skeletons.String = function(opt){
    const extend_opt = {}
    return new Skeletons.Types(opt,'StringFn', extend_opt)
  }
  
  Skeletons.Array = function(opt){
    const extend_opt = {
      item: null,
    }
    return new Skeletons.Types(opt, 'ArrayFn', extend_opt)
  }
  Skeletons.Boolean = function(opt) {
    const extend_opt = {

    }
    return new Skeletons.Types(opt, 'BooleanFn', extend_opt)
  }
  Skeletons.Number = function(opt) {
    const extend_opt = {
      allowNaN: true
    }
    return new Skeletons.Types(opt, 'NumberFn', extend_opt)
  }
  Skeletons.Object = function(opt){
    const extend_opt = {
      class: null,
      object: {}
    }
    return new Skeletons.Types(opt, 'ObjectFn', extend_opt)
  }
  Skeletons.MapObject = function(opt){
    const extend_opt = {
      keyValidator: null,
      item: null
    }
    return new Skeletons.Types(opt, 'MapObjectFn', extend_opt)
  }
  Skeletons.Function = function(opt){
    const extend_opt = {
    }
    return new Skeletons.Types(opt, 'FunctionFn', extend_opt)
  }
  Skeletons.Symbol = function(opt) {
    const extend_opt = {}
    return new Skeletons.Types(opt, 'SymbolFn', extend_opt)
  }
  Skeletons.Null = function(opt) {
    return new Skeletons.Types(opt, 'NullFn', {})
  }
  Skeletons.Any = function(opt) {
    const extend_opt = {
      exclude: null,
      include: null
    }
    return new Skeletons.Types(opt, 'AnyFn', extend_opt)
  }
  Skeletons.Types = function(opt,fname, more_opt){
    const glob_opt = {
      required: true,
      default: undefined,
      validator: null,
    }
    const default_opt = Object.assign(glob_opt, more_opt)
    this.opt = Skeletons.setDefault(opt, default_opt)
    this.fname = fname
  }
  Skeletons.Warnings = function(opt){
    const options = new Skeletons({
      code: Number,
      log: String,
      type: String,
      depth: Skeletons.Array()
    })
    options.validate(opt ,{
      throw: true //避免maximum call stack
    })
    for(let k in opt){
      this[k] = opt[k]
    }
  }
  Skeletons.typeof = function(data){
    return (data)===null ? 'null': ( (Array.isArray(data))?'array': typeof data )
  }
  Skeletons.getKeyStr = function(depth) {
    let keystr = ''
    depth.forEach(k => {
      const kstr = (typeof k ==='string')?`'${k}'`:k
      keystr += `[${kstr}]`
    })
    return (keystr)?keystr: ' '
  }
  Skeletons.setDefault = function(opt, default_opt) {
    if(!opt) opt = default_opt
    if(Skeletons.typeof(opt)!=='object') throw 'Skeletons.valid(data, options), options must be object'
    
    //options
    for(let k in default_opt) {
      if(opt[k]===undefined) opt[k] = default_opt[k]
    }
    return opt
  }
}

module.exports = staticFactory
