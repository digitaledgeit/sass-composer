var path      = require('path');
var assert    = require('assert');
var rule      = require('./lib/get-rule');
var fixture   = require('./lib/get-fixture');
var composer  = require('..');

describe('Composer', function() {
  describe('Importer', function() {
    describe('Pathname', function() {

      it('path names should point to the entry file before import', function(done) {

        composer()
          .entry(fixture('pathname'))
          .compose(function(err, css) {
            if (err) return done(err);

            assert.equal(rule('.dirname--before', 'content', css), path.dirname(fixture('pathname')));
            assert.equal(rule('.filename--before', 'content', css), fixture('pathname'));

            done();
          })
        ;

      });

      it('path names should point to the imported file during import', function(done) {

        composer()
          .entry(fixture('pathname'))
          .compose(function(err, css) {
            if (err) return done(err);

            assert.equal(rule('.dirname--during', 'content', css), path.dirname(fixture('pathname__import')));
            assert.equal(rule('.filename--during', 'content', css), fixture('pathname__import'));

            done();
          })
        ;

      });

      it('path names should point to the entry file after import', function(done) {

        composer()
          .entry(fixture('pathname'))
          .compose(function(err, css) {
            if (err) return done(err);

            assert.equal(rule('.dirname--after', 'content', css), path.dirname(fixture('pathname')));
            assert.equal(rule('.filename--after', 'content', css), fixture('pathname'));

            done();
          })
        ;

      });


      it('should resolve relative paths', function() {

        var
          source  = '/Users/james/Work/Projects/pcosync/website/pcosync.com/assets/index.css',
          current = './styles/pages/home.css'
        ;

      });

    });
  });
});