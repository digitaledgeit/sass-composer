# sass-composer

Compose CSS from SASS files using Node's algorithm to resolve `@import`s. And even more goodness.

## Installation

    npm install --save sass-composer

## Usage

Write some SASS:

    //import SASS/SCSS/CSS files from an external NPM module
    @import "sass-named-breakpoints";
    
    //import SASS/SCSS/CSS files from the local NPM module
    @import "./fonts"
    
    //you can access a $__dirname and $__filename variable in each imported file
    
    //by default assets url('./img/my-asset.png') will be copied into the destination directory
    
    //now go write some more SASS

Compose CSS using the CLI:

    sass-composer index.scss -o index.css

Compose CSS using the API:

    var fs = require('fs');
    var path = require('path');
    var composer = require('sass-composer');
    var url = require('sass-composer/lib/plugins/url');
    
    var input   = __dirname+'/index.scss';
    var output  = __dirname+'/build/build.css';
    
    composer()
      .entry(input)
      .use(url({dir: path.dirname(output)}))
      .compose(function(err, css) {
        if (err) return console.error(err);
        fs.writeFile(output, css, function() {
          if (err) return console.error('Error writing file "'+input+'": \n', err.message);
          console.log('Composed "'+path.basename(input)+'" to "'+path.basename(output)+'".');
        });
      })
    ;
    
## CLI

    sass-composer <file> [options]
    
- <file> - The entry file (SASS/SCSS/CSS) 
- `-o` `--output` - The output path (optional)

## API

### Methods

#### new Composer(options)

Create a new composer

#### .entry(file)

Set the path of the entry file

#### .compose(callback)

Compose CSS from SASS
  
#### .importer(fn)
#### .function(dfn, fn)
#### .plugin(fn)
  
### Events

## TODO

- [watch](https://github.com/paulmillr/chokidar)
- sync and async importers, functions and URL processors

## License
    
The MIT License (MIT)

Copyright (c) 2015 James Newell

Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the "Software"), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.