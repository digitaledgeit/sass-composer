var sass = require('node-sass');

var i = 0;

sass.render(
  {
    data: '@import "foobar"; @import "foobar";',
    importer: function(file, prev, cb) {
      console.log(file, prev);

      if (i++ === 0) {
        cb({contents: '.foobar {color: red;}'});
      } else {
        cb({contents: ''});
      }

    }
  },
  function(err, result) {
    if (err) {
      console.log(err);
    } else {
      console.log(result.css.toString());
    }
  }
);