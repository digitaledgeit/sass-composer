var path = require('path');

module.exports = function(file) {
  return path.resolve(path.join(__dirname, '..', 'fixtures', file+'.scss'));
};