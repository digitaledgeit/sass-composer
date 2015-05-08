var fs = require('fs');
var path = require('path');
var composer = require('..');
var url = require('../lib/plugins/url');

var input   = __dirname+'/index.scss';
var output  = __dirname+'/build/build.css';

composer()
  .entry(input)
  .use(url({dir: path.dirname(output), copy: true}))
  .compose()
    .pipe(fs.createWriteStream(output)) //will fail if the output directory isn't created in time by the URL plugin (if at all)
    .on('error', function(err) {
      console.error('Error writing file "'+input+'": \n', err.message);
    })
    .on('finish', function() {
      console.log('Composed "'+path.basename(input)+'" to "'+path.basename(output)+'".');
    })
;