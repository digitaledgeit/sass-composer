var imported = {};

/**
 * Prevent files which have already been imported from being imported again
 * @param {Object}                    context
 * @param {string}                    [context.entry]       The path of the entry file
 * @param {string}                    [context.current]     The path of the currently executing file
 * @param {string}                    [context.file]        The path of the file being resolved
 * @param {string}                    [context.contents]    The contents of the file being resolved
 * @param {function(Error, Object)}   callback
 */
module.exports = function(context, callback) {

  //create/empty the cache when we process the entry file
  if (!context.current) {
    imported[context.source] = [];
  }

  //check if the file is already cached
  if (imported[context.source] && imported[context.source][context.file]) {

    //prevent the file from being compiled again
    context.contents = '';

  } else {

    //remember the file has already been cached
    imported[context.source][context.file] = true;

  }

  callback(null, context);
};