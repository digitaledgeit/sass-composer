var assert    = require('assert');
var rule      = require('./lib/get-rule');
var fixture   = require('./lib/get-fixture');
var composer  = require('..');
var url       = require('../lib/plugins/url');

describe('Composer', function() {
  describe('Plugin', function() {
    describe('Url', function () {

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

      describe('.transform.relative', function() {

        it('should convert back slashes - even when the filename contained them e.g. windows', function(done) {

          var entry = __dirname+'\\fixtures\\plugin-url.scss';
          var transform = url.transforms.relative({dir: __dirname+'\\fixtures', copy: false});

          transform.call({entry: entry}, entry, '.\\img\\logo.png', function(err, rel) {
            assert.equal(-1, rel.indexOf('\\'));
            done();
          });

        });

      });

    });
  });
});
