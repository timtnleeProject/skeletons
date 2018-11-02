const Skeleton = require('./index')

// let schema_a = {
//   // a: Skeleton.String(),
//   b: String,
//   c: {
//     c1: Number
//   },
//   d: Skeleton.Array({
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
// let skeleton = new Skeleton(schema_a)
// skeleton.validate(data_a)

let schema_b = {
  a:Skeleton.String(),
  b_reverse: Skeleton.Boolean(),
  b: Skeleton.Array({
    item: Skeleton.Boolean({
      validator: function(val, data){ return val=== !data.b_reverse }
    })
  }),
  age: Number,
  isAdult: Skeleton.Boolean({
    validator: (val, data)=> val === (data.age>=18) 
  }),
  d: Skeleton.String({
    required: false
  }),
  any: Skeleton.Any({
    include: [String,Number]
  })
}

let data = {
  a:'1',
  b_reverse: true,
  b: [false],
  age: 6,
  isAdult: false,
}

let skeleton2 = new Skeleton(schema_b)
skeleton2.validate(data)

let s = Skeleton.Array({
  item: 1
})

let check = new Skeleton(Skeleton.Array({
  item: 1
}))
check.validate([1])
