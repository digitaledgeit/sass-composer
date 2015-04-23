var path = require('path');

/**
 * Add a function for maintaining relative URLs
 * @param {Object}                    entry
 * @param {string}                    [entry.file]
 * @param {string}                    [entry.contents]
 * @param {function(Error, Object)}   callback
 */
module.exports = function(entry, callback) {

  function relativeUrl(to, from) {
    var url  = path.relative(path.dirname(from), path.dirname(to));
    if (url.length) {
      url += '/';
    }
    return '@function relative-url($path) { @return url("'+url+'#{$path}"); }';
  }

  entry.contents =
    relativeUrl(entry.file, this.root)+
    entry.contents+
    relativeUrl(this.current, this.root)
  ;

  callback(null, entry);

};