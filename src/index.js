class Modela {
  constructor (fields = {}) {
    Object.getPrototypeOf(this).$fields = fields

    Object.keys(this.$fields).forEach(fieldName => {
      this[fieldName] = this.$fields[fieldName].default || undefined
    })
  }
  $check () {
    const ret = {
      result: true,
      errors: {}
    }
    Object.keys(this.$fields).forEach(fieldName => {
      const value = this[fieldName] || undefined
      const fieldType = this.$fields[fieldName].type || false
      const isRequired = this.$fields[fieldName].required || false
      const validatorValue = typeof this.$fields[fieldName].validator === 'function' ? this.$fields[fieldName].validator(value) : true
      const regexTest = typeof this.$fields[fieldName].regex !== 'undefined'? this.$fields[fieldName].regex.test(value): true
      let errorMessage
      if (typeof this.$fields[fieldName].message === 'function') {
        errorMessage = this.$fields[fieldName].message(value)
      } else if (typeof this.$fields[fieldName].message === 'string') {
        errorMessage = this.$fields[fieldName].message
      }

      if (isRequired && typeof value === 'undefined') {
        ret.result = false
        ret.errors[fieldName] = errorMessage || 'Required!'
      } else if (typeof value !== 'undefined') {
        if (fieldType) {
          let fieldTypes
          if( typeof fieldType === 'array' ){
            fieldTypes = [fieldType]
          } else {
            fieldTypes = fieldType
          }
          
          let allTypesChecked = false
          fieldTypes.forEach(fieldTypeSingle=>{
            if( typeof value === typeof fieldTypeSingle() ){
              allTypesChecked = true
            }
          })
          if( !allTypesChecked ){
            ret.result = false
            ret.errors[fieldName] = errorMessage || 'Type-check failed!'
          }
        } else if (validatorValue === false || regexTest === false) {
          ret.result = false
          ret.errors[fieldName] = errorMessage || 'Illegal value!'
        }
      }
    })
    return ret
  }
  $clean () {
    let ret = true
    Object.keys(this.$check().errors).forEach(fieldName => {
      const isRequired = this.$fields[fieldName].required || false
      const defaultValue = this.$fields[fieldName].default || undefined
      if (typeof defaultValue !== 'undefined') {
        this[fieldName] = defaultValue
      } else if (!isRequired) {
        this[fieldName] = undefined
      } else {
        ret = false
      }
    })
    return ret
  }
}
module.export = Modela

var xas = new Modela({
  name: {
    type: [String, Number],
    //validator: v => v.length > 10,
    //regex: /:(-?)\({2,}$/i,
    //default: 'salam chetori khubi dadash????',
    //required: true
  },
  family: {
    type: String
  }
})

xas.name = 23;//':((((('

console.log(xas)
console.log(xas.$check())
//console.log(xas.$clean())
//console.log(xas)
console.log(xas)
console.log(xas.$check())
