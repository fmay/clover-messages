
// Markdown compilation

const { exec } = require('child_process');
var fs = require('fs');

var dirName = __dirname.split('/')
dirName.pop()
dirName = dirName.join('/');

var srcDir = dirName + '/src/base-messages';
var tempDir = dirName + '/temp/base-messages';

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


// Copy main html files to temp folder

tempDir = dirName + '/src';

var filenames = fs.readdirSync(tempDir);

filenames.forEach(function (filename) {
	var matches = /^([^.]+).html$/.exec(filename);
	if (!matches) {
		return;
	}
	var name = matches[1];
  	eCmd = 'cp ' + dirName + '/src/' + matches[1] + '.html ' + dirName + '/temp';
	console.log(eCmd);  	
	exec(eCmd, (err, stdout, stderr) => {
		if (err) {
			// node couldn't execute the command
			console.log("Error");
			return;
		}  
	});  
});