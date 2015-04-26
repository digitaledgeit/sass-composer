var fs        = require('fs');
var program   = require('commander');
var composer  = require('..');

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

  //compose the files into a stylesheet
  composer()
    .entry(file)
    .compose(function(err, result) {
      if (err) return console.log('Error processing file "'+file+'": \n', err.message);

      if (program.output) {
        fs.writeFile(program.output, result.css.toString(), function(err) {
          console.log('File written to "'+program.output+'".');
        });
      } else {
        console.log(result.css.toString());
      }

    }
  );

});
