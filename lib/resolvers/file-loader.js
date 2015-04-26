var fs = require('fs');
var path = require('path');

/**
 * Resolve the file contents
 * @param {Object}                    context
 * @param {string}                    [context.entry]       The path of the entry file
 * @param {string}                    [context.current]     The path of the currently executing file
 * @param {string}                    [context.file]        The path of the file being resolved
 * @param {string}                    [context.contents]    The contents of the file being resolved
 * @param {function(Error, Object)}   callback
 */
module.exports = function(context, callback) {
  var file = path.resolve(path.dirname(context.current), context.file);

  //check the contents haven't already been loaded
  if (typeof(context.contents) === 'string') {
    return callback(null, context);
  }

  //load the contents from file
  fs.readFile(file, function(err, buffer) {
    if (err) return callback(err, null);
    context.contents = buffer.toString();
    callback(null, context);
  });

};
