interface optionsIn {
    console?:boolean,
    throw?:boolean,
    dataName?:string,
    schemName?:string
}

interface basic {
  required?:boolean,
  default?:any,
  validator (value?:any, data?:any):boolean
}

interface numberOpt extends basic {
    allowNaN?:boolean
} 

interface arrayOpt extends basic {
    item?:any
}

interface objectOpt extends basic {
    class?:any,
    object?:any,
    extraKey?:boolean
}

interface mapObjectOpt extends basic {
    keyValidator (key?:string, data?:any):boolean,
    item?:any
}

interface anyOpt extends basic {
    include?:any,
    exclude?:any
}

declare class Skeletons {
    schema:any
    options:any
    valid:boolean
    
    constructor(schema?:any, options?:optionsIn)
    
    static Number(opt?:numberOpt):any
    static String(opt?:basic):any
    static Boolean(opt?:basic):any
    static Null(opt?:basic):any
    static Any(opt?:any):any
    static Array(opt?:arrayOpt):any
    static Object(opt?:objectOpt):any
    static Function(opt?:basic):any
    static MapObject(opt?:mapObjectOpt):any
    static Symbol(opt?:basic):any
    static typeof(data:any):string

    validate (data:any, opt?:optionsIn):Skeletons
}

export default Skeletons