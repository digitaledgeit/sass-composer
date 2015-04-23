var imported = {};

/**
 * Prevent files that have already been imported from being imported
 * @param {Object}                    entry
 * @param {string}                    [entry.file]
 * @param {string}                    [entry.contents]
 * @param {function(Error, Object)}   callback
 */
module.exports = function(entry, callback) {

  //create or empty the cache on the first include
  if (!this.current) {
    imported[this.root] = [];
  }

  //check if the file is already cached
  if (imported[this.root] && imported[this.root][entry.file]) {

    //prevent the file from being compiled again
    entry.contents = '';
    entry.filename = 'already-imported:' + entry.file;

  } else {

    //remember the file has already been cached
    imported[this.root][entry.file] = true;

  }

  callback(null, entry);
};