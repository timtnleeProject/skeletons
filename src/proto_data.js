export default function (Skeletons) {
  Skeletons.prototype.SOP = function (opt, depth, name, filter) {
    let { data_deep } = this.getDepth(depth)
    if (opt.required === false && data_deep === undefined) return //undefined, but not required
    if(opt.default!==undefined && data_deep === opt.default) return // strictEqual to default value
    if (!filter(data_deep)) { // wrong type
      const data_type = Skeletons.typeof(data_deep)
      this.warn(depth, `expect [${name}] but got [${data_type}]`, 0)
      return 
    }
    if (opt.validator) {
      if (typeof opt.validator !== 'function') return this.warn(depth, 'options.validator must be a function', 99)
      if (opt.validator(data_deep, this.root.data, this.root.store)!== true) return this.warn(depth, 'validation failed', 2)
    }
    return 200 //keep check extra options
  }
  Skeletons.prototype.ArrayFn = function (opt, depth) {
    const status = this.SOP(opt, depth, 'array', (val) => Array.isArray(val))
    if (status != 200) return
    const { data_deep } = this.getDepth(depth)
    if (opt.item) {
      const item_schema = new Skeletons(opt.item) 
      data_deep.forEach((d,i) => {
        item_schema.subValidate(d,this.root)
        if(!item_schema.valid) this.useOriginWarn({
          warnings: item_schema.warnings,
          originDepth: [...depth,i],
          schemaName: 'Skeletons.Array({ item }) options.item'
        })
      })
    }
    if (opt.array!==undefined) {
      const ary_schema = opt.array
      if(Skeletons.typeof(ary_schema)!=='array') return this.warn(depth,'Skeletons.Array({ array }) options.array must be an array iteral schema []',99)
      const rule = new Skeletons(ary_schema)
      rule.subValidate(data_deep, this.root)
      if(!rule.valid) this.useOriginWarn({
        warnings: rule.warnings,
        originDepth: [...depth],
        schemaName: 'Skeletons.Array({ array }) options.array'
      })
    }
  }
  Skeletons.prototype.ObjectFn = function(opt, depth){
    const status = this.SOP(opt, depth, 'object', (val)=> Skeletons.typeof(val)==='object')
    if (status != 200) return
    const { data_deep } = this.getDepth(depth)
    if(opt.class) {
      if(typeof opt.class !== 'function')  return this.warn(depth,'Skeletons.Object({ class }) options.class is not a function/class',99)
      if(!(data_deep instanceof opt.class)) this.warn(depth,`object expect instanceof [${opt.class.name}] but got instanceof [${Object.getPrototypeOf(data_deep).constructor.name}]`,8)
    }
    if(opt.object) {
      if(Skeletons.typeof(opt.object)!=='object') return this.warn(depth,'Skeletons.Object({ object }) options.object must be an object {}',99)
      if(opt.object instanceof Skeletons.Types) return this.warn(depth,'Skeletons.Object({ object }) options.object can only use literal object schema {}',99)
      const schema = new Skeletons(opt.object, { rule: { extraKey: opt.extraKey } })
      schema.subValidate(data_deep, this.root)
      if(!schema.valid) {
        this.useOriginWarn({
          warnings: schema.warnings,
          originDepth: depth,
          schemaName: 'Skeletons.Object({ object }) options.object'
        })
      }
    }
  }
  Skeletons.prototype.MapObjectFn = function(opt, depth) {
    const status = this.SOP(opt, depth, 'object', (val)=> Skeletons.typeof(val)==='object')
    if (status != 200) return
    const { data_deep } = this.getDepth(depth)
    const exist = {
      keyValidator: false,
      validateItem: false
    }
    const keyValidator = (k)=>{
      if(!exist.keyValidator) return
      if(opt.keyValidator(k, this.root.data, this.root.store)!==true) this.warn(depth,`keyValidator failed at key ${k}`,6)
    }
    const validateItem = (k, data_deep, schema)=>{
      if(!exist.validateItem) return
      schema.subValidate(data_deep[k],this.root)
      if(!schema.valid) {
        this.useOriginWarn({
          warnings: schema.warnings,
          originDepth: [...depth,k],
          schemaName: 'Skeletons.MapObject({ item }) options.item'
        })
      }
    }
    if(opt.keyValidator) {
      if(typeof opt.keyValidator!=='function') return this.warn(depth, 'Skeletons.MapObject({ keyValidator }) options.keyValidator must be function',99)
      exist.keyValidator = true
    }
    if(opt.item) {
      exist.validateItem = true
    }
    if(!exist.validateItem&&!exist.keyValidator) return
    const schema = new Skeletons(opt.item)
    for(let k in data_deep) {
      keyValidator(k)
      validateItem(k,data_deep, schema)
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
        check.subValidate(data_deep, this.root)
        if(check.valid) { 
          valid = true
          break
        }
      }
      if(!valid) this.warn(depth, 'validation fail at Skeletons.Any({ include }): ', 7)
    }
    if(opt.exclude) {
      if(!Array.isArray(opt.exclude)) return this.warn(depth,'Skeletons.Any({ exclude }): exclude must be array',99)
      const { data_deep } = this.getDepth(depth)
      let valid = true
      for(let i=0;i<opt.exclude.length;i++){
        let schema =opt.exclude[i]
        let check = new Skeletons(schema)
        check.subValidate(data_deep, this.root)
        if(check.valid) { 
          valid = false
          break
        }
      }
      if(!valid) this.warn(depth, 'validation fail at Skeletons.Any({ exclude })', 7)
    }
  }
}