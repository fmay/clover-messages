
// Compile all files from directory

const { exec } = require('child_process');
var fs = require('fs');

var srcDir = __dirname + '../src/base-messages';
var tempDir = __dirname + '../temp/base-messages';

var filenames = fs.readdirSync(srcDir);

filenames.forEach(function (filename) {
	var matches = /^([^.]+).md$/.exec(filename);
	if (!matches) {
		return;
	}
	var name = matches[1];
  	eCmd = 'marked -o ' + tempDir + '/' + matches[1] + '.html ' + srcDir + '/' + matches[1] + '.md'
	console.log(eCmd);  	
	exec(eCmd, (err, stdout, stderr) => {
		if (err) {
			// node couldn't execute the command
			console.log("Error");
			return;
		}  
	});  
});


