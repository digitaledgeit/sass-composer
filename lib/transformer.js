
module.exports = function(data, transforms, callback) {

  for (var i=0; i<transforms.length; ++i) {
    data = transforms[i](data);
  }

  callback(null, data);
};