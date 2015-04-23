var path = require('path');

/**
 * Add a function for maintaining relative URLs
 * @param {Object}                    entry
 * @param {string}                    [entry.file]
 * @param {string}                    [entry.contents]
 * @param {function(Error, Object)}   callback
 */
module.exports = function(entry, callback) {

  function relativeUrl(root, current) {
    var url  = path.relative(path.dirname(this.root), (path.dirname(this.current || this.root)))+'/';
    console.log(url);
    return '@function relative-url($path) { @return url("'+url+'#{$path}"); }';
  }

  console.log(relativeUrl(this.root, this.current, 'foo-bar'));

  entry.contents =
    relativeUrl(this.root, this.current)+
    entry.contents+
    relativeUrl(this.root, this.current) //todo use parent path
  ;

  callback(null, entry);

};