var assert    = require('assert');
var importer  = require('../../lib/importers/pathname');

/**
 * Escape a string for display in CSS
 * @param   {string} str
 * @returns {string}
 */
function esc(str) {
  return str.replace(/([\[\]\\])/g, '\\$1');
}

describe('sass-composer', function() {
  describe('importer', function() {
    describe('pathname', function() {

      it('should return an error when the file content has not been loaded', function(done) {
        importer(
          {},
          function(err, ctx) {
            assert.notEqual(err, null);
            assert.equal(ctx, null);
            done();
          }
        );
      });

      it('should embed paths for a 1st level file', function(done) {
        importer(
          {
            entry:    '/home/james/prj/index.scss',
            parent:   null,
            file:     '/home/james/prj/index.scss',
            contents: ''
          },
          function(err, ctx) {
            assert.equal(err, null);
            assert(/\$__dirname:\s+"\/home\/james\/prj"/.test(ctx.contents));
            assert(/\$__filename:\s+"\/home\/james\/prj\/index.scss"/.test(ctx.contents));
            done();
          }
        );
      });

      //TODO: check relative paths
      it('should embed paths for a 2nd level file', function(done) {
        importer(
          {
            entry:    '/home/james/prj/index.scss',
            parent:   '/home/james/prj/index.scss',
            file:     '/home/james/prj/lib/typography.scss',
            contents: ''
          },
          function(err, ctx) {
            assert.equal(err, null);
            assert(/\$__dirname:\s+"\/home\/james\/prj\/lib"/.test(ctx.contents));
            assert(/\$__filename:\s+"\/home\/james\/prj\/lib\/typography.scss"/.test(ctx.contents));
            done();
          }
        );
      });

      it('should embed paths for a 3rd level file', function(done) {
        importer(
          {
            entry:    '/home/james/prj/index.scss',
            parent:   '/home/james/prj/lib/typography.scss',
            file:     '/home/james/prj/lib/fonts.scss',
            contents: ''
          },
          function(err, ctx) {
            assert.equal(err, null);
            assert(/\$__dirname:\s+"\/home\/james\/prj\/lib"/.test(ctx.contents));
            assert(/\$__filename:\s+"\/home\/james\/prj\/lib\/fonts.scss"/.test(ctx.contents));
            done();
          }
        );
      });

    });
  });
});