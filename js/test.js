var winston = require('winston')



// Initialize logging
winston.level='debug'

// Cleanup and prepare
winston.debug("Calling cleanup ...")
return
util.prepBuild(util.getRootDir(), compileRest)

function validateMetadata(data) {

	obj = JSON.parse(data)

	// Check for 

}

function compileRest() {

	// Markdown compilation

	var srcDir = util.getRootDir() + '/src'
	var tempDir = util.getRootDir() + '/temp'

	winston.debug("Set dirs to %s %s", srcDir, tempDir);

	// Get list of level 1 folders and retain only folder level below
	var matches = dirfn.files(srcDir, 'dir', null, {sync:true, recursive:false})
	winston.debug("Got matches")

	for(i=0; i<matches.length; i++) {
		// Read in metadata.json		
		try {
			contents = fs.readFileSync(matches[i] + '/metadata.json', 'utf8')
			winston.debug('Read file OK : %s', matches[i])
			validateMetadata(contents)
		}
		catch(error) {
			winston.debug('Error reading metadata from : %s', matches[i])
		}
				  
	}

	// Iterate through folders


	// Check for existence of 

	winston.log("COMPILE MARKDOWN ...")

	var matches = util.getFileNames(srcDir, '.md', false, true)
	for(i=0; i<matches.length; i++) {
	  	eCmd = 'marked -o ' + tempDir + '/' + matches[i] + '.html ' + srcDir + '/' + matches[i] + '.md'
		exec(eCmd, (err, stdout, stderr) => {
			if (err) {
				// node couldn't execute the command
				console.log("Error compiling markdown")
			}  
		});  
	}

	// Copy html files to temp folder

	console.log("COPY MASTER HTML FILES ...")

	srcDir = util.getRootDir() + '/src'
	tgtDir = util.getRootDir() + '/temp'

	var matches = util.getFileNames(srcDir, '.html', true, true)
	console.log(matches)

	for(i=0; i<matches.length; i++) {
	  	eCmd = 'cp ' + srcDir + '/' + matches[i] + ' ' + tgtDir
		console.log(eCmd)
		exec(eCmd, (err, stdout, stderr) => {
			if (err) {
				// node couldn't execute the command
				console.log("Error")
				return
			}  
		});  
	}



}

