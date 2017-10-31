var Modela = require('../src')
var a = new Modela;

var xas = new Modela({
  name: {
    type: ['string'],
    validator: v => v.length > 10,
    default: 'salam chetori khubi dadash????',
  },
  family: {}
})

xas.name = 23;//':((((('

console.log(xas)
console.log(xas.$check())
console.log(xas.$clean())
console.log(xas)
// console.log(xas)
 console.log(xas.$check())