var path = require('path');
var debug = require('debug')('sass-composer:resolver:pathname');

/**
 * Embed the file and directory path names of the "currently executing" stylesheet
 * @param {Object}                    context
 * @param {string}                    [context.entry]       The path of the entry file
 * @param {string}                    [context.current]     The path of the currently executing file
 * @param {string}                    [context.file]        The path of the file being resolved
 * @param {string}                    [context.contents]    The contents of the file being resolved
 * @param {function(Error, Object)}   callback
 */
module.exports = function(context, callback) {

  //check the file contents have already been loaded otherwise we can't do our job
  if (typeof(context.contents) !== 'string') {
    return callback(new Error('File contents must be loaded so we can inject $__dirname and $__filename.'), null);
  }

  var curfile   = path.resolve(path.dirname(context.source), context.current || '');
  var curdir    = path.dirname(curfile);
  var filename  = path.resolve(curdir, context.file);
  var dirname   = path.dirname(filename);

  context.contents = [
    '//===================================================',
    '$__dirname: "'+dirname+'";',
    '$__filename: "'+filename+'";',
    '//===================================================',
    context.contents,
    '//===================================================',
    '$__dirname: "'+curdir+'";',
    '$__filename: "'+curfile+'";',
    '//==================================================='
  ].join('\n');

  callback(null, context);
};