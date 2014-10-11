var View = require('../')
  , assert = require('assert')
  , EventEmitter = require('events').EventEmitter
  , unique = require('lodash.uniq')

describe('view', function () {

  describe('new View()', function () {

    it('should create a new view', function () {
      var v = new View()
      assert(v instanceof View)
    })

    it('should inherit from node EventEmitter', function () {
      var v = new View()
      assert(v instanceof EventEmitter)
    })

    it('should create a DOM element for the view', function () {
      var v = new View()
      assert(v.el instanceof window.HTMLDivElement)
    })

    it('should give the view a unique client id', function () {
      var viewIds = []
      for (var i = 0; i < 100; i++) viewIds.push(new View().cid)
      assert.equal(viewIds.length, unique(viewIds).length)
    })

  })

  describe('listenTo()', function () {

    it('should run callback function when the given object emits the desired event', function (done) {
      var view = new View()
        , emitter = new EventEmitter()
      view.listenTo(emitter, 'test', function () { done() })
      emitter.emit('test')
    })

  })

  describe('listenToDom()', function () {

    it('should run callback function when the given DOM object emits the desired event', function (done) {
      var view = new View()
        , $el = window.$('<div/>')
      view.listenTo($el, 'click', function () { done() })
      $el.trigger('click')
    })

  })

  describe('stopListening()', function () {

    it('should prevent the further running of bound callback functions', function () {
      var view = new View()
        , emitter = new EventEmitter()
      assert.equal(view._listeners.length, 0)
      view.listenTo(emitter, 'test', function () { assert(false, 'Callback should not be called') })
      assert.equal(view._listeners.length, 1)
      view.stopListening()
      assert.equal(view._listeners.length, 0)
      emitter.emit('test')
    })

  })

  describe('stopDomListening()', function () {

    it('should prevent the further running of bound callback functions', function () {
      var view = new View()
        , $el = window.$('<div/>')
      assert.equal(view._domListeners.length, 0)
      view.listenToDom($el, 'test', function () { assert(false, 'Callback should not be called') })
      assert.equal(view._domListeners.length, 1)
      view.stopDomListening()
      assert.equal(view._domListeners.length, 0)
      $el.trigger('click')
    })

  })

  describe('attachView()', function () {

    it('should store an attached view for lookup by cid and model id', function () {

      var v = new View()
        , subView =  new View()
        , mockModel = { id: 'abc' }
        , subViewWithModel =  new View()

      subViewWithModel.model = mockModel

      assert.equal(Object.keys(v._views.viewIds).length, 0)
      assert.equal(Object.keys(v._views.modelIds).length, 0)

      v.attachView(subView)

      assert.equal(Object.keys(v._views.viewIds).length, 1)
      assert.equal(Object.keys(v._views.modelIds).length, 0)

      v.attachView(subViewWithModel)

      assert.equal(Object.keys(v._views.viewIds).length, 2)
      assert.equal(Object.keys(v._views.modelIds).length, 1)

      assert.equal(v._views.viewIds[subView.cid], subView)
      assert.equal(v._views.viewIds[subViewWithModel.cid], subViewWithModel)
      assert.equal(v._views.modelIds[mockModel.id], subViewWithModel)

    })

    it('should drop the reference to the attached view when it emits a remove event', function () {

      var v = new View()
        , subView =  new View()
        , mockModel = { id: 'abc' }
        , subViewWithModel =  new View()

      subViewWithModel.model = mockModel

      v.attachView(subView)
      subView.remove()
      assert.equal(Object.keys(v._views.viewIds).length, 0)

      v.attachView(subViewWithModel)
      subViewWithModel.remove()
      assert.equal(Object.keys(v._views.viewIds).length, 0)
      assert.equal(Object.keys(v._views.modelIds).length, 0)

    })

  })

  describe('getViewByModel', function () {

    it('should respond if an attached view is stored with the given model’s id', function () {
      var v = new View()
        , mockModel = { id: 'abc' }
        , subViewWithModel =  new View()
      subViewWithModel.model = mockModel
      v.attachView(subViewWithModel)
      assert.equal(subViewWithModel, v.getViewByModel(mockModel))
    })

    it('should not error when a view doesn’t exist for the model id', function () {
      var v = new View()
        , mockModel = { id: 'abc' }
        , subViewWithModel =  new View()
      subViewWithModel.model = mockModel
      v.attachView(subViewWithModel)
      assert.equal(undefined, v.getViewByModel({ id: 'def' }))
    })

    it('should work with model client ids', function () {
      var v = new View()
        , subViewWithModel =  new View()
        , mockModel = { cid: 'abc' }
      subViewWithModel.model = mockModel
      v.attachView(subViewWithModel)
      assert.equal(subViewWithModel, v.getViewByModel(mockModel))
    })

  })

  describe('getViewByModelId', function () {

    it('should respond if an attached view is stored with the given model’s id', function () {
      var v = new View()
        , mockModel = { id: 'abc' }
        , subViewWithModel =  new View()
      subViewWithModel.model = mockModel
      v.attachView(subViewWithModel)
      assert.equal(subViewWithModel, v.getViewByModelId('abc'))
    })

    it('should not error when a view doesn’t exist for the model id', function () {
      var v = new View()
        , subViewWithModel =  new View()
        , mockModel = { id: 'abc' }
      subViewWithModel.model = mockModel
      v.attachView(subViewWithModel)
      assert.equal(undefined, v.getViewByModelId('def'))
    })

    it('should work with model client ids', function () {
      var v = new View()
        , subViewWithModel =  new View()
        , mockModel = { cid: 'abc' }
      subViewWithModel.model = mockModel
      v.attachView(subViewWithModel)
      assert.equal(subViewWithModel, v.getViewByModelId('abc'))
    })

  })

  describe('remove()', function () {

    it('should remove all attached views', function (done) {
      var v = new View()
        , subView =  new View()
      v.attachView(subView)
      subView.on('remove', done)
      v.remove()
    })

  })

  // Only add "no jquery" tests if browser has a good DOM
  if (typeof window !== 'undefined') {
    if (typeof window.createElement === 'function') return
    if (typeof window.createElement('div').addEventListener === 'function') return
  }

  describe('no jquery', function () {

    var $

    before(function () {
      // temporarily remove jquery
      $ = window.$
      delete window.$
    })

    after(function () {
      // reinstate jquery
      window.$ = $
    })

    describe('new View()', function () {
      it('should not create view.el if there is no jquery', function () {
        var v = new View()
        assert(v.el instanceof window.HTMLDivElement)
        assert.equal(undefined, v.$el)
      })
    })

    describe('listenToDom()', function () {
      it('should use DOM .addEventListener()', function (done) {
        var v = new View()
          , el = document.createElement('div')
        v.listenToDom(el, 'click', function () {
          done()
        })
        if (typeof el.click === 'function') return el.click()
        // Simulate a DOM event
        var e = document.createEvent('Event')
        e.initEvent('click', true, true)
        el.dispatchEvent(e)
      })
    })

    describe('stopDomListening()', function () {
      it('should use DOM .removeListener()', function (done) {
        var v = new View()
          , el = document.createElement('div')
          , errored = false
        v.listenToDom(el, 'click', function () {
          errored = true
          done(new Error('Event callback should not be called'))
        })
        v.stopDomListening()
        // Simulate a DOM event
        var e = document.createEvent('Event')
        e.initEvent('click', true, true)
        el.dispatchEvent(e)
        if (!errored) done()
      })
    })

  })

})
