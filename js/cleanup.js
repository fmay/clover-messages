var util = require('./util');

// Cleanup temp folder
 
util.prepBuild(util.getRootDir(), done);

function done() {
	console.log("Cleaned up dirs")
}
console.log("Exit")
return

