module.exports = createBuilder

var constructUrl = require('./construct-url')

function createBuilder(darkroomUrl, salt) {
  if (!darkroomUrl || !salt) throw new Error('arguments `darkroomUrl` and `salt` are required')
  return function () {
    return new Builder(darkroomUrl, salt)
  }
}

function Builder(darkroomUrl, salt) {
  this.darkroomUrl = darkroomUrl
  this.salt = salt
}

Builder.prototype.resource = function (resource) {
  this._resource = resource
  return this
}

Builder.prototype.mode = function (mode) {
  this._mode = mode
  return this
}

Builder.prototype.width = function (width) {
  assertNumber(width, 'width')
  this._width = width
  return this
}

Builder.prototype.height = function (height) {
  assertNumber(height, 'height')
  this._height = height
  return this
}

Builder.prototype.filename = function (filename) {
  this._filename = filename
  return this
}

Builder.prototype.info = function () {
  return constructUrl(this.darkroomUrl, this.salt, [ 'info' ], this._resource)
}

Builder.prototype.url = function () {

  if (!this._resource) throw new Error('Cannot build a url without a valid resource')
  var action = [ 'original' ]

  if (this._width && this._height) {
    action = [ this._width, this._height ]
    if (this._mode) action.push(this._mode)
  } else if (!this._width && this._height) {
    action = [ 0, this._height ]
  } else if (this._width && !this._height) {
    action = [ this._width ]
  }

  return constructUrl(this.darkroomUrl, this.salt, action, this._resource, this._filename)
}

function assertNumber(n, name) {
  if (typeof n !== 'number') throw new Error('Expected ' + name + ' to be a number, got "' + typeof n + '"')
  if (isNaN(n)) throw new Error('Expected ' + name + ' to be a number, got "NaN"')
}
