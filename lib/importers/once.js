var debug = require('debug')('sass-composer:importer:once');
var imported = {};

/**
 * Prevent files which have already been imported from being imported again
 * @param {Object}                    ctx
 * @param {string}                    [ctx.entry]       The path of the entry file
 * @param {string}                    [ctx.parent]      The path of the currently executing file
 * @param {string}                    [ctx.file]        The path of the file being resolved
 * @param {string}                    [ctx.contents]    The contents of the file being resolved
 * @param {function(Error, Object)}   done
 */
module.exports = function(ctx, done) {

  //create/empty the cache when we process the entry file
  if (!ctx.parent) {
    imported[ctx.entry] = [];
  }

  //check if the file is already cached
  if (imported[ctx.entry] && imported[ctx.entry][ctx.file]) {

    //prevent the file from being compiled again
    ctx.contents = '';

    debug('Already imported: %s', ctx.file);
    return done(new Error(`Already imported: ${ctx.file}`));

  } else {

    //remember the file has already been cached
    imported[ctx.entry][ctx.file] = true;

  }

  done(null, ctx);
};