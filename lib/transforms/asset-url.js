var path = require('path');

module.exports = function(data) {

  var rootDir = path.dirname(data.root);
  var parentDir = path.relative(rootDir, path.dirname(data.current));
  var currentDir = path.relative(rootDir, path.dirname(data.current));

  console.log(rootDir, parentDir, currentDir);

  data.contents = '@function asset-url($relative) { @return url("'+currentDir+'#{$relative}");}'+data.contents;
  data.contents += '@function asset-url($relative) { @return url("'+parentDir+'#{$relative}");}';
  return data;
};