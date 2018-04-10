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
    const _fields = {}
    Object.keys(fields).forEach(fieldName => {
      if (typeof fields[fieldName] !== 'undefined') {
        switch (this._typeOf(fields[fieldName])) {
        case 'array':
        case 'string':
          _fields[fieldName] = {
            type: fields[fieldName]
          }
          break
        case 'object':
          _fields[fieldName] = fields[fieldName]
          break
        }
      }
    })

    Object.getPrototypeOf(this).$fields = _fields
    Object.keys(this.$fields).forEach(fieldName => {
      this[fieldName] = this.$fields[fieldName].default || undefined
    })
  }
  _typeOf (obj) {
    return ({}).toString.call(obj).match(/\s([a-zA-Z]+)/)[1].toLowerCase()
  }
  $set (obj) {
    Object.keys(this.$fields).forEach(fieldName => {
      const importer = typeof this.$fields[fieldName].importer === 'function' ? this.$fields[fieldName].importer : v => v
      if (typeof obj[fieldName] === 'undefined') {
        this[fieldName] = importer(typeof this.$fields[fieldName].default === 'function' ? this.$fields[fieldName].default(undefined) : this.$fields[fieldName].default)
      } else {
        this[fieldName] = importer(obj[fieldName])
      }
    })
  }
  $check () {
    const ret = {
      result: true,
      errors: {}
    }
    Object.keys(this.$fields).forEach(fieldName => {
      if (typeof this.$fields[fieldName] === 'undefined') {
        return
      }
      const type = typeof this.$fields[fieldName].type === 'undefined' ? '' : this.$fields[fieldName].type
      const value = typeof this[fieldName] === 'undefined' ? undefined : this[fieldName]
      const validatorValue = typeof this.$fields[fieldName].validator === 'function' ? this.$fields[fieldName].validator(value) : true

      let errorMessage
      if (typeof this.$fields[fieldName].message === 'function') {
        errorMessage = this.$fields[fieldName].message(value)
      } else if (typeof this.$fields[fieldName].message === 'string') {
        errorMessage = this.$fields[fieldName].message
      }
      if ((type.length > 0 && type.indexOf(this._typeOf(value)) === -1) || !validatorValue) {
        ret.result = false
        ret.errors[fieldName] = errorMessage || 'Illegal value!'
      }
    })
    return ret
  }
  $clean () {
    let ret = true
    Object.keys(this.$check().errors).forEach(fieldName => {
      const newValue = typeof this.$fields[fieldName].default === 'undefined' ? this[fieldName] : (typeof this.$fields[fieldName].default === 'function' ? this.$fields[fieldName].default(this[fieldName]) : this.$fields[fieldName].default)
      if (newValue === this[fieldName]) {
        ret = false
      } else {
        this[fieldName] = newValue
      }
    })
    return ret
  }
  $export () {
    let ret = {}
    Object.keys(this.$fields).forEach(fieldName => {
      ret[fieldName] = typeof this.$fields[fieldName].formatter === 'function' ? this.$fields[fieldName].formatter(this[fieldName]) : this[fieldName]
    })
    return ret
  }
}
