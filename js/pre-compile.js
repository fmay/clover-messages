var util = require('./util.js');
const {exec} = require('child_process');


// Cleanup and prepare
util.prepBuild(util.getRootDir(), compileRest);


function compileRest() {

	// Markdown compilation

	var srcDir = util.getRootDir() + '/src';
	var tempDir = util.getRootDir() + '/temp';

	console.log("COMPILE MARKDOWN ...")

	var matches = util.getFileNames(srcDir, '.md', false, true)
	for(i=0; i<matches.length; i++) {
	  	eCmd = 'marked -o ' + tempDir + '/' + matches[i] + '.html ' + srcDir + '/' + matches[i] + '.md'
		exec(eCmd, (err, stdout, stderr) => {
			if (err) {
				// node couldn't execute the command
				console.log("Error compiling markdown");
			}  
		});  
	}

	// Copy html files to temp folder

	console.log("COPY MASTER HTML FILES ...")

	srcDir = util.getRootDir() + '/src';
	tgtDir = util.getRootDir() + '/temp';

	var matches = util.getFileNames(srcDir, '.html', true, true)
	console.log(matches)

	for(i=0; i<matches.length; i++) {
	  	eCmd = 'cp ' + srcDir + '/' + matches[i] + ' ' + tgtDir;
		console.log(eCmd);
		exec(eCmd, (err, stdout, stderr) => {
			if (err) {
				// node couldn't execute the command
				console.log("Error");
				return;
			}  
		});  
	}



}

