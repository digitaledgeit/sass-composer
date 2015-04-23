var path    = require('path');
var extend  = require('extend');
var resolve = require('resolve');

/**
 * Resolve a file using NPM's resolution method
 * @param {Object}                    entry
 * @param {string}                    [entry.file]
 * @param {string}                    [entry.contents]
 * @param {function(Error, Object)}   callback
 */
module.exports = function(entry, callback) {

  //ignore the root file which should be an actual file
  if (!this.current) {
    return callback(null, entry);
  }

  var options = extend({

    //start looking relative to the parent file entry
    basedir: path.dirname(this.current),

    //look for SASS files
    extensions: ['.scss', '.sass', '.css'],

    //allow packages to define a SASS entry file using the "main.scss", "main.sass" or "main.css" keys
    packageFilter: function(pkg) {
      pkg.main = pkg['main.scss'] || pkg['main.sass'] || pkg['main.css'];
      return pkg;
    }

  });

  resolve(entry.file, options, function(err, file) {
    if (err) return callback(err);

    callback(null, {
      file:     file,
      original: entry.file
    });

  });

};