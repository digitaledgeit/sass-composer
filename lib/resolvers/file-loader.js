var fs = require('fs');

/**
 * Add a function for loading file content
 * @param {Object}                    entry
 * @param {string}                    [entry.file]
 * @param {string}                    [entry.contents]
 * @param {function(Error, Object)}   callback
 */
module.exports = function(entry, callback) {

  fs.readFile(entry.file, function(err, buffer) {
    if (err) return callback(err);
    entry.contents = buffer.toString();
    callback(null, entry);

  });

};