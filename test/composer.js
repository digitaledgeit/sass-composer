var assert = require('assert');
var fixture = require('./lib/get-fixture');
var composer = require('..');

describe('Composer', function() {
  describe('Composer', function() {

    describe('.compose()', function() {

      it('should only call the callback once', function(done) {
        var first = true;

        composer()
          .entry(fixture('syntax-error'))
          .compose(function(err, css, stats) {

            assert(first);
            first = false;

            setImmediate(function() {
              done();
            }, 0);

          })
        ;

      });

      it('should call the callback with an error', function(done) {

        composer()
          .entry(fixture('syntax-error'))
          .compose(function(err, css, stats) {
            assert.notEqual(err, null);
            assert.equal(css, null);
            assert.equal(stats, null);
            done();
          })
        ;

      });

      it('should call the callback with a CSS buffer and some stats');

      it('should emit an error on the stream', function(done) {

        composer()
          .entry(fixture('syntax-error'))
          .compose()
          .on('error', function(err) {
            assert.notEqual(err, null);
            done();
          })
        ;

      });

    });

  });
});
