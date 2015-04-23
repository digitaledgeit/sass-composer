var extend = require('extend');
var resolve = require('resolve');

/**
 * Resolve a package path to a file path
 * @param   {string}    path        The package path
 * @param   {Object}    [options]   The resolver options
 * @param   {function}  callback    The resolver callback
 */
module.exports = function(path, options, callback) {

  if (arguments.length < 3) {
    callback  = options;
    options   = {};
  }

  options = extend({

    //look for SASS files
    extensions: ['.scss', '.sass', '.css'],

    //allow packages to define a SASS entry file using the "main.scss", "main.sass" or "main.css" keys
    packageFilter: function(pkg) {
      pkg.main = pkg['main.scss'] || pkg['main.sass'] || pkg['main.css'];
      return pkg;
    }

  }, options);

  resolve(path, options, function(err, file) {
    callback(err, file);
  });

};