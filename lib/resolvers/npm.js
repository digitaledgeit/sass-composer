var debug   = require('debug')('sass-composer:resolver:npm');
var path    = require('path');
var extend  = require('extend');
var resolve = require('resolve');

/**
 * Resolve a file using NPM's resolution method
 * @param {Object}                    context
 * @param {string}                    [context.entry]       The path of the entry file
 * @param {string}                    [context.current]     The path of the currently executing file
 * @param {string}                    [context.file]        The path of the file being resolved
 * @param {string}                    [context.contents]    The contents of the file being resolved
 * @param {function(Error, Object)}   callback
 */
module.exports = function(context, callback) {

  //we don't need to resolve the entry file because it should be an actual file
  if (!context.current) {
    debug('Skipping entry file.');
    return callback(null, context);
  }

  var options = extend({

    //start looking in the directory of the "currently executing" stylesheet
    basedir: path.resolve(path.dirname(context.source), path.dirname(context.current)), //FIXME: not sure if resolving the directory of the current executing file, relative to the entry directory will always work

    //look for SASS files
    extensions: ['.scss', '.sass', '.css'],

    //allow packages to define a SASS entry file using the "main.scss", "main.sass" or "main.css" keys
    packageFilter: function(pkg) {
      pkg.main = pkg['main.scss'] || pkg['main.sass'] || pkg['main.css'];
      return pkg;
    }

  });

  debug('Looking for '+context.file+' from '+context.current+'.');

  resolve(context.file, options, function(err, file) {
    if (err) return callback(err, null);
    context.original  = context.file;
    context.file      = file;
    callback(null, context);

  });

};