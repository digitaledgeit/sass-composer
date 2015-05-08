var debug = require('debug')('sass-composer:importer:pathname');
var path = require('path');

/**
 * Escape a string for display in CSS
 * @param   {string} str
 * @returns {string}
 */
function esc(str) {
  return str.replace(/([\[\]\/\\])/g, '\\$1');
}

/**
 * Embed the file and directory path names of the "currently executing" stylesheet
 * @param {Object}                    ctx
 * @param {string}                    [ctx.entry]       The path of the entry file
 * @param {string}                    [ctx.parent]      The path of the currently executing file
 * @param {string}                    [ctx.file]        The path of the file being resolved
 * @param {string}                    [ctx.contents]    The contents of the file being resolved
 * @param {function(Error, Object)}   done
 */
module.exports = function(ctx, done) {

  //ensure the file contents have already been loaded otherwise we can't do our job
  if (typeof(ctx.contents) !== 'string') {
    return done(new Error('File contents must be loaded so I can inject $__dirname and $__filename.'), null);
  }

  var curfile   = path.resolve(path.dirname(ctx.entry), ctx.parent || '');
  var curdir    = path.dirname(curfile);

  var filename  = path.resolve(curdir, ctx.file);
  var dirname   = path.dirname(filename);

  debug('$__dirname:  "%s"', dirname);
  debug('$__filename: "%s"', filename);

  ctx.contents = [
    '//===================================================',
    '$__dirname:  "'+esc(dirname)+'";',
    '$__filename: "'+esc(filename)+'";',
    '//===================================================',
    ctx.contents,
    '//===================================================',
    '$__dirname:  "'+esc(curdir)+'";',
    '$__filename: "'+esc(curfile)+'";',
    '//==================================================='
  ].join('\n');

  done(null, ctx);
};