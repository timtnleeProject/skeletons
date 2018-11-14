module.exports = function (Skeletons) {
  Skeletons.prototype.SOP = function (opt, depth, name, filter) {
    let { data_deep } = this.getDepth(depth)
    if (opt.required === false && data_deep === undefined) {
      return
    }
    if(opt.default!==undefined) {
      if(data_deep === opt.default) return
    }
    if (!filter(data_deep)) {
      const data_type = Skeletons.typeof(data_deep)
      this.warn(depth, `expect [${name}] but got [${data_type}]`, 0)
      return 
    }
    if (opt.validator) {
      if (typeof opt.validator !== 'function') return this.warn(depth, 'validator must be a function', 99)
      if (opt.validator(data_deep, this.root.data) !== true) return this.warn(depth, 'validation failed', 2)
    }
    return 200
  }
  Skeletons.prototype.ArrayFn = function (opt, depth) {
    const status = this.SOP(opt, depth, 'array', (val) => Array.isArray(val))
    if (status != 200) return
    if (opt.item) {
      const { data_deep } = this.getDepth(depth)
      const item_schema = new Skeletons(opt.item) 
      data_deep.forEach((d,i) => {
        item_schema.validate(d, {
          isbranch: true,
          root:this
        })
        if(!item_schema.valid) this.useOriginWarn({
          warnings: item_schema.warnings,
          originDepth: [...depth,i],
          schemaName: this.schemaName + Skeletons.getKeyStr(depth) + ', Skeletons.Array({ item }) item'
        })
      })
    }
  }
  Skeletons.prototype.ObjectFn = function(opt, depth){
    const status = this.SOP(opt, depth, 'object', (val)=> Skeletons.typeof(val)==='object')
    if (status != 200) return
    const { data_deep } = this.getDepth(depth)
    if(opt.class) {
      if(typeof opt.class !== 'function')  return this.warn(depth,'class is not a function',99)
      if(!(data_deep instanceof opt.class)) this.warn(depth,`object expect instanceof [${opt.class.name}] but got [${Object.getPrototypeOf(data_deep).constructor.name}]`,8)
    }
    if(opt.object) {
      if(Skeletons.typeof(opt.object)!=='object') return this.warn(depth,'Skeletons.Object({ object }) object must be an object {}',99)
      if(opt.object instanceof Skeletons.Types&&opt.object.fname!='ObjectFn') return this.warn(depth,'Skeletons.Object({ object }) object must be an object {} or Skeletons.Object()',99)
      const schema = new Skeletons(opt.object)
      schema.validate(data_deep, {
        isbranch: true,
        root:this
      })
      if(!schema.valid) {
        this.useOriginWarn({
          warnings: schema.warnings,
          originDepth: depth,
          schemaName: this.schemaName + Skeletons.getKeyStr(depth)
        })
      }
    }
  }
  Skeletons.prototype.MapObjectFn = function(opt, depth) {
    const status = this.SOP(opt, depth, 'object', (val)=> Skeletons.typeof(val)==='object')
    if (status != 200) return
    const { data_deep } = this.getDepth(depth)
    if(opt.keyValidator) {
      if(typeof opt.keyValidator!=='function') return this.warn(depth, 'Skeletons.MapObject({ keyValidator }) keyValidator must be function',99)
      for(let k in data_deep) {
        if(opt.keyValidator(k, this.root.data)!==true) this.warn(depth,`keyValidator failed at key ${k}`,6)
      }
    }
    if(opt.item) {
      const schema = new Skeletons(opt.item)
      for(let k in data_deep) {
        schema.validate(data_deep[k],{
          isbranch: true,
          root: this
        })
        if(!schema.valid) {
          this.useOriginWarn({
            warnings: schema.warnings,
            originDepth: [...depth,k],
            schemaName: this.schemaName + Skeletons.getKeyStr(depth) + ', Skeletons.MapObject({ item })'
          })
        }
      }
    }
  }
  Skeletons.prototype.FunctionFn = function(opt, depth) {
    this.SOP(opt,depth, 'function', (val)=> Skeletons.typeof(val)==='function')
  }
  Skeletons.prototype.NullFn = function (opt, depth){
    this.SOP(opt, depth, 'null', (val)=> Skeletons.typeof(val)==='null')
  }
  Skeletons.prototype.StringFn = function (opt, depth) {
    this.SOP(opt, depth, 'string', (val) => typeof val === 'string')
  }
  Skeletons.prototype.NumberFn = function(opt, depth){
    const status = this.SOP(opt, depth, 'number', (val) => typeof val === 'number')
    if (status != 200) return
    const { data_deep } = this.getDepth(depth)
    if(opt.allowNaN===false&& isNaN(data_deep)) this.warn(depth,'Skeletons.Number({ allowNaN:false }), NaN value not allowed',0)
  }
  Skeletons.prototype.BooleanFn = function (opt, depth) {
    this.SOP(opt, depth, 'boolean', (val) => typeof val === 'boolean')
  }
  Skeletons.prototype.SymbolFn = function(opt, depth) {
    this.SOP(opt, depth, 'symbol', (val)=> typeof val === 'symbol')
  }
  Skeletons.prototype.AnyFn = function(opt, depth) {
    this.SOP(opt, depth, 'any', ()=>true )
    if(opt.include && opt.exclude) return this.warn(depth,'Skeletons.Any({ include, exclude }): you defined both include and exclude, which can only be one of them.',99)
    if(opt.include) {
      if(!Array.isArray(opt.include)) return this.warn(depth,'Skeletons.Any({ include }): include must be array',99)
      const { data_deep } = this.getDepth(depth)
      let valid = false
      for(let i=0;i<opt.include.length;i++){
        let schema =opt.include[i]
        let check = new Skeletons(schema)
        check.validate(data_deep, {
          isbranch: true,
          root:this
        })
        if(check.valid) { 
          valid = true
          break
        }
      }
      if(!valid) this.warn(depth, 'value no matched type for Skeletons.Any({ include })', 7)
    }
    if(opt.exclude) {
      if(!Array.isArray(opt.exclude)) return this.warn(depth,'Skeletons.Any({ exclude }): exclude must be array',99)
      const { data_deep } = this.getDepth(depth)
      let valid = true
      for(let i=0;i<opt.exclude.length;i++){
        let schema =opt.exclude[i]
        let check = new Skeletons(schema)
        check.validate(data_deep, {
          isbranch: true,
          root:this
        })
        if(check.valid) { 
          valid = false
          break
        }
      }
      if(!valid) this.warn(depth, 'value type exists in Skeletons.Any({ exclude })', 7)
    }
  }
}