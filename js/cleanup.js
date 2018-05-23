
// Cleanup temp folder
const { exec } = require('child_process');

var dirName = __dirname.split('/')
dirName.pop()
tgtDir = dirName.join('/') + '/temp';

exec('rm -rf ' + tgtDir , (err, stdout, stderr) => {
		if (err) {
			// node couldn't execute the command
			console.log("Error");
			return;
		}  
	});  

