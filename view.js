module.exports = View

var EventEmitter = require('events').EventEmitter
  , uid = require('hat')

function View(serviceLocator) {
  EventEmitter.apply(this)
  this.serviceLocator = serviceLocator
  this.$el = this.$el || $('<div>')
  this._listeners = []
  this._domListeners = []
  this._views = { viewIds: {}, modelIds: {} }
  this.cid = uid()
}

View.prototype = Object.create(EventEmitter.prototype)

/*
 * Listen to an event on the provided object
 */
View.prototype.listenTo = function (obj, event, fn) {
  this._listeners.push({ obj: obj, event: event, fn: fn })
  obj.on(event, fn)
}

/*
 * Listen to an event on the provided object
 */
View.prototype.listenToDom = function ($el, event, fn) {
  this._domListeners.push({ $el: $el, event: event, fn: fn })
  $el.on(event, fn)
}

/*
 * Stop listening to all objects that were 'listenTo()'d
 */
View.prototype.stopListening = function () {
  this._listeners.forEach(function (listener) {
    listener.obj.removeListener(listener.event, listener.fn)
  }.bind(this))
}

/*
 * Listen to an event on the provided object
 */
View.prototype.stopDomListening = function () {
  this._domListeners.forEach(function (listener) {
    listener.$el.off(listener.event, listener.fn)
  }.bind(this))
}

/*
 * Dispose of this view and any attached sub-views
 */
View.prototype.remove = function () {

  // Dispose of any sub-views
  Object.keys(this._views.viewIds).forEach(function (key) {
    this._views.viewIds[key].remove()
  }.bind(this))

  this.removeAllListeners()
  this.stopListening()
  this.stopDomListening()
  this.$el.remove()

  // Alert listeners that this view has been removed
  this.emit('remove')

}

/*
 * Attach a child view to this view. Stores it for lookup by viewId
 * of the id of the model that it represents (if it has one).
 */
View.prototype.attachView = function (view) {

  this._views.viewIds[view.cid] = view
  if (view.model) this._views.modelIds[view.model[getIdProperty(view.model)]] = view

  // If the child view happens to be removed before
  // the parent view, remove the reference to it
  view.on('remove', function () {
    delete this._views.viewIds[view.cid]
    if (view.model) delete this._views.modelIds[view.model[getIdProperty(view.model)]]
  }.bind(this))

  return view

}

/*
 * Get the view for a given model.
 */
View.prototype.getViewByModel = function (model) {
  return this._views.modelIds[model[getIdProperty(model)]]
}

View.prototype.getViewByModelId = function (id) {
  return this._views.modelIds[id]
}

function getIdProperty(model) {
  return (typeof model.id !== 'undefined' && model.id !== null) ? 'id' : 'cid'
}