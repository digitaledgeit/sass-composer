# sass-composer

Build your SASS files using NPM's resolve method just like browserify.

## Usage

    var composer = require('sass');
    
    composer().compose('./index.scss', function(err, result) {
      console.log(result.css);
    });