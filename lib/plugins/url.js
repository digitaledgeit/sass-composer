var debug   = require('debug')('sass-composer:plugin:url');
var path    = require('path');
var fs      = require('fs-extra');

function copyFile(srcFile, destFile, callback) {

  //don't overwrite the file with itself cause that'll break the file
  if (srcFile === destFile) {
    return callback(null, false);
  }

  //copy the file to the destination dir
  fs.copy(srcFile, destFile, function(err) {
    if (err) return callback(err, false);
    callback(null, true);
  });

}

function hashFile(file, callback) {
  var fs = require('fs');
  var crypto = require('crypto');
  var fd = fs.createReadStream(file);
  var hash = crypto.createHash('sha1');
  hash.setEncoding('hex');

  fd.on('end', function() {
    hash.end();
    callback(null, hash.read());
  });

  fd.on('error', callback);

  fd.pipe(hash);
}

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
      return done(new self._composer.types.Error(String(err)));
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
   * Process URLs and make them relative to the destination directory
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

      //ignore external URLs
      if (/^http|https|data+:/.test(url)) {
        return done(null, url);
      }

      var
        rdir    = path.dirname(this.entry),
        fdir    = path.dirname(filename)
      ;

      //compute the relative path
      var
        src   = path.resolve(fdir, url),
        rel   = path.relative(rdir, src).replace(/\\/g, '/')
      ;

      debug('rewritten: "%s" in "%s" to "%s"', url, path.relative(rdir, filename), rel);

      //strip any querystrings or anchors from the URL

      if (copy) {

        //compute the destination URL
        var
          parser    = require('url'),
          srcFile   = path.resolve(fdir, parser.parse(url).pathname),
          destFile  = path.resolve(dir, parser.parse(rel).pathname)
        ;

        //copy the file to the destination dir
        copyFile(srcFile, destFile, function(err, copied) {
          if (copied) {
            debug('copied:   "%s" in "%s" to "%s"', url, path.relative(rdir, filename), rel);
          } else {
            debug('exists:    "%s" in "%s" to "%s"', url, path.relative(rdir, filename), rel);
          }
          done(err, rel);
        });

      } else {
        done(null, rel);
      }

    };
  },

  /**
   * Process URLs and hash the filenames in the destination directory
   * @param   {Object} options          The options
   * @param   {Object} options.dir      The directory from which URLs should be relative (normally the directory where the CSS is being saved)
   * @param   {Object} [options.copy]   Whether the assets should be copied to the directory
   * @returns {Function}
   */
  hashed: function(options) {
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

      //ignore external URLs
      if (/^http|https|data+:/.test(url)) {
        return done(null, url);
      }

      var
        rdir    = path.dirname(this.entry),
        fdir    = path.dirname(filename)
      ;

      //compute the destination url
      var parser = require('url');
      var
        srcFile     = path.resolve(fdir, parser.parse(url).pathname)
      ;

      //compute a hash of the file contents to use for the destination file name
      hashFile(srcFile, function(err, contentsHash) {
        var rel   = contentsHash+path.extname(parser.parse(url).pathname);

        debug('rewritten: "%s" in "%s" to "%s"', url, path.relative(rdir, filename), rel);

        if (copy) {

          //compute the destination URL
          var
            srcFile = path.resolve(fdir, parser.parse(url).pathname),
            destFile = path.join(dir, rel)
          ;

          //copy the file to the destination dir
          //TODO: check if the file already exists and don't copy it because the hash is the same?
          copyFile(srcFile, destFile, function (err, copied) {
            if (copied) {
              debug('copied:   "%s" in "%s" to "%s"', url, path.relative(rdir, filename), rel);
            } else {
              debug('exists:    "%s" in "%s" to "%s"', url, path.relative(rdir, filename), rel);
            }
            done(err, rel);
          });

        } else {
          done(null, rel);
        }

      });

    };
  }

};

