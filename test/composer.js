var assert    = require('assert');
var rule      = require('./lib/get-rule');
var fixture   = require('./lib/get-fixture');
var composer  = require('..');

describe('Composer', function() {
  describe('Composer', function() {
    describe('Context', function () {

      it('should contain the full path', function(done) {

        composer()
          .source(fixture('import-once'))
          .importer(function(context, next) {
            next(null, context); //assert should be the full path
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
