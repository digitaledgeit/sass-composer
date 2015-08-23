var path          = require('path');
var through       = require('through2');
var concat        = require('concat-stream');
var readonly      = require('read-only-stream');
var extend        = require('extend');
var sass          = require('node-sass');
var util          = require('util');
var EventEmitter  = require('events').EventEmitter;

//the default options
var defaults = {
  entry: null,
  importers: [
    require('./importers/node'),
    //require('./importers/once'), //FIXME: causing first AND second imports to be empty https://github.com/sass/node-sass/issues/894
    require('./importers/fs-loader'),
    require('./importers/pathname')
  ],
  functions: extend(
    {}
  ),
  plugins: [
    //require('./plugins/url')()
  ]
};

/**
 * A stylesheet composer
 * @constructor
 * @param   {Object}            [options]
 * @param   {string}            [options.entry]
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
  this._entry = options.entry;

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

Composer.plugins      = {};
Composer.plugins.url  = require('./plugins/url');

/**
 * Get/set the path of the SASS entry file
 * @param   {string}  [file]  The path of a SASS file
 * @returns {string|Composer}
 */
Composer.prototype.entry = function(file) {
  if (arguments.length === 0) {
    return this._entry;
  } else {
    this._entry = file;
    return this;
  }
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
 * Add a SASS function
 * @param   {string}    dfn   The function definition
 * @param   {function}  fn    The function
 * @returns {Composer}
 */
Composer.prototype.function = function(dfn, fn) {
  this._functions[dfn] = fn.bind(this);
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
 * @param   {Object}                  ctx
 * @param {string}                    [ctx.entry]       The path of the entry file
 * @param {string}                    [ctx.parent]      The path of the currently executing file
 * @param {string}                    [ctx.file]        The path of the file being resolved
 * @param {string}                    [ctx.contents]    The contents of the file being resolved
 * @param   {function(Error, Object)} callback
 * @returns {Composer}
 */
Composer.prototype.resolve = function(ctx, callback) {
  var self = this, i = 0;

  function next(err, ctx) {

    if (err) {
      return callback(err);
    }

    if (i >= self._importers.length) {
      return callback(null, ctx);
    }

    self._importers[i++].call(self, ctx, next);

  }

  next(null, ctx);

  return this;
};

/**
 * Compose a SASS file into a stylesheet
 * @param   {function(Error, Buffer, Object)}   [callback]
 * @returns {Stream.Writable}
 */
Composer.prototype.compose = function(callback) {
  var self = this, entry = path.resolve(this._entry);

  var includedFiles = [];

  var stream = through();
  var output = readonly(stream);

  function end(err, css, stats) {
    process.nextTick(function() {

      //setup the callback to handle events
      if (callback) {
        output.on('error', callback);
        output.pipe(concat(function(css) {
          callback(null, css, stats);
        }));
      }

      if (err) {
        stream.emit('error', err);
        stream.end(null);
      } else {
        stream.end(css);
      }

    });
  }

  this.resolve(
    {
      entry:    entry,
      parent:   null,
      file:     entry
    },
    function(err, ctx) {
      if (err) return end(err);
      includedFiles.push(ctx.file);

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
                includedFiles.push(ctx.file);

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
          if (err) return end(err);

          //get the CSS
          var
            css   = result.css,
            stats = result.stats
          ;
          stats.includedFiles = includedFiles;

          //call the callback
          return end(err, css, stats);

        }
      );

    }
  );

  return output;
};

module.exports = Composer;