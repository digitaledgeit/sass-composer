var fs = require('fs');

module.exports = function(file, callback) {
  //TODO: import once
  fs.readFile(file, callback);
};