var debug   = require('debug')('sass-composer:plugin:url');
var path    = require('path');
var fs      = require('fs-extra');

/**
 * A plugin for parsing URLs
 * @constructor
 */
function UrlPlugin(composer, options) {
  this._composer   = composer;
  this._transforms = options.transforms || [];
}

/**
 * Define the `url()` function in SASS. The `url()` function proxies the directory and path to a JS function
 * @param {Object}                    ctx
 * @param {string}                    [ctx.entry]       The path of the entry file
 * @param {string}                    [ctx.parent]      The path of the currently executing file
 * @param {string}                    [ctx.file]        The path of the file being resolved
 * @param {string}                    [ctx.contents]    The contents of the file being resolved
 * @param {function(Error, Object)}   done
 */
UrlPlugin.prototype.importer = function resolver(ctx, done) {

  //we only want to append the function once,
  //so if we're not importing the entry file then we don't care
  if (ctx.parent) {
    return done(null, ctx);
  }

  //if the file contents haven't been loaded then we can't do our job
  if (!ctx.contents) {
    return done(new Error('File contents must be loaded.'), null);
  }

  //prepend the URL function to proxy the directory and path to a JS function
  ctx.contents = [
    '@function url($path) { @return __url($__filename, $path); }',
    ctx.contents
  ].join('\n');

  done(null, ctx);
};

/**
 * Manage the asset
 * @param   {string}    filename The path of the currently executing file
 * @param   {string}    path     The asset path
 * @param   {function}  done     The callback function
 * @returns {string}
 */
UrlPlugin.prototype.function = function(filename, path, done) {
  var self = this, i = 0;

  var ctx = {
    entry: this._composer.entry()
  };

  function next(err, url) {

    if (err) {
      return done(new self._composer.types.Error(err.message));
    }

    if (i >= self._transforms.length || url) {
      return done(new self._composer.types.String('url("'+url+'")'));
    }

    self._transforms[i++].call(ctx, filename, path, next);

  }

  next(null);
};

/**
 * A plugin to resolve the URLs of asset
 * @param   {Object}  options
 * @returns {Function}
 */
module.exports = function(options) {
  return function(composer) {

    options.transforms = options.transforms || [
      module.exports.transforms.relative({
        dir:  options.dir,
        copy: options.copy
      })
    ];

    var plugin = new UrlPlugin(composer, options);
    composer
      .importer(plugin.importer)
      .function('__url($filename, $path)', function(filename, path, done) {
        plugin.function(filename.getValue(), path.getValue(), done);
      })
    ;

  };
};

module.exports.transforms = {

  /**
   * Process URLs and make them relative
   * @param   {Object} options          The options
   * @param   {Object} options.dir      The directory from which URLs should be relative (normally the directory where the CSS is being saved)
   * @param   {Object} [options.copy]   Whether the assets should be copied to the directory
   * @returns {Function}
   */
  relative: function(options) {
    options = options || {};

    var
      dir   = options.dir,
      copy  = typeof options.copy === 'undefined' ? true : options.copy
    ;

    //check a directory was specified
    if (!dir) {
      throw new Error('Missing directory option: `.dir`');
    }

    return function(filename, url, done) {

      var
        rdir    = path.dirname(this.entry),
        fdir    = path.dirname(filename)
      ;

      //compute the relative URL
      var
        src   = path.resolve(fdir, url),
        rel   = path.relative(rdir, src)
      ;

      debug('rewriten: "%s" in "%s" to "%s"', url, path.relative(rdir, filename), rel);

      if (copy) {

        //compute the destination URL
        var dest = path.resolve(dir, rel);

        //copy the file to the destination dir
        fs.copy(src, dest, function(err) {
          if (err) return done(err);
          debug('copied:   "%s" in "%s" to "%s"', url, path.relative(rdir, filename), rel);
          done(null, rel);
        });

      } else {
        done(null, rel);
      }

    };
  }

};
