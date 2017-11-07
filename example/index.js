var Modela = require('../src')
var a = new Modela;

var b = {
  name: 'salam chetori khubi dadash????',
  abbas: 23
}

var xas = new Modela({
  name: {
    type: ['string'],
    validator: v => v.length > 10,
    formatter: (v)=>`CLEANED: ${v}`,
  },
  family: {}
})

xas.$set(b)

console.log(xas)
console.log(xas.$check())
console.log(xas.$clean())
console.log(xas)
// console.log(xas)
 console.log(xas.$export())