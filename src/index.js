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

module.exports = class Modela {
  constructor (fields = {}) {
    const $fields = {}
    Object.keys(fields).forEach(fieldName => {
      const $field = {}
      if (typeof fields[fieldName] !== 'undefined') {
        $field.type = fields[fieldName].type || []
        $field.default = fields[fieldName].default || (v => v)
        $field.formatter = fields[fieldName].formatter || (v => v)
        $field.importer = fields[fieldName].importer || (v => v)
        $field.message = fields[fieldName].message || (v => 'Illegal value!')
        $field.validator = fields[fieldName].validator || (v => true)
        $fields[fieldName] = $field
      }
    })
    this.$fields = $fields
    Object.keys(this.$fields).forEach(fieldName => {
      this[fieldName] = undefined
    })
    return this
  }
  _typeOf (obj) {
    return ({}).toString.call(obj).match(/\s([a-zA-Z]+)/)[1].toLowerCase()
  }
  $set (obj) {
    Object.keys(this.$fields).forEach(fieldName => {
      this[fieldName] = this.$fields[fieldName].importer(obj[fieldName], this)
    })
    return this
  }
  $check () {
    const ret = {
      result: true,
      errors: {}
    }
    Object.keys(this.$fields).forEach(fieldName => {
      const value = typeof this[fieldName] === 'undefined' ? undefined : this[fieldName]
      const validatorValue = this.$fields[fieldName].validator(value, this)
      if ((this.$fields[fieldName].type.length > 0 && this.$fields[fieldName].type.indexOf(this._typeOf(value)) === -1) || validatorValue === false) {
        ret.result = false
        ret.errors[fieldName] = this.$fields[fieldName].message(value, this)
      }
    })
    return ret
  }
  $clean () {
    Object.keys(this.$check().errors).forEach(fieldName => {
      this[fieldName] = this.$fields[fieldName].default(this[fieldName], this)
    })
    return this
  }
  $export () {
    let ret = {}
    Object.keys(this.$fields).forEach(fieldName => {
      ret[fieldName] = this.$fields[fieldName].formatter(this[fieldName], this)
    })
    return ret
  }
}
