var chokidar = require('chokidar');
var Composer = require('..');

/**
 * A watcher
 * @constructor
 * @param   {Composer|Object} [composer]
 *
 */
function Watcher(composer) {

  if (!(this instanceof Watcher)) {
    return new Watcher(composer);
  }

  //if we're not given a composer, create a composer with the composer options
  if (!(composer instanceof Composer)) {
    composer = new Composer(composer);
  }

  /**
   * The composer
   * @private
   * @type {Composer}
   */
  this.composer = composer;

  /**
   * The watcher
   * @type {chokidar}
   */
  this.watcher = chokidar.watch(composer.entry(), {cwd: '.'}); //added cwd option as hack for https://github.com/paulmillr/chokidar/issues/390

  /**
   * The watched files
   * @type {Array.<string>}
   */
  this.watchedFiles = [];

}

Watcher.prototype.on = function(event, listener) {
  this.watcher.on(event, listener);
  return this;
};

Watcher.prototype.once = function(event, listener) {
  this.watcher.once(event, listener);
  return this;
};

Watcher.prototype.off = function(event, listener) {
  this.watcher.off(event, listener);
  return this;
};

/**
 * Close the watcher
 * @returns {Watcher}
 */
Watcher.prototype.close = function() {
  if (this.watcher) {
    this.watcher.close();
  }
  return this;
};

/**
 * Compose a file and start watching the imported files
 * @returns {Stream}
 */
Watcher.prototype.compose = function(callback) {
  var self = this;
  return this.composer.compose(function(err, css, stats) {
    if (err) return; //don't need to change the files we're watching

    self.watcher.unwatch(self.watchedFiles);
    self.watcher.add(stats.includedFiles);

    //remember
    self.watchedFiles = stats.includedFiles;

  });
};

module.exports = Watcher;