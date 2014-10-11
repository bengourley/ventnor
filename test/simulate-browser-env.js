var jsdom = require('jsdom')
  , jquery = require.resolve('jquery')

before(function (done) {
  jsdom.env('', [ jquery ], function (errors, window) {
    if (errors) return done(new Error(errors))
    global.window = window
    global.document = window.document
    done()
  })
})

require('./view.test.js')
