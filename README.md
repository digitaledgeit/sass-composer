# sass-composer

[![Circle CI](https://circleci.com/gh/digitaledgeit/sass-composer.svg?style=svg)](https://circleci.com/gh/digitaledgeit/sass-composer)

[![Coverage Status](https://coveralls.io/repos/digitaledgeit/sass-composer/badge.svg?branch=master&service=github)](https://coveralls.io/github/digitaledgeit/sass-composer?branch=master)

Compose CSS from SASS files using Node's algorithm to resolve `@import`s. Plus more goodness.

####  Why not [component](https://github.com/componentjs/component) or [rework-npm](https://www.npmjs.com/package/rework-npm)?

Because `component` and `rework-npm` don't use SASS, and SASS makes it easy to keep your styles semantic and DRY.

#### Why not [duo](http://duojs.org/), or [sassify](https://www.npmjs.com/package/sassify)?

Because with `duo` and `sassify` your SASS/SCSS/CSS can't use variables, functions, mixins or extend classes defined in one module from another module.

Because with `sassify` you must require your SASS in your JS files. `sass-composer` builds a separate CSS file.

## Installation

    npm install --save sass-composer

## Usage

Write some SASS:

```scss
//import SASS/SCSS/CSS files from an external NPM module
@import "normalize";
@import "sass-breakpoints";

//import SASS/SCSS/CSS files from the local NPM module
@import "./fonts"

//you can use the $__dirname and $__filename variables in each imported file

//by default, assets url('./img/my-asset.png') will be copied into the destination directory

//now go write some more SASS...
@include breakpoint('xs') {
  .foo { content: "bar" }
}
```

Compose CSS using the CLI:

    sass-composer index.scss -o index.css

Compose CSS using the API:

```js
var fs = require('fs');
var path = require('path');
var composer = require('sass-composer');

var input   = __dirname+'/index.scss';
var output  = __dirname+'/build/build.css';

composer()
  .entry(input)
  .use(composer.plugins.url({dir: path.dirname(output), copy: true}))
  .compose(function(err, css, stats) {
    if (err) return console.error(err);
    fs.writeFile(output, css, function() {
      if (err) return console.error('Error writing file "'+input+'": \n', err.message);
      console.log('Composed "'+path.basename(input)+'" to "'+path.basename(output)+'".');
    });
  })
;
```

## CLI

    sass-composer <file> [options]
    
- `<file>` - The entry file (SASS/SCSS/CSS) 
- `-o` `--output` - The output path (optional)
- `-w` `--watch` - Watch for changes to the input files and re-compose whenever a file is changed (optional)

## API

### Methods

#### new Composer(options)

Create a new composer.

#### .entry(file)

Set the path of the entry file.

#### .compose([callback]) : Stream

Compose CSS from SASS.
  
#### .importer(fn)

Add an importer. 

The importer function is called for each `@import` statement. It is passed:

- a context object containing :
    - the `.entry` filename, 
    - the `.parent` filename, 
    - the `.file` filename 
    - and optionally the file `.contents`
- a `done` callback 

For example: import files from `./bower_components/`

```js
composer.importer(function(ctx, done) {
  var bower_path = './bower_components/'+ctx.file;
  
  //if the file already exists then leave it as-is
  if (fs.existsSync(ctx.file)) {
    done(null, ctx);
  }
    
  //if the file exists in the bower_components directory then rewrite the filename
  if (fs.existsSync(bower_path)) {
    ctx.file = bower_path;
    done(null, ctx);
  } 

});
```

#### .function(dfn, fn)

Add a SASS function.

For example: return the sum of two numbers

```js
composer.function('sum($a, $b)', function(a, b) {
  return this.types.Number(a.getValue()+b.getValue());
});
```

#### .use(fn)

Use a plugin. Plugins are simple functions and are called on composer instance. 
  
## Importers

### node

Resolve `@import`s according to Node's resolve algorithm. Will resolve SASS, SCSS and CSS files, their dependencies and dependencies of dependencies... you get the point.

### once

Prevent files from being imported multiple times. Waiting on a [node-sass bugfix](https://github.com/sass/node-sass/issues/894)

### fs-loader

Load the file's contents.

### pathname

Prepend and append `$__dirname` and `$__dirname` variables to each file.

## Functions

None as of yet. Go write one!
  
## Plugins
  
### url

Transform URLs. 

The default setting rewrites and copies URLs relative to the entry file e.g. `../img/logo.png` in  `./scss/_brand.scss` imported from `index.scss` gets re-written as `img/logo.png`.

You can write your own transforms to do whatever you want e.g. inline images using datauri, rewrite URLs to a CDN, append a cache busting string etc

## Known issues

- there is no check for different versions of the same module (in JS conflicts are prevented by wraping the modules in anonymous scopes - which do not exist in CSS)

## TODO

- Composer.watch() API
- accept node-sass sass formatting options
- sync and async importers, functions and URL processors
- write way more tests
- handling version conflicts?

## License
    
The MIT License (MIT)

Copyright (c) 2015 James Newell

Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the "Software"), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.