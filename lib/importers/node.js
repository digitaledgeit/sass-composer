var debug   = require('debug')('sass-composer:importer:node');
var path    = require('path');
var extend  = require('extend');
var resolve = require('resolve');

/**
 * Resolve a module or file name using node's resolve method
 * @param {Object}                    ctx
 * @param {string}                    [ctx.entry]       The path of the entry file
 * @param {string}                    [ctx.parent]      The path of the currently executing file
 * @param {string}                    [ctx.file]        The path of the file being resolved
 * @param {string}                    [ctx.contents]    The contents of the file being resolved
 * @param {function(Error, Object)}   done
 */
module.exports = function(ctx, done) {

  //we don't need to resolve the entry file because it should already be an actual file
  if (!ctx.parent) {
    debug('skipped: %s (entry)', ctx.file);
    return done(null, ctx);
  }

  var options = extend({

    //start looking in the directory of the "currently executing" stylesheet
    basedir: path.resolve(path.dirname(ctx.entry), path.dirname(ctx.parent)),

    //look for SASS and CSS files
    extensions: ['.scss', '.sass', '.css'],

    //allow packages to define a SASS entry file using the "main.scss", "main.sass" or "main.css" keys
    packageFilter: function(pkg) {
      pkg.main = pkg['main.scss'] || pkg['main.sass'] || pkg['main.css'] || pkg['style'];
      return pkg;
    }

  });

  resolve(ctx.file, options, function(err, file) {
    if (err) return done(err, null);

    debug('resolved: %s => %s', ctx.file, file);

    ctx.original  = ctx.file;
    ctx.file      = file;

    done(null, ctx);
  });

};