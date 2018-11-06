function protoFatory(Skeletons) {
  Skeletons.prototype.validate = function(data, opt) {
    const default_opt = Object.assign({
      root: this,
      isbranch: false, //驗證nested的資料，不throw也不console
    },this.default)
    opt = Skeletons.setDefault(opt, default_opt)
    for(let k in opt) {
      this[k] = opt[k]
    }
    //init setup
    this.data = data
    this.valid = true
    this.warnings = []
    this.lookup([])
  }
  Skeletons.prototype.lookup = function (depth) {
    depth = depth || []
    let { schema_deep, data_deep } = this.getDepth(depth)
    //optional的schema?
    if (schema_deep instanceof Skeletons.Types) {
      const type = schema_deep
      this[type.fname](type.opt, depth)
      return
    }
    //primitive type function(String,Boolean)的schema?
    if (typeof schema_deep === 'function') {
      const expect_type = typeof schema_deep()
      const data_type = typeof data_deep
      if (expect_type !== data_type) {
        let show_type = Skeletons.typeof(data_deep)
        this.warn(depth, `expect [${expect_type}] but got [${show_type}]`, 0)
      }
      return
    }
    //object schema?
    if(Skeletons.typeof(schema_deep)!=='object') {
      this.warn(depth,'is not a valid schema and will be ignored, please fixed it.',99) 
      return
    }
    //是object schema, 驗證資料
    const data_type = Skeletons.typeof(data_deep)
    if (data_type!='object') {
      return this.warn(depth, `expect object, got ${data_type}`, 1)
    }
    let data_keys = {...data_deep}
    for (let k in schema_deep) {
      delete data_keys[k]
      this.lookup([...depth, k])
    }
    for(let k in data_keys) {
      this.warn(depth,`property '${k}' not defined in schema`,5)
    }
  }
  Skeletons.prototype.getDepth = function (depth) {
    let schema_deep = this.schema,
      data_deep = this.data
    depth.forEach(k => {
      schema_deep = schema_deep[k]
      data_deep = data_deep[k]
    })
    return { schema_deep, data_deep}
  }
  Skeletons.prototype.warn = function (depth, log, code) {
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
    case 5:
      type = '[Unknown Property]'
      break
    case 6:
      type = '[keyValidator failed]'
      break
    case 7:
      type = '[Types Not Matched]'
      break
    case 8:
      type = '[Class Not Matched]'
      break
    case 99:
      type = '[Wrong Schema]'
      break
    }
    const keystr = Skeletons.getKeyStr(depth) //keystr only
    const output = `Skeletons Warn: ${type} at ${source}${keystr}: ${log}`
    this.warnings.push(new Skeletons.Warnings({
      code,
      log,
      type,
      depth
    })
    )
    if(this.isbranch) return

    if(this.throw||(code>=10)) throw output
    
    if(this.console) return console.log(output)
  }
  Skeletons.prototype.useOriginWarn = function({ warnings,originDepth,schemaName}) { 
    //useOriginWarn的schemaName需要自己組，因為schema結構和Data不同 (會用Skeletons static function)
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