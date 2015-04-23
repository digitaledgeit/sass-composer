var path          = require('path');
var extend        = require('extend');
var sass          = require('node-sass');

var defaults = {
  resolvers: [
    require('./lib/resolvers/npm'),
    require('./lib/resolvers/once'),
    require('./lib/resolvers/file-loader'),
    require('./lib/resolvers/fn-relative-url'),
  ],
  functions: extend(
    {}, {}
    //require('./lib/functions/relative-url')
  )
};

/**
 * Compose SASS files
 * @constructor
 * @param   {Object}            [options]
 * @param   {Array.<function>}  [options.resolvers]
 * @param   {Array.<function>}  [options.functions]
 * @returns {Composer}
 */
function Composer(options) {

  if (!(this instanceof Composer)) {
    return new Composer(options);
  }

  options = extend(defaults, options);

  /** @private */
  this.resolvers = options.resolvers;

  /** @private */
  this.functions = options.functions;

  for (var name in this.functions) {
    this.functions[name] = this.functions[name];
  }

}

Composer.prototype.resolve = function(entry, callback) {
  var self = this, i = 0;

  function next(err, entrya) {

    if (err) {
      return callback(err);
    }

    if (i >= self.resolvers.length) {
      return callback(null, entrya);
    }

    self.resolvers[i++].call(self, entrya, next);

  }

  next(null, entry);

  return this;
};

/**
 * Compose a SASS file
 * @param   {string}                    file
 * @param   {function(Error, Object)}   callback
 * @returns {Composer}
 */
Composer.prototype.compose = function(file, callback) {
  var self = this, root = path.resolve(file);

  /**
   * The filename of the root entry file
   * @protected
   */
  this.root = root;

  /**
   * The filename of the currently imported file being compiled (if any)
   * @protected
   */
  this.current = undefined;

  /**
   * A list of the filenames imported during comilation
   *  - node-sass provides a list but we're maintaining our own to remove imported-`once` file names from the list
   * @protected
   */
  this.includedFiles = [];

  this.resolve(
    {
      file: root
    },
    function(err, entry) {
      if (err) return callback(err);

      //update the list of included files
      self.includedFiles.push(entry.file);

      sass.render(
        {


          file:       entry.file,
          contents:   entry.contents,

          context:    self,
          functions:  self.functions,

          importer:   function(file, prev, done) {

            //update the current file
            self.current = prev;

            self.resolve(
              {file: file},
              function(err, entry) {
                if (err) return done(err);

                //update the current file
                self.current = entry.file;

                //favour contents over files when provided
                if (typeof(entry.contents) === 'string') {

                  //update the list of included files if it isn't empty
                  if (entry.contents.length) {
                    self.includedFiles.push(entry.file);
                  }

                  //resume compilation
                  done({contents: entry.contents});

                } else {

                  //update the list of included files
                  self.includedFiles.push(entry.file);

                  //resume compilation
                  done({file: entry.file});

                }

              }
            );
          }

        },
        function(err, result) {
          if (err) return callback(err);

          //patch included files
          result.stats.includedFiles = self.includedFiles;

          //call the callback
          callback(null, result);

        }
      );

    }
  );

  return this;
};

module.exports = Composer;