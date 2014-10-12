# Ventnor

[![NPM](https://nodei.co/npm/ventnor.png?compact=true)](https://nodei.co/npm/ventnor/)

[![Build Status](https://travis-ci.org/bengourley/ventnor.svg)](https://travis-ci.org/bengourley/ventnor)

This is a base class for views. Ventnor views provide:

- a root DOM element
- a means of observing models and other views
- simple sub view management

If you have used Backbone before, Ventnor views may be familiar to you.

Ventnor views inherit their eventy behaviour from node [event emitter](http://nodejs.org/api/events.html#events_class_events_eventemitter).

## Installation

```
npm install --save ventnor
```

## API

# Constructor

This is how you instantiate the base view. This isn't particularly useful though, normally you'd want
to extend it. See the [Extending Ventnor](#extending-ventnor-for-your-own-views) section.

#### var View = require('ventnor')
#### v = new View(Object: serviceLocator)

By convention, `serviceLocator` is a way of accessing application level services. This can be
just a plain object, or an instance of [serby/service-locator](https://github.com/serby/service-locator).

### Properties

The constructor creates the following public properties on the view instance:

#### v.serviceLocator

Whatever was passed as the first argument to the contructor.

#### v.cid

A unique id.

#### v.el

A root DOM element (an `HTMLDivElement`)

#### v.$el

If jQuery is available this is the result of `$(el)`

### Methods

#### v.listenTo(Object: obj, String: event, Function: fn)

Bind the callback `fn` to the `event` of the event emitter `obj` such that when the
view is destroyed, the event listener is removed. `obj` should be an instance of the node
[event emitter](http://nodejs.org/api/events.html#events_class_events_eventemitter).

#### v.listenToDom(Object: el, String: event, Function: fn)

Bind the callback `fn` to the `event` of the DOM element `el` such that when the
view is destroyed, the event listener is removed.

#### v.stopListening()

Removes all event listeners bound with `v.listenTo()`.

#### v.stopDomListening()

Removes all event listeners bound with `v.listenToDom()`.

#### v.attachView(view)

Attaches the given `view` such that when the view `v` is removed, any attached views
are also removed. This function is for managing the lifecycle of nested views and
preventing view leakage (views not being garbage collected even though they are never
going to be in view again, which is a memory leak). A good rule of thumb is that if
a view is responsible for instantiating another view, it should call `attachView()`.

#### v.remove()

Removes the root element `v.el` from the `document`. This also removes all attached
views and unbinds all event listeners.

#### v.getViewByModel(Object: model)

A lookup function for attached views. This will retrieve a view that has a model
with the `model.id` or `model.cid` property equal to that of the given `model`.

#### v.getViewByModelId(String: id)

A lookup function for attached views. This will retrieve a view that has a `model`
property with `model.id` or `model.cid` equal to that of the given `id`.

### Events

#### v.on('remove')

View emits remove just before it is removed from the document and all of its listeners
are removed.

## Extending Ventnor for your own views

Ventnor doesn't do any fancy extend-y stuff, you just use built-in JS prototypal
inheritence methods.

```js
module.exports = ClockView

var View = require('ventnor')

function ClockView(serviceLocator) {
  // Call the view constructor
  View.apply(this, arguments)
}

// Set the object prototype
ClockView.prototype = Object.create(View.prototype)

// Now add custom methods to the new prototype

// By convention, view instances normally implement
// a render function which populates their DOM element
ClockView.prototype.render() = function () {
  this.el.textContent = new Date()).toString()
}
```

```js
var ClockView = require('./clock-view')
  , v = new ClockView(serviceLocator)
```

## Templating

Ventnor views are easy going as far as templates are concerned. Here's how to implement
a view with Jade templates:

```js
module.exports = ListItemView

var View = require('ventnor')
  , compileJade = require('browjadify-compile')

function ListItemView(serviceLocator, model) {
  View.apply(this, arguments)
  // Use a different root element type if you like
  this.el = document.createElement('li')
  // Store the model so it can be passed in to the template
  this.model = model
}

ListItemView.prototype = Object.create(View.prototype)

ListItemView.prototype.template = compileJade(__dirname + '/list-item.jade')

ListItemView.prototype.render = function () {
  this.el.innerHtml = this.template(this.model.toJSON())
  return this
}
```

```jade
.list-item-header #{name}
.list-item-content #{description}
```

```js
var models = [ /* an array of Merstone models! */]
  , ListItemView = require('./list-item-view')

models.forEach(function (model) {
  listItem = new ListItemView(serviceLocator, model)
  document.getElementById('#item-list')[0].appendChild(listItem.render().el)
})

// The document might now look something like this:
//
// <ul id="item-list">
//   <li>
//     <div class="list-item-header">Item #1</div>
//     <div class="list-item-content">The first item</div>
//   </li>
//   <li>
//     <div class="list-item-header">Item #2</div>
//     <div class="list-item-content">The second item</div>
//   </li>
// </ul>
//

```

## The name?
I've made a bunch of MVC-like components. I named each one after villages on the
[Isle of Wight](http://en.wikipedia.org/wiki/Isle_of_Wight) (where I live) beginning
with the same letter as the thing it represents.

See also [Merstone models](https://github.com/bengourley/merstone) and
[Chale collections](https://github.com/bengourley/chale).

## Credits
* [Ben Gourley](https://github.com/bengourley/)

## Licence
Copyright (c) 2014, Ben Gourley

Permission to use, copy, modify, and/or distribute this software for any purpose with or without fee is hereby granted, provided that the above copyright notice and this permission notice appear in all copies.

THE SOFTWARE IS PROVIDED "AS IS" AND THE AUTHOR DISCLAIMS ALL WARRANTIES WITH REGARD TO THIS SOFTWARE INCLUDING ALL IMPLIED WARRANTIES OF MERCHANTABILITY AND FITNESS. IN NO EVENT SHALL THE AUTHOR BE LIABLE FOR ANY SPECIAL, DIRECT, INDIRECT, OR CONSEQUENTIAL DAMAGES OR ANY DAMAGES WHATSOEVER RESULTING FROM LOSS OF USE, DATA OR PROFITS, WHETHER IN AN ACTION OF CONTRACT, NEGLIGENCE OR OTHER TORTIOUS ACTION, ARISING OUT OF OR IN CONNECTION WITH THE USE OR PERFORMANCE OF THIS SOFTWARE.
