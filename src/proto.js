function protoFatory(Skeletons) {
  Skeletons.prototype.validate = function(data, opt={}) {
    const default_opt = Object.assign({
      root: this, //內部使用
      isbranch: false, //內部使用 驗證nested的資料，不throw也不console
    },this.default)
    
    opt = Skeletons.setDefault(opt, default_opt)
    
    Object.assign(this,opt)
    
    //init setup
    this.data = data
    this.valid = true
    // this.store
    Object.defineProperty(this, 'store',{
      value: {},
      configurable: true,
      enumerable : true,
      writable: false,
    })
    this.warnings = []
    this.lookup([])
    return this
  }

  Skeletons.prototype.subValidate = function(data,target) {
    return this.validate(data, {
      isbranch: true,
      root: target
    })
  }

  Skeletons.prototype.lookup = function (depth=[]) {
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
    const schema_type = Skeletons.typeof(schema_deep)
    //array literal schema
    if(schema_type==='array') {
      const data_type = Skeletons.typeof(data_deep)
      if(data_type!=='array') {
        this.warn(depth,`expect [array] but got [${data_type}]`, 0)
        return
      }
      schema_deep.forEach((_s,i)=>{
        this.lookup([...depth,i])
      })
      if(schema_deep.length<data_deep.length) {
        let i = schema_deep.length
        while(i<data_deep.length) {
          this.warn([...depth,i],`index [${i}] not defined in schema`,4)
          i++
        }
      }
      return
    }
    //not object literal schema, throw
    if(schema_type!=='object') {
      this.warn(depth,'is not a valid schema and will be ignored, please fixed it.',99) 
      return
    }
    //is object literal schema, 驗證資料
    const data_type = Skeletons.typeof(data_deep)
    if (data_type!='object') {
      return this.warn(depth, `expect object, got ${data_type}`, 1)
    }
    let data_keys = {...data_deep}
    for (let k in schema_deep) {
      delete data_keys[k]
      this.lookup([...depth, k])
    }
    // undefined keys?
    if(this.rule.extraKey) return
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
    if (this.valid === true) this.valid = false
    let type = ''
    let source = (code>=10)? this.schemaName:this.dataName
    //code >= 10 is schema error
    switch (code) {
    case 0:
      type = '[Unexpected Type]'
      break
    case 2:
      type = '[Value invalid]'
      break
    case 4:
      type = '[Unknown index]'
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
      const origin_name = this.schemaName
      this.schemaName = `${origin_name}: ${schemaName}`
      let concat_depth = (warn.code>10)?[]:[...originDepth, ...warn.depth]
      if(warn.code>10) this.isbranch = false// schema錯誤: 直接用throw
      this.warn(concat_depth,warn.log,warn.code)
      this.schemaName = origin_name
    })
  }
}


export default protoFatory