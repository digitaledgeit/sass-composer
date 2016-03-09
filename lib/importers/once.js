var debug = require('debug')('sass-composer:importer:once');
var imported = {}; //FIXME: storing global state... gross!

/**
 * Prevent files which have already been imported from being imported again
 * @param {Object}                    ctx
 * @param {integer}                   [ctx.run]         The run id
 * @param {string}                    [ctx.entry]       The path of the entry file
 * @param {string}                    [ctx.parent]      The path of the currently executing file
 * @param {string}                    [ctx.file]        The path of the file being resolved
 * @param {string}                    [ctx.contents]    The contents of the file being resolved
 * @param {function(Error, Object)}   done
 */
module.exports = function(ctx, done) {
  imported[ctx.entry] = imported[ctx.entry] || {};

  //create/empty the cache when we process the entry file
  if (!ctx.parent) {
    imported[ctx.entry] = {}; //FIXME: if there are multiple .compose() methods called
  }

  //check if the file is already cached
  if (imported[ctx.entry] && imported[ctx.entry][ctx.file]) {

    debug('Already imported: %s', ctx.file);

    //prevent the file from being imported again
    ctx.file = 'already-imported:'+ctx.file; //change filename to get around sass caching: https://github.com/sass/node-sass/issues/894
    ctx.contents = '';

  } else {

    debug('importing: %s', ctx.file);

    //remember the file has already been cached
    imported[ctx.entry][ctx.file] = true;

  }

  done(null, ctx);
};