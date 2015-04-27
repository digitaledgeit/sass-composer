# sass-composer

Build your stylesheets as if you're using browserify, using SASS and NPM's resolve method .

## Installation

    npm install --save sass-composer

## Usage

Write some SASS

    //import SASS/SCSS/CSS files from an external NPM module
    @import "digitaledgeit-breakpoints";
    
    //import SASS/SCSS/CSS files from the local NPM module
    @import "./fonts"
    
    //you can access a $__dirname and $__filename variable in each imported file
    
    //you can use asset-url('./img/my-asset.png') in your stylesheets and your asset will be copied into the destination directory
    
    //now go write some more SASS

Compile using the CLI

    sass-composer index.scss -o index.css

Or compile using the JS API

    var fs = require('fs');
    var composer = require('sass-composer');
    
    var input   = __dirname+'/index.scss';
    var output  = __dirname+'/index.css';
    
    composer()
      .source(input)
      .destination(output)
      .compose(function(err) {
        if (err) return console.log(err);
        console.log('Composed `index.scss` to CSS and wrote CSS to `index.css`.');
      })
    ;
    
## TODO

- [watch](https://github.com/paulmillr/chokidar)