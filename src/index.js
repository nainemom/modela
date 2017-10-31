/*
  "string"
  "array"
  "function"
  "null"
  "regexp"
  "undefined"
  "number"
  "date"
  "boolean"
  "symbol"
*/

module.exports = class {
  constructor (fields = {}) {
    Object.getPrototypeOf(this).$fields = fields

    Object.keys(this.$fields).forEach(fieldName => {
      this[fieldName] = this.$fields[fieldName].default || undefined
    })
  }
  _typeOf (obj) {
    return ({}).toString.call(obj).match(/\s([a-zA-Z]+)/)[1].toLowerCase()
  }
  $set (obj) {
    Object.keys(this.$fields).forEach(fieldName => {
      const defaultValue = typeof this.$fields[fieldName].default === 'undefined' ? undefined : this.$fields[fieldName].default
      if (typeof obj[fieldName] === 'undefined') {
        this[fieldName] = defaultValue
      } else {
        this[fieldName] = obj[fieldName]
      }
    })
  }
  $check () {
    const ret = {
      result: true,
      errors: {}
    }
    Object.keys(this.$fields).forEach(fieldName => {
      const types = typeof this.$fields[fieldName].type === 'undefined' ? [] : (this._typeOf(this.$fields[fieldName].type) === 'string' ? [this.$fields[fieldName].type] : this.$fields[fieldName].type)
      const value = typeof this[fieldName] === 'undefined' ? undefined : this[fieldName]
      const validatorValue = typeof this.$fields[fieldName].validator === 'function' ? this.$fields[fieldName].validator(value) : true

      let errorMessage
      if (typeof this.$fields[fieldName].message === 'function') {
        errorMessage = this.$fields[fieldName].message(value)
      } else if (typeof this.$fields[fieldName].message === 'string') {
        errorMessage = this.$fields[fieldName].message
      }
      if ((types.length > 0 && types.indexOf(this._typeOf(value)) === -1) || !validatorValue) {
        ret.result = false
        ret.errors[fieldName] = errorMessage || 'Illegal value!'
      }
    })
    return ret
  }
  $clean () {
    let ret = true
    Object.keys(this.$check().errors).forEach(fieldName => {
      const newValue = typeof this.$fields[fieldName].default === 'undefined' ? this[fieldName] : this.$fields[fieldName].default
      if (newValue === this[fieldName]) {
        ret = false
      } else {
        this[fieldName] = newValue
      }
    })
    return ret
  }
}
