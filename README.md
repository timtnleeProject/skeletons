# Skeletons

[![Build Status](https://travis-ci.com/timtnleeProject/skeletons.svg?branch=master)](https://travis-ci.com/timtnleeProject/skeletons) [![npm version](https://badge.fury.io/js/skeletons.svg)](https://badge.fury.io/js/skeletons)

* Skeleton**s** is a pure javascript library that helps you validate data structure in programming.

* Define your rules, validate data sources and parameters/arguments to make sure they meet your expectations.

## Usage

You might bother with data validation.

```javascript
if(typeof data!=='object'||data===null) throw 'options must be an object'
if(!data.name) throw '...'
if(!data.id) throw '...'
if(typeof data.age && !isNaN(data.age)) { /* ... */ }
//....
```

Skeletons provide an intuitive way to define rule that makes sure all data meet your expectations, lets you focus on other things in programming.

```javascript
const Skeletons = require('skeletons')
//schema
const user_schema = {
  name: String,
  id: Skeletons.String({
    validator: (val)=>val.length===7
  }),
  friends: Skeletons.Array({
    item: {
      name: String,
      id: Skeletons.String({
        validator: (val)=>val.length===7
      })
    }
  }),
  age: Skeletons.Number({
    allowNaN: false
  }),
  grownup: Skeletons.Boolean({
    validator: (_val, source) => source.age>=18
  })
}
//data
const data = {
  name: 'Tim',
  id: 'djfo1k3',
  friends: [
    {
      name: 'Alex',
      id: 'zkfap1d',
    },
    {
      name: 'Leo',
    }
  ],
  age: 17,
  grownup: true
}

// define rule
const rule = new Skeletons(user_schema)

//validate data
rule.validate(data)
/*
 Skeletons Warn: [Unexpected Type] at data['friends'][1]['id']: expect [string] but got [undefined]
 Skeletons Warn: [Value invalid] at data['grownup']: validation failed
*/
rule.valid //false
```

## Version

* **0.0.3**
  * add [`Skeletons.Symbol`][symbol] schema define function
  * `Skeletons.Object({ object })` object default set to `{}`

## Installation

### nodejs

```linux
npm i --save skeletons
```

```js
//CommonJs
const Skeletons = require('skeletons')

// ES Module
import Skeletons from 'skeletons'
```

### browser

script for browser at `/dist/skeletons.min.js`

unpkg cdn : `https://unpkg.com/skeletons@:version/dist/skeletons.min.js`

## Document

* [document][doc]
* [static function][static]

## Must Know

### null

In javascript, `null` is an object.

```javascript
typeof null // 'object'
```

However in Skeletons, `null` will not be treated as an object type.
So when define schema to be object but got `null`, validation will fail.

To define a `null` value schema, use Skeletons.Null()

### array

In javascript, array is also an object

```javascript
typeof [] // 'object'
```

However Skeletons will distinguish array from object.

To define an array schema, use Skeletons.Array()

### undefined

For every undefined value, validation will fail.

To allow undefined, see [options.required][required].

## Define Schema

There are three types of schema

### premitive types **function**

* String : define a string
* Number : define a number
* Boolean : define a boolean

Only **premitive types** function, **do not use** other functions like *Object*, *Array*.

### use object literal to define keys/values

To defined deeper keys and values in object

```javascript
{
  key1: <other_schema>,
  key2: {
    key21: <other_schema>
    key22: {
      key221: <other_schema>
    }
  }
}
```

This type of schema define an object that has exactly keys.

Validation for data that missing keys or has extra keys will fail.

```javascript
const rule = new Skeletons({
  x: Number,
  y: Number,
})

rule.validate({
  x: 1,
})
//Skeletons Warn: [Unexpected Type] at data['y']: expect [number] but got [undefined]

rule.validate({
  x: 1,
  y: 2,
  z: 3,
})
//Skeletons Warn: [Unknown Property] at data : property 'z' not defined in schema
```

To allow a undefined property, see [options.required][required].

To allow dynamic keys in object, use [MapObject][mapobject].

### call Skeletons static function

* [Skeletons.Number()][number]
* [Skeletons.String()][string]
* [Skeletons.Boolean()][boolean]
* [Skeletons.Null()][null]
* [Skeletons.Any()][any]
* [Skeletons.Array()][array]
* [Skeletons.Object()][object]
* [Skeletons.Function()][function]
* [Skeletons.MapObject()][mapobject]
* [Skeletons.Symbol()][symbol]

See [Skeletons static function][static] for more options you can use.

## Validation

### create rule & validate

After new a `rule` member, call method `validate(data)` to validate data

```javascript
let schema = Boolean
let rule = new Skeletons(schema)

rule.validate(1) //this also return rule itself
```

### set options

set default options to `rule.default`

```javascript
let rule = new Skeletons(Boolean, {
  console: true, //use console to show validate warnings
  throw: false, //throw validate warning
  dataName: 'datasource' //data name show in warning message
  schemName: 'mySchema' //schema name show in warning message
})
.validate(1)
//Skeletons Warn: [Unexpected Type] at datasource : expect [boolean] but got [undefined]
```

set options only for this validation, if not set, use `rule.default` as default options

```javascript
rule.validate(1 ,{
  console: false,
  throw: false,
  dataName: 'datasource'
  schemName: 'mySchema'
})
```

If data isn't valid, skeletons will show warning message in console or throw error depends on your setting.

However if there's a schema problem (defined a wrong schema), skeletons will always throw error.

### rule.valid

`rule.valid` will set to `true` or `false` after every validation.

```javascript
rule.validate(1)
rule.valid //false
rule.validate(false)
rule.valid //true
```

### rule.warnings

After `rule.validate()`, `rule.warnings` will be an array contains informations about invalid data.

for example in [Usage](#usage), warnings should look like below :

```javascript
[
  {
    code: 0, //code to identify warning type
    log: 'expect [string] but got [undefined]', // message
    type: '[Unexpected Type]',
    depth: [ 'friends', 1, 'id' ] //object keys show where validation fail:
    // at data['friends'][1]['id']
  },
  {
    code: 2,
    log: 'validation failed',
    type: '[Value invalid]',
    depth: [ 'grownup' ]
  }
]
```

[Document][doc]

[doc]:https://github.com/timtnleeProject/skeletons/wiki/Document
[static]:https://github.com/timtnleeProject/skeletons/wiki/Skeletons-Static-function
[required]:https://github.com/timtnleeProject/skeletons/wiki/Skeletons-Static-function#optionsrequired
[number]:https://github.com/timtnleeProject/skeletons/wiki/Skeletons-Static-function#skeletonsnumber
[boolean]:https://github.com/timtnleeProject/skeletons/wiki/Skeletons-Static-function#skeletonsboolean
[string]:https://github.com/timtnleeProject/skeletons/wiki/Skeletons-Static-function#skeletonsstring
[null]:https://github.com/timtnleeProject/skeletons/wiki/Skeletons-Static-function#skeletonsnull
[array]:https://github.com/timtnleeProject/skeletons/wiki/Skeletons-Static-function#skeletonsarray
[object]:https://github.com/timtnleeProject/skeletons/wiki/Skeletons-Static-function#skeletonsobject
[mapobject]:https://github.com/timtnleeProject/skeletons/wiki/Skeletons-Static-function#skeletonsmapobject
[any]:https://github.com/timtnleeProject/skeletons/wiki/Skeletons-Static-function#skeletonsany
[function]:https://github.com/timtnleeProject/skeletons/wiki/Skeletons-Static-function#skeletonsfunction
[symbol]:https://github.com/timtnleeProject/skeletons/wiki/Skeletons-Static-function#skeletonssymbol