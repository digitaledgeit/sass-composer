var fs = require('fs');
var sass = require('..');
var program = require('commander');

program
  .usage('<file> [options]')
  .option('-o, --output <file>', 'save output to a file')
  .parse(process.argv)
;

var file = program.args[0] || '';

fs.exists(file, function(exists) {

  if (!exists) {
    return console.log('File "'+file+'" not found.');
  }

  var transforms = [
    require('../lib/transforms/asset-url'),
    require('../lib/transforms/import-once')
  ];
  sass(file, transforms, function(err, result) {
    if (err) return console.log('Error processing file "'+file+'": \n', err.message);

    if (program.output) {
      fs.writeFile(program.output, result.css.toString(), function(err) {
        console.log('File written to "'+program.output+'".');
      });
    } else {
      console.log(result.css.toString());
    }

  });

});
