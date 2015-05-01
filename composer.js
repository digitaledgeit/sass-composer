var fs            = require('fs');
var path          = require('path');
var extend        = require('extend');
var sass          = require('node-sass');
var util          = require('util');
var EventEmitter  = require('events').EventEmitter;

//the default options
var defaults = {
  importers: [
    require('./lib/importers/node'),
    //require('./lib/importers/once'), //FIXME: causing first AND second imports to be empty https://github.com/sass/node-sass/issues/894
    require('./lib/importers/fs-loader'),
    require('./lib/importers/pathname')
  ],
  functions: extend(
    {}
  ),
  plugins: [
    require('./lib/plugins/asset-url')()
  ]
};

/**
 * A stylesheet composer
 * @constructor
 * @param   {Object}            [options]
 * @param   {string}            [options.entry]
 * @param   {string}            [options.destination]
 * @param   {Array.<function>}  [options.importers]
 * @param   {Array.<Object>}    [options.functions]
 * @param   {Array.<function>}  [options.plugins]
 * @returns {Composer}
 */
function Composer(options) {

  if (!(this instanceof Composer)) {
    return new Composer(options);
  }

  //extend the super class
  EventEmitter.call(this);

  //merge options with the defaults
  options = extend(defaults, options);

  /** @private */
  this._source = options.entry;

  /** @private */
  this._destination = options.destination;

  /** @private */
  this._importers = [];

  /** @private */
  this._functions = {};

  // --- apply the extension points to the composer ---

  for (var i=0; i<options.importers.length; ++i) {
    this.importer(options.importers[i]);
  }
  for (var sig in options.functions) {
    this.function(sig, options.functions[sig]);
  }
  for (var i=0; i<options.plugins.length; ++i) {
    this.use(options.plugins[i]);
  }

}
util.inherits(Composer, EventEmitter);

Composer.prototype.types = sass.types;

/**
 * Get/set the path to the SASS source file
 * @param   {string}  [file]  The path to a SASS file
 * @returns {string|Composer}
 */
Composer.prototype.source = function(file) {
  if (arguments.length === 0) {
    return this._source;
  } else {
    this._source = file;
  }
  return this;
};

/**
 * Get/set the path to write the compiled SASS to a file
 * @param   {string}  [file]  The path write the compiled SASS
 * @returns {string|Composer}
 */
Composer.prototype.destination = function(file) {
  if (arguments.length === 0) {
    return this._destination;
  } else {
    this._destination = file;
  }
  return this;
};

/**
 * Add an importer
 * @param   {function(Object, function)} importer The importer function
 * @returns {Composer}
 */
Composer.prototype.importer = function(importer) {
  this._importers.push(importer);
  return this;
};

/**
 * Add a function
 * @param   {string}    sig   The function signature
 * @param   {function}  fn    The function body
 * @returns {Composer}
 */
Composer.prototype.function = function(sig, fn) {
  this._functions[sig] = fn.bind(this);
  return this;
};

/**
 * Use a plugin
 * @param   {function(Composer)} plugin The plugin
 * @returns {Composer}
 */
Composer.prototype.use = function(plugin) {
  plugin(this);
  return this;
};

/**
 * Resolve the entry to a file path and or content
 * @private
 * @param   {Object}                  entry
 * @param   {string}                  [entry.file]
 * @param   {string}                  [entry.contents]
 * @param   {function(Error, Object)} callback
 * @returns {Composer}
 */
Composer.prototype.resolve = function(entry, callback) {
  var self = this, i = 0;

  function next(err, entry) {

    if (err) {
      return callback(err);
    }

    if (i >= self._importers.length) {
      return callback(null, entry);
    }

    self._importers[i++].call(self, entry, next);

  }

  next(null, entry);

  return this;
};

/**
 * Compose a SASS file into a stylesheet
 * @param   {Object}                    [options]
 * @param   {function(Error, Object)}   callback
 * @returns {Composer}
 */
Composer.prototype.compose = function(options, callback) {
  var self = this, entry = path.resolve(this._source);

  if (typeof(options) === 'function') {
    callback  = options;
    options   = {};
  }

  //merge options with the defaults
  options = extend({
    write: true
  }, options);

  this.resolve(
    {
      entry:    entry,
      parent:  null,
      file:     entry
    },
    function(err, ctx) {
      if (err) return callback(err);

      //prevent node-sass error with empty contents
      if (typeof(ctx.contents) === 'string' && ctx.contents.length === 0) {
        return callback(null, ctx.contents); //node-sass tries to use a file path if we pass in an empty string => "File context created without an input path"
      }

      sass.render(
        {

          file:       ctx.file,
          data:       ctx.contents,

          context:    self,
          functions:  self._functions,

          importer:   function(file, parent, done) {
            self.resolve(
              {
                entry:    entry,
                parent:   parent,
                file:     file
              },
              function(err, ctx) {
                if (err) return done(err);

                //favour contents over files when provided
                if (typeof(ctx.contents) === 'string') {
                  done({
                    file:     ctx.file,
                    contents: ctx.contents
                  });
                } else {
                  done({
                    file:     ctx.file
                  });
                }

              }
            );
          }

        },
        function(err, result) {
          if (err) return callback(err);

          var css = result.css.toString();

          if (self.destination() && options.write) {

            //write to disk and then call the callback
            fs.writeFile(self.destination(), css, function(err) {
              if (err) return callback(err, null);
              callback(err, css);
            });

          } else {

            //call the callback
            callback(null, css);

          }

        }
      );

    }
  );

  return this;
};

module.exports = Composer;