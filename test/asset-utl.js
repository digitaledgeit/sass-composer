var assert    = require('assert');
var rule      = require('./lib/get-rule');
var fixture   = require('./lib/get-fixture');
var composer  = require('..');

describe('Composer', function() {
  describe('Plugins', function() {
    describe('AssetUrl', function () {

      it('path should be relative to the destination', function(done) {

        composer()
          .source(fixture('import-once'))
          .compose(function(err, css) {
            if (err) return done(err);

            assert.notEqual(css.match(/\.foobar/g), null);
            assert.equal(css.match(/\.foobar/g).length, 1);

            done();
          })
        ;

      });

    });
  });
});
