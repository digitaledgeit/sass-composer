var assert    = require('assert');
var rule      = require('./lib/get-rule');
var fixture   = require('./lib/get-fixture');
var composer  = require('..');

describe('Composer', function() {
  describe('Plugins', function() {
    describe('AssetUrl', function () {

      it('path should be relative to the destination', function(done) {

        composer()
          .source(fixture('import-once'))//FIXME
          .compose(function(err, css) {
            if (err) return done(err);

            done();
          })
        ;

      });

    });
  });
});
