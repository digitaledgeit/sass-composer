var assert    = require('assert');
var rule      = require('./lib/get-rule');
var fixture   = require('./lib/get-fixture');
var composer  = require('..');

describe('Composer', function() {
  describe('Composer', function() {
    describe('Context', function () {

      it('should contain the full path', function(done) {

        composer()
          .entry(fixture('import-once'))
          .resolver(function(context, next) {
            //assert should be the full path
          })
          .compose(function(err, css) {
            if (err) return done(err);
            done();
          })
        ;

      });

    });
  });
});
