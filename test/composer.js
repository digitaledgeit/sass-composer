var assert = require('assert');
var fixture = require('./lib/get-fixture');
var composer = require('..');

describe('sass-composer', function() {
  describe('Composer', function() {

    describe('new Composer()', function() {
    });

    describe('.resolve()', function() {

      var ctx = {
        entry:    'a',
        parent:   'b',
        file:     'c',
        contents: 'd'
      };

      it('should call the callback with a context when there are no importers', function(done) {

        composer({importers: []}).resolve(ctx, function(err, ret) {
          assert.equal(err, null);
          assert.deepEqual(ret, ctx);
          done();
        });

      });

      it('should call the callback with a context when an importer is successful', function(done) {
        var called = false;

        function importer(ret, next) {
          called = true;
          assert.equal(ret, ctx);
          assert.equal(typeof(next), 'function');
          next(null, ctx);
        }

        composer({importers: [importer]}).resolve(ctx, function(err, ret) {
          assert(called);
          assert.equal(err, null);
          assert.equal(ret, ctx);
          done();
        });

      });

      it('should call the callback with an error when an importer encounters an error', function(done) {
        var called = false;

        function importer(ret, next) {
          called = true;
          next(new Error(), null);
        }

        composer({importers: [importer]}).resolve(ctx, function(err, ret) {
          assert(called);
          assert.notEqual(err, null);
          assert.equal(ret, null);
          done();
        });

      });

    });

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

    it('ctx.parent should be the fully resolved path to the parent file')

  });
});
