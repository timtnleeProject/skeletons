function protoFatory(Skeleton) {
  Skeleton.prototype.validate = function(data, opt) {
    const default_opt = {
      dataName: 'data',
      schemaName: 'schema',
      console: true,
      root: this,
      throw: false,
    }
    opt = Skeleton.setDefault(opt, default_opt)
    for(let k in opt) {
      this[k] = opt[k]
    }
    //init setup
    this.data = data
    this.valid = true
    this.warnings = []
    this.lookup([])
  }
  Skeleton.prototype.lookup = function (depth) {
    depth = depth || []
    let { schema_deep, data_deep } = this.getDepth(depth)
    //optional的schema?
    if (schema_deep instanceof Skeleton.Types) {
      const type = schema_deep
      this[type.fname](type.opt, depth)
      return
    }
    //primitive type function(String,Boolean)的schema?
    if (typeof schema_deep === 'function') {
      const expect_type = typeof schema_deep()
      const data_type = typeof data_deep
      if (expect_type !== data_type) {
        let show_type = Skeleton.typeof(data_deep)
        this.warn(depth, `expect [${expect_type}] but got [${show_type}]`, 0)
      }
      return
    }
    //object schema?
    if(Skeleton.typeof(schema_deep)!=='object') {
      this.warn(depth,'is not a valid schema and will be ignored, please fixed it.',99) 
      return
    }
    //是object schema, 驗證資料
    const data_type = Skeleton.typeof(data_deep)
    if (data_type!='object') {
      return this.warn(depth, `expect object, got ${data_type}`, 1)
    }
    for (let k in schema_deep) {
      this.lookup([...depth, k])
    }
  }
  Skeleton.prototype.getDepth = function (depth) {
    let schema_deep = this.schema,
      data_deep = this.data
    depth.forEach(k => {
      schema_deep = schema_deep[k]
      data_deep = data_deep[k]
    })
    return { schema_deep, data_deep}
  }
  Skeleton.prototype.getKeyStr = function(depth) {
    let keystr = ''
    depth.forEach(k => {
      const kstr = (typeof k ==='string')?`'${k}'`:k
      keystr += `[${kstr}]`
    })
    return keystr
  }
  Skeleton.prototype.SOP = function (opt, depth, name, filter) {
    let { data_deep } = this.getDepth(depth)
    if (opt.required === false && data_deep === undefined) {
      return
    }
    if (!filter(data_deep)) {
      const data_type = Skeleton.typeof(data_deep)
      this.warn(depth, `expect [${name}] but got [${data_type}]`, 0)
      return 
    }
    if (opt.validator) {
      if (typeof opt.validator !== 'function') throw 'validator must be a function'
      if (opt.validator(data_deep, this.root.data) !== true) return this.warn(depth, 'validation failed', 2)
    }
    return 200
  }
  Skeleton.prototype.ArrayFn = function (opt, depth) {
    const status = this.SOP(opt, depth, 'array', (val) => Array.isArray(val))
    if (status != 200) return
    if (opt.item) {
      const { data_deep } = this.getDepth(depth)
      const item_schema = new Skeleton(opt.item) 
      data_deep.forEach((d,i) => {
        item_schema.validate(d, {console: false, root: this})
        if(!item_schema.valid) this.useOriginWarn({
          warnings: item_schema.warnings,
          originDepth: [...depth,i],
          schemaName: 'Skeleton.Array({ item }):'
        })
      })
    }
  }
  Skeleton.prototype.ObjectFn = function(){

  }
  Skeleton.prototype.StringFn = function (opt, depth) {
    this.SOP(opt, depth, 'string', (val) => typeof val === 'string')
  }

  Skeleton.prototype.BooleanFn = function (opt, depth) {
    this.SOP(opt, depth, 'boolean', (val) => typeof val === 'boolean')
  }
  Skeleton.prototype.AnyFn = function(opt, depth) {
    this.SOP(opt, depth, 'any', ()=>true )
    if(opt.include) {
      if(!Array.isArray(opt.include)) throw 'Skeleton.Any({ include }): include must be array'
      const { data_deep } = this.getDepth(depth)
      for(let i=0;i<opt.include.length;i++){
        let schema =opt.include[i]
        let check = new Skeleton(schema)
        check.validate(data_deep, {root:this})
      }
    }
    if(opt.exclude) {
      if(!Array.isArray(opt.exclude)) throw 'Skeleton.Any({ exclude }): exclude must be array'
    }
  }
  Skeleton.prototype.warn = function (depth, log, code) {
    if (this.valid === true)
      this.valid = false
    let type = ''
    let source = (code>=10)? this.schemaName:this.dataName
    //code >= 10 is schema error
    switch (code) {
    case 0:
      type = '[Unexpected Type]'
      break
    case 1:
      type = '[Not Object]'
      break
    case 2:
      type = '[Value invalid]'
      break
    case 99:
      type = '[Wrong Schema]'
      break
    }
    
    if(this.throw) throw output

    const keystr = this.getKeyStr(depth) //keystr only
    const output = `Skeleton Warn: ${type} at ${source}${keystr}: ${log}`
    this.warnings.push(new Skeleton.Warnings({
      code,
      log,
      type,
      depth
    })
    )
    
    if(this.console) return console.log(output)
  }
  Skeleton.prototype.useOriginWarn = function({ warnings,originDepth,schemaName}) {
    warnings.forEach(warn=>{
      const origin_name = this.schema_name
      this.schemaName = schemaName
      let concat_depth = (warn.code>10)?warn.depth:[...originDepth, ...warn.depth]
      this.warn(concat_depth,warn.log,warn.code)
      this.schemaName = origin_name
    })
  }
}


module.exports = protoFatory