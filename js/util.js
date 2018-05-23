//
// Utility functions
//

var dirfn = require('node-dir')
const {exec} = require('child_process');

module.exports = {

  	getFileNames: 

	// Returns an array of file names with specified extension
	// dir should relative to the 'cheat' folder

	function (dir, ext, inclExt, stripPath) {
		var files = dirfn.files(dir, {sync:true})
		var final = []

		for(i=0; i<files.length; i++) {
			if(files[i].includes(ext)) {
				file = files[i]
				if(stripPath) {
					file = file.substring(file.indexOf("/")+dir.length+1)
				}
				if(!inclExt && file.includes(ext)) {					
					file = file.substring(0, file.indexOf(ext))
				}
				final.push(file)
			}
			
		}
	    return final

	},

	getRootDir: 

	// Get the root directory
	function() {
		var dirName = __dirname.split('/')
		dirName.pop()
		dirName = dirName.join('/')
		return dirName
	},


	prepBuild:

	// Get the folder structure of src and replicate in /temp and /dist
	function(dir, callback) {

	    // Empty contents of /dist and /temp
		exec('rm -rf ' + dir + '/dist/*' , (err, stdout, stderr) => {
				if (err) {
					// node couldn't execute the command
					console.log(err)
					return
				}  
			});  
		exec('rm -rf ' + dir + '/temp/*' , (err, stdout, stderr) => {
				if (err) {
					// node couldn't execute the command
					console.log(err)
					return
				}  
			});  


		// Get a list of all subdirs
		dirfn.subdirs(dir + '/src', function(err, subs) {
		    if (err) throw err

		    for(i=0; i<subs.length; i++) {
		    	subPath = subs[i].substring(subs[i].indexOf(dir + '/src/') + dir.length + 5)
		    	//console.log(subPath)

		    	// Recreate in /dist and /temp
				exec('mkdir ' + dir + '/temp/' + subPath , (err, stdout, stderr) => {
						if (err) {
							// node couldn't execute the command
							console.log(err)
							return
						}  
					});  
				exec('mkdir ' + dir + '/dist/' + subPath , (err, stdout, stderr) => {
						if (err) {
							// node couldn't execute the command
							console.log(err)
							return
						}  
					});  


		    }

		    callback()
		});		

	},

	test:

	function() {
		var files = dirfn.files('/Users/fmay/cheat/src', {sync:true})
		console.log(files)
	}



};






