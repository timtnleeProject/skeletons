const Skeletons = require('./index')

// let schema_a = {
//   // a: Skeletons.String(),
//   b: String,
//   c: {
//     c1: Number
//   },
//   d: Skeletons.Array({
//     item: {
//       x: String
//     }
//   })
// }
// let data_a = {
//   // a: 1,
//   b: 'b',
//   c: {
//     c1: true
//   },
//   d: [{
//     x: '1'
//   },{
//     y:2
//   }]
// }
// let skeletons = new Skeletons(schema_a)
// skeletons.validate(data_a)

let schema_b = {
  a:Skeletons.String(),
  b_reverse: Skeletons.Boolean(),
  b: Skeletons.Array({
    item: Skeletons.Boolean({
      validator: function(val, data){ return val=== !data.b_reverse }
    })
  }),
  age: Number,
  isAdult: Skeletons.Boolean({
    validator: (val, data)=> val === (data.age>=18) 
  }),
  d: Skeletons.String({
    required: false
  }),
  any: Skeletons.Any({
    exclude: [Number]
  }),
  obj: Skeletons.Object({
    object: {
      a: Skeletons.Number({
        allowNaN: false
      })
    }
  }),
  keys: Skeletons.MapObject({
    keyValidator: (val)=>val.length===5,
    item: Boolean
  })
  // keys: Skeletons.MapObject({
  //   key: (k)=>k.length===5,
  //   item: Boolean
  // })
}

let data = {
  a:'1',
  b_reverse: true,
  b: [false],
  age: 6,
  isAdult: false,
  any: 'a',
  obj : {
    a: NaN
  },
  keys: {
    akskd: true,
    dkkdd: false
  }
}

let skeletons2 = new Skeletons(schema_b)
skeletons2.validate(data)
console.log(skeletons2.valid)


// let check = new Skeletons(Skeletons.Array({
//   item: Number
// }))
// check.validate([1])
