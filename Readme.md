# Ventnor

[![NPM](https://nodei.co/npm/ventnor.png?compact=true)](https://nodei.co/npm/ventnor/)

[![Build Status](https://travis-ci.org/bengourley/ventnor.svg)](https://travis-ci.org/bengourley/ventnor)

This is a base class for views.

If you have used Backbone before, Ventnor views may be familiar to you.

Ventnor views inherit their eventy behaviour from node [event emitter](http://nodejs.org/api/events.html#events_class_events_eventemitter).


## Installation

```
npm install --save ventnor
```

## Usage

```js
//
// Constructor
//

var View = require('ventnor')
  , v = new View(serviceLocator)
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
