var assert    = require('assert');
var rule      = require('./lib/get-rule');
var fixture   = require('./lib/get-fixture');
var composer  = require('..');

describe('Composer', function() {
  describe('Functions', function () {

    it('should receive a param and should return `#112233`', function(done) {

      composer()
        .source(fixture('functions'))
        .function('my-color-calc($color)', function(color) {

          assert.equal(color.getR(), 0);
          assert.equal(color.getG(), 0);
          assert.equal(color.getB(), 255);

          return this.types.Color(0x11, 0x22, 0x33);
        })
        .compose(function(err, css) {
          if (err) return done(err);
          assert.equal(rule('.btn:hover', 'color', css), '#112233');
          done();
        })
      ;

    });

  });
});
