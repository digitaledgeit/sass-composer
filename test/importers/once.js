var assert    = require('assert');
var importer  = require('../../lib/importers/once');

describe('sass-composer', function() {
  describe('importer', function() {
    describe('once', function () {

      it.skip('should leave the contents as-is when the file has not already been imported', function(done) {
        importer();
      });

      it.skip('should leave the contents empty when the file has already been imported', function(done) {
        importer();
      });

    });
  });
});
