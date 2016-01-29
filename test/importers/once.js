var assert    = require('assert');
var sinon     = require('sinon');
var importer  = require('../../lib/importers/once');

describe('sass-composer', function() {
  describe('importer', function() {
    describe('once', function () {

      it('should leave the contents as-is when the file has not already been imported', function(done) {

        importer(
          {
            run: 1,
            entry: 'index.scss',
            parent: 'index.scss',
            file: 'foobar.scss'
          },
          function(err, ctx) {
            assert.equal(err, null);
            assert.equal(typeof ctx, 'object');
            assert.equal(ctx.file, 'foobar.scss');
            assert.equal(ctx.contents, undefined);
            done();
          }
        );

      });

      it('should leave the contents empty when the file has already been imported', function(done) {

        importer(
          {
            run: 1,
            entry: 'index.scss',
            parent: 'index.scss',
            file: 'foobar.scss'
          },
          function() {
            importer(
              {
                run: 1,
                entry: 'index.scss',
                parent: 'index.scss',
                file: 'foobar.scss'
              },
              function(err, ctx) {
                assert.equal(err, null);
                assert.equal(typeof ctx, 'object');
                assert.equal(ctx.file, 'already-imported:foobar.scss');
                assert.equal(ctx.contents, '');
                done();
              }
            );
          }
        );

      });

    });
  });
});
