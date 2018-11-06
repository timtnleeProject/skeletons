# Skeletons

Skeleton**s** help you validate data structure in programming.

Define your rules, validate your datasources and parameters to check if they meet your expectation.

## Usage

```js
//schema
const schema = {
  x: Number,
  y: Number,
}
//data
const data = {
  x: '1',
}
//define rule
const rule = new Skeletons(schema)
//validate
rule.validate(data)
/*
Skeletons Warn: [Unexpected Type] at data['x']: expect [number] but got [string]
Skeletons Warn: [Unexpected Type] at data['y']: expect [number] but got [undefined]
*/
rule.valid //false
```

## validation

After create a rule, call validate() to validate data

```js
let rule = new Skeletons(Boolean)

rule.validate(1)
```

set default options to rules

```js
let rule = new Skeletons(Boolean, {
  console: true, //use console to show validate warnings
  throw: false, //throw validate warning
  dataName: 'datasource' //data name show in warning message
  schemName: 'mySchema' //schema name show in warning message
})

rule.validate(1)
//Skeletons Warn: [Unexpected Type] at datasource : expect [boolean] but got [undefined]
```

set options only on this validation

```js
rule.validate(1 ,{
  console: false,
  throw: false,
  dataName: 'datasource'
  schemName: 'mySchema'
})
```

## schema

There are three types of schema

### Premitive types **function**

* String
* Number
* Boolean

### Use object symbol to define keys in object

```js
{
  key1: other_schema,
  key2: {
    key21: other_schema
  }
}
```

### Call Skeletons static function

* Skeletons.Number()
* Skeletons.String()
* Skeletons.Boolean()
* Skeletons.Null()
* Skeletons.Any()
* Skeletons.Array()
* Skeletons.Object()
* Skeletons.Function()
* Skeletons.MapObject()

you can pass a **option** object into function to customize your rules

* options.default: 
* options.required:
* options.validator
