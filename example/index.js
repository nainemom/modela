var Modela = require('../src')
var a = new Modela;

var b = {
  name: 'amir',
  abbas: 23
}

var xas = new Modela({
  name: {
    type: ['string'],
    validator: v => v.length > 10,
    default: 'salam chetori khubi dadash????',
  },
  family: {}
})

xas.$set(b)

console.log(xas)
console.log(xas.$check())
console.log(xas.$clean())
console.log(xas)
// console.log(xas)
 console.log(xas.$check())