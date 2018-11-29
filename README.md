# Skeletons

[![Build Status](https://travis-ci.com/timtnleeProject/skeletons.svg?branch=master)](https://travis-ci.com/timtnleeProject/skeletons) [![npm version](https://badge.fury.io/js/skeletons.svg)](https://badge.fury.io/js/skeletons)

* Skeleton**s** is a pure javascript library that helps you validate data structure in programming.

* Define your rules, validate data sources and parameters/arguments to make sure they meet your expectations.

## Usage

You might bother with data validation.

(notice: there were some mistakes in Readme examples and were fixed at version 0.0.6)

```javascript
if(typeof data!=='object'||data===null) throw 'options must be an object'
if(!data.name) throw '...'
if(!data.id) throw '...'
if(typeof data.age === 'number' && !isNaN(data.age)) { /* ... */ }
//....
```

Skeletons provide an intuitive way to define a rule that makes sure all data meet your expectations, lets you focus on other things in programming.

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
    validator: (val, source) => val === (source.age>=18)
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

* **0.0.11**
  * [options.validator][validator]/[options.keyValidator][mapobject] add new option `store`, see the [use case][ex_mapobj].
* **0.0.10**
  * fixed [options.validator][validator] bug: parameter `data` not passing correctly at Skeletons static function.
* **0.0.9**
  * update [warnings][warn] table.
* **0.0.8**
  * add new schema: [array literal schema][schema].
* **0.0.7**
  * [Skeletons.Object][object] has new option `options.extraKey`.
* **0.0.6**
  * *fixed some mistakes in Readme.md examples.
* **0.0.5**
  * remove unused warning type.
  * fixed schema warnings.
  * add [warnings][warn] wiki.
* **0.0.4**
  * fixed test script/build script.
  * fixed unnecessary validation and warnings.
* **0.0.3**
  * add [`Skeletons.Symbol`][symbol] schema define function.
  * `Skeletons.Object({ object })` object default set to `{}`.

## Installation

### nodejs

as a dependency or devDependency

```linux
npm i --save skeletons
npm i -D skeletons
```

```javascript
//CommonJs
const Skeletons = require('skeletons')

// ES Module
import Skeletons from 'skeletons'
```

### browser

the script for browsers at `/dist/skeletons.min.js`

unpkg cdn : `https://unpkg.com/skeletons@:version/dist/skeletons.min.js`

## Document

* [document][doc]
* [static function][static]
* [Some examples][example]

## Must Know

### null

In javascript, `null` is a primitive type, however, typeof null is

```javascript
typeof null // 'object'
```

Skeletons use [Skeletons.typeof][typeof] instead of `typeof` to check types.

When defining schema to be an object but got `null`, validation will fail.

To define a `null` value schema, use [Skeletons.Null()][null].

### array

In javascript, an array is also an object

```javascript
typeof [] // 'object'
```

However, Skeletons will distinguish the array from other objects.

To define an array schema, use `Skeletons.Array()` or [array literal schema][schema].

### function

```javascript
typeof function(){} // 'function'
```

Although typeof function return `'function'`, it is worth mentioning that function is also a **Function Object**, however, Skeletons will distinguish the function from the object.

So you cannot define an 'object' schema but got 'function' at data.

To define a function schema, use [Skeletons.Function()][function].

### undefined

For every undefined value, validation will fail.

To allow `undefined` value, see [options.required][required].

## Define Schema

Passing a schema to create a rule:

```javascript
let rule_ex1 = new Skeletons(schema)

//or assign schema later
let rule_ex2 = new Skeletons()
rule_ex2.schema = schema
```

There are four types of schema

* premitive types function
* object literal
* array literal (version 0.0.8)
* call Skeletons static function

### premitive types **function**

* String: define a string
* Number: define a number
* Boolean: define a boolean
* Symbol: define a symbol

```javascript
new Skeletons(Number).validate(5)
```

Only **premitive types** function, **do not use** other functions like *Object*, *Array*.

### object literal

use object literal to define keys/values and deeper layers.

```javascript
{
  key1: <schema>,
  key2: {
    key21: <schema>
    key22: {
      key221: <schema>
    }
  }
}
```

This type of schema defines an **object** that has **exactly keys**.

Validation for data that missing keys or has extra keys will fail.

```javascript
const rule = new Skeletons({
  x: Number,
  y: Number,
})
// missing keys/properties
rule.validate({
  x: 1,
})
//Skeletons Warn: [Unexpected Type] at data['y']: expect [number] but got [undefined]

// has extra keys/properties
rule.validate({
  x: 1,
  y: 2,
  z: 3,
})
//Skeletons Warn: [Unknown Property] at data : property 'z' not defined in schema
```

To allow a undefined property, see [options.required][required].

To allow dynamic keys in object, use [MapObject][mapobject].

To check keys that are defined and also ignore keys that are not defined, see [Skeletons.Object][object] : set `options.extraKey` to `true`.

### array literal

To define an **array** that **has exact numbers of elements**.

```javascript
[<schema>,<schema>,<schema>...]
```

Here's [example][ex_ary]

To defined an array that has repeated elements, use [Skeletons.Array()][array].

### call Skeletons static function

These functions allow you to pass options to define a flexible rule.

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

If data isn't valid, skeletons will show the warning message in the console or throw error depends on your setting.

However, if there's a schema problem (defined a wrong schema), skeletons will always throw an error.

**notice** : Skeletons will not discover schema erorrs until `rule.validate()` is called.

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

more about [warnings][warn] and [Document][doc].

[doc]:https://github.com/timtnleeProject/skeletons/wiki/Document
[static]:https://github.com/timtnleeProject/skeletons/wiki/Skeletons-Static-function
[required]:https://github.com/timtnleeProject/skeletons/wiki/Skeletons-Static-function#optionsrequired
[validator]:https://github.com/timtnleeProject/skeletons/wiki/Skeletons-Static-function#optionsvalidator
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
[warn]:https://github.com/timtnleeProject/skeletons/wiki/Warnings
[typeof]:https://github.com/timtnleeProject/skeletons/wiki/Skeletons-Static-function#skeletonstypeofdata
[schema]:https://www.npmjs.com/package/skeletons#define-schema
[example]:https://github.com/timtnleeProject/skeletons/wiki#examples
[ex_ary]:https://github.com/timtnleeProject/skeletons/wiki
[ex_mapobj]:https://github.com/timtnleeProject/skeletons/wiki#mapping-object-keys
