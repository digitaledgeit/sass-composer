var path = require('path');

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

  /**
   * render the variables
   * @param   {string} file The currently executing file
   * @returns {string}
   */
  function render(file) {
    var filename  = path.resolve(context.current || context.entry, file);
    var dirname   = path.dirname(filename);

    return [
      '$__dirname: "'+dirname+'";',
      '$__filename: "'+filename+'";'
    ].join('\n');
  }

  context.contents = [
    '//===================================================',
    render(context.file),
    '//===================================================',
    context.contents,
    '//===================================================',
    render(context.current || context.entry),
    '//==================================================='
  ].join('\n');

  callback(null, context);
};