# sass-composer

Compose your stylesheets from SASS files using NPM. Just like with Browserify.

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

## License
    
The MIT License (MIT)

Copyright (c) 2014 James Newell

Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the "Software"), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.