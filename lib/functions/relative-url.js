var path = require('path');
var sass = require('node-sass');

module.exports = {
  'relative-url($path)': function(url) {
    var abs  = path.resolve(path.dirname(this.current || this.root), url.getValue()); //TODO: need the calling fn
    var rel  = path.relative(path.dirname(this.root), (abs));
    return sass.types.String('url("'+rel+'")');
  }
};