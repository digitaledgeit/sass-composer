var fs = require('fs');
var composer = require('..');

var input   = __dirname+'/index.scss';
var output  = __dirname+'/index.css';

composer()
  .entry(input)
  .compose(function(err, css) {
    if (err) return console.log(err);

    fs.writeFile(output, css, function(err) {
      if (err) return console.log(err);

      console.log('Composed `index.scss` to CSS and wrote CSS to `index.css`.');

    });

  })
;