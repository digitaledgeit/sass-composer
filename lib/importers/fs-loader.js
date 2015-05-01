var fs = require('fs');
var debug = require('debug')('sass-composer:importer:fs-loader');

/**
 * Load contents from the file system
 * @param {Object}                    ctx
 * @param {string}                    [ctx.entry]       The path of the entry file
 * @param {string}                    [ctx.parent]      The path of the currently executing file
 * @param {string}                    [ctx.file]        The path of the file being imported
 * @param {string}                    [ctx.contents]    The contents of the file being imported
 * @param {function(Error, Object)}   done
 */
module.exports = function(ctx, done) {

  //if contents are already loaded then we don't need to do our job
  if (typeof(ctx.contents) === 'string') {
    return done(null, ctx);
  }

  //load the contents from file
  fs.readFile(ctx.file, function(err, buffer) {
    if (err) return done(err, null);
    debug('loaded: %s', ctx.file);
    ctx.contents = buffer.toString();
    done(null, ctx);
  });

};
