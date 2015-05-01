var assert    = require('assert');
var rule      = require('./lib/get-rule');
var fixture   = require('./lib/get-fixture');
var composer  = require('..');

describe('Composer', function() {
  describe('Plugin', function() {
    describe('UrlPlugin', function () {

      it('path should be relative to the destination', function(done) {

        composer()
          .entry(fixture('import-once'))//FIXME
          .compose(function(err, css) {
            if (err) return done(err);

            done();
          })
        ;

      });

    });
  });
});
