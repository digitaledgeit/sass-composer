var assert    = require('assert');
var rule      = require('./lib/get-rule');
var fixture   = require('./lib/get-fixture');
var composer  = require('..');
var url       = require('../lib/plugins/url');

describe('Composer', function() {
  describe('Plugin', function() {
    describe('Url', function () {

      it.skip('should strip query string but add it back after copying', function(done) {
      });

      it.skip('should strip anchor string but add it back after copying', function(done) {
      });

      it.skip('path should be relative to the destination', function(done) {

        composer()
          .entry(fixture('plugin-url'))
          .use(url({dir: '.'}))
          .compose(function(err, css) {
            if (err) return done(err);
console.log(css.toString());
            done();
          })
        ;

      });

    });
  });
});
