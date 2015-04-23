var path          = require('path');
var sass          = require('node-sass');
var resolver      = require('./lib/resolver');
var loader        = require('./lib/loader');
var transformer   = require('./lib/transformer');

module.exports = function(file, transforms, callback) {
  var root = file;
  //todo: load the contents of the top level file and transform them

  sass.render(
    {

      file: file,

      importer: function(current, parent, done) {

        //resolve the current path to a file relative to the parent path
        resolver(current, {basedir: path.dirname(parent)}, function(err, current) {
          if (err) return done(err);

          //load the contents from the current (resolved) path
          loader(current, function(err, contents) {
            if (err) return done(err);

            //transform the contents from the target path
            var data = {
              root:     root,
              parent:   parent,
              current:  current,
              contents: contents.toString()
            };
            transformer(data, transforms, function(err, result) {
              if (err) return done(err);
              done(result);
            });

          });

        });

      }

      //todo: have a once loader which just returns empty contents
      //todo: create a plugin pipeline
      //todo: create a plugin to set correct URLs
      //- either using regex or by prefix and suffixing all files with a url function

    },
    callback
  );
};
