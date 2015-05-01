var fs = require('fs');
var path = require('path');
var composer = require('..');
var url = require('../lib/plugins/url');

var input   = __dirname+'/index.scss';
var output  = __dirname+'/build/build.css';

composer()
  .entry(input)
  .use(url({dir: path.dirname(output), copy: true}))
  .compose(function(err, css, stats) {
    if (err) return console.error(err);
    fs.writeFile(output, css, function() {
      if (err) return console.error('Error writing file "'+input+'": \n', err.message);
      console.log('Composed "'+path.basename(input)+'" to "'+path.basename(output)+'".');
    });
  })
;