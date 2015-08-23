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
  this.watcher = chokidar.watch(composer.entry(), {});

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

    //Windows doesn't like unwatching and then watching the same file again (https://github.com/paulmillr/chokidar/issues/289) - so figure out what files have been removed and only unwatch those so the effects are less severe
    var unwatch = [];
    for (var i=0; i<self.watchedFiles.length; ++i) {
      if (stats.includedFiles.indexOf(self.watchedFiles[i]) === -1) {
        unwatch.push(self.watchedFiles[i]);
      }
    }
    if (unwatch.length) {
      self.watcher.unwatch(unwatch);
    }

    //Windows doesn't like unwatching and then watching the same file again (https://github.com/paulmillr/chokidar/issues/289)  - so figure out what files have been added and only watch those so the effects are less severe
    var watch = [];
    for (var j=0; j<stats.includedFiles.length; ++j) {
      if (self.watchedFiles.indexOf(stats.includedFiles[j]) === -1) {
        watch.push(stats.includedFiles[j]);
      }
    }
    if (watch.length) {
      self.watcher.add(watch);
    }

    //remember
    self.watchedFiles = stats.includedFiles;

  });
};

module.exports = Watcher;