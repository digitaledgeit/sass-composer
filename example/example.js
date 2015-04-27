var fs = require('fs');
var composer = require('..');

var input   = __dirname+'/index.scss';
var output  = __dirname+'/build/build.css';

composer()
  .source(input)
  .destination(output)
  .compose(function(err, css) {
    if (err) return console.log(err);
    console.log('Composed `index.scss` to CSS and wrote CSS to `index.css`.');
  })
;