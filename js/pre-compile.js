var winston = require('winston')
var util = require('./util.js')
var dirfn = require('node-dir')
const {exec} = require('child_process')
const fs = require('fs')
const writeJsonFile = require('write-json-file');
 

// Validation settings
var validStatusArray = ['current', 'archived', 'refresh']
var validPubItemTypeArray = ['file', 'url']
var _validationError

// Initialize logging
winston.level='debug'

// Cleanup and prepare
winston.info("Calling cleanup ...")
winston.debug("111")
util.prepBuild(util.getRootDir(), compileRest)

function validateValue(value, checkType, validArray, defVal) {

	if( value == undefined || typeof(value) != checkType || ( validArray.length >0 && validArray.indexOf(value) == -1 )) {
		validationError = true;
		return defVal
	}
	else {
		return value
	}

}

function validateMetadata(data, dirName) {

	var obj = new Object()
	var tObj = new Object()
	var errCount = 0
	var i

	try {
		tObj.srcDir = dirName
		obj = JSON.parse(data)
	}
	catch(err) {
		// Bad metadata, so generate a warning
		winston.debug("Cannot parse metadata")
		tObj.validationError = true;
		return tObj
	}

	// Validate key/value settings
	_validationError = false;
	tObj.sectorTags = validateValue(obj.sectorTags, "string", [], "")
	tObj.status = validateValue(obj.status, "string", validStatusArray, "undefined")
	tObj.updated = validateValue(obj.updated, "string", [], "")
	tObj.pubItemType = validateValue(obj.pubItemType, "string", validPubItemTypeArray, "undefined")
	tObj.pubItem = validateValue(obj.pubItem, "string", [], "undefined")
	tObj.UCDomainTags = validateValue(obj.UCDomainTags, "string", [], "")
	tObj.generalTags = validateValue(obj.generalTags, "string", [], "")
	tObj.validationError = _validationError
	var matches = dirfn.files(dirName,  {sync:true, recursive: false})
	for(i=0, tObj.mdSnippet = false; i<matches.length; i++ ) {
		if ( matches[i].includes('.md') ) {
			tObj.mdSnippet = true
			tObj.srcFileName = matches[i].substring(matches[i].lastIndexOf('/') + 1)
			break
		}
	}

	if(_validationError) {
		winston.debug("Partially incorrect metadata")
	}
	return tObj

}

function compileRest() {

	// Markdown compilation

	var srcDir = util.getRootDir() + '/src'
	var tempDir = util.getRootDir() + '/temp'
	var metaMaster = []
	var i;

	winston.debug("Set dirs to %s %s", srcDir, tempDir);

	// Get list of level 1 folders and retain only folder level below
	var matches = dirfn.files(srcDir, 'dir', null, {sync:true, recursive:false})
	winston.debug("Got matches")

	// Iterate through folders and process
	for(i=0; i<matches.length; i++) {
		// Read in metadata.json		
		try {
			contents = fs.readFileSync(matches[i] + '/metadata.json', 'utf8')
			winston.debug('Read file OK : %s', matches[i])
			metaMaster.push(validateMetadata(contents, matches[i]))
		}
		catch(error) {
			winston.debug('Error reading metadata from : %s', matches[i])
		}
				  
	}

	// Write metamaster.json 
	writeJsonFile(tempDir + '/metamaster.json', metaMaster).then(() => {
		winston.debug('Written metamaster.json');
	});

	winston.log("COMPILE MARKDOWN ...")

	// Iterate through the metamaster.json file, compiling any markdown files
	for(i=0; i<metaMaster.length; i++) {
		if(metaMaster[i].mdSnippet) {
			winston.debug("MD compile %s", metaMaster[i].srcDir + '/' + metaMaster[i].srcFileName)
			var eCmd = 'marked -o ' + tempDir  + '/' + metaMaster[i].srcFileName.substring(0, metaMaster[i].srcFileName.lastIndexOf('.md')) + '.html ' + metaMaster[i].srcDir + '/' + metaMaster[i].srcFileName 
			exec(eCmd, (err, stdout, stderr) => {
				if (err) {
					// node couldn't execute the command
					console.log("Error compiling markdown")
				}  
			});  
		}
	}
return
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

