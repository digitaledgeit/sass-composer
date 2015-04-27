var debug   = require('debug')('sass-composer:plugin:asset-url');
var path    = require('path');
var fs      = require('fs-extra');
var mkdirp  = require('mkdirp');

/**
 * A plugin
 * @constructor
 */
function AssetUrl(options, composer) {
  this._composer = composer;
}

/**
 * Prepend the `asset-url()` function to the entry file. The `asset-url()` function proxies the directory and asset path to a JavaScript function
 * @param {Object}                    context
 * @param {string}                    [context.entry]       The path of the entry file
 * @param {string}                    [context.current]     The path of the currently executing file
 * @param {string}                    [context.file]        The path of the file being resolved
 * @param {string}                    [context.contents]    The contents of the file being resolved
 * @param {function(Error, Object)}   callback
 */
AssetUrl.prototype.resolver = function resolver(context, callback) {

  //if we're not resolving the entry file then we don't care
  if (context.current) {
    return callback(null, context);
  }

  //if the contents haven't been loaded then we can't do our job
  if (!context.contents) {
    return callback(new Error('File contents must be loaded.'), null);
  }

  //prepend the function to proxy the directory path to a JS function
  context.contents = [
    '@function asset-url($path) { @return __asset-url($__dirname, $path); }',
    context.contents
  ].join('\n');

  callback(null, context);
};

/**
 * Returns the asset path
 * @param   {string} entry    The path of the entry file
 * @param   {string} dirname  The dir path of the currently executing file
 * @param   {string} asset    The path of the asset
 * @returns {string}
 */
AssetUrl.prototype.function = function(entry, dirname, asset) {
  var dest = this._composer.destination();

  //check we have an output destination to make the assets relative to
  if (typeof(dest) !== 'string') {
    throw new Error('asset-url: A destination must be set.');
  }

  //resolve the URLs
  var src  = path.resolve(dirname, asset);
  var rel  = path.relative(path.dirname(entry), src);
  var dest = path.resolve(path.dirname(dest), rel);

  //if (this.options.copy) {
    debug('Copying asset '+rel+' to '+path.dirname(dest));
    mkdirp.sync(path.dirname(dest));
    fs.copySync(src, dest);
  //}

  return 'url("'+rel+'")';
};

/**
 * A plugin to resolve the URLs of asset
 * @param   {Object}  options
 * @returns {Function}
 */
module.exports = function(options) {
  return function(composer) {

    var plugin = new AssetUrl(options, composer);
    composer
      .resolver(plugin.resolver)
      .function('__asset-url($dirname, $path)', function(dirname, path) {
        //TODO: this._entry isn't the resolved entry
        return new this.types.String(plugin.function(this._source, dirname.getValue(), path.getValue()));
      })
    ;

  };
};