var winston = require('winston')
var util = require('./util.js')
var dirfn = require('node-dir')
const {exec} = require('child_process')
const fs = require('fs')
const writeJsonFile = require('write-json-file');
 
// Validation settings
var _validationError

// Initialize logging
winston.level='debug'
winston.verbose(util.validStatusArray)

// Cleanup and prepare
winston.info("Cleaning up /temp and /dist ...")
util.prepBuild(util.getRootDir(), compileRest)

function validateValue(value, checkType, validArray, defVal, label) {

	if( value == undefined || typeof(value) != checkType || ( validArray.length >0 && validArray.indexOf(value) == -1 )) {
		validationError = true;
		winston.verbose('Validation error : %s', label )
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
		winston.error("Cannot parse metadata")
		tObj.validationError = true;
		return tObj
	}

	// Validate key/value settings
	_validationError = false;
	tObj.rootName = obj.pubItem.substring(0, obj.pubItem.lastIndexOf('.'))
	tObj.sectorTags = validateValue(obj.sectorTags, "string", [], "", "sectorTags")
	tObj.desc = validateValue(obj.desc, "string", [], "undefined", "desc")
	tObj.status = validateValue(obj.status, "string", util.validStatusArray, "undefined", "status")
	tObj.updated = validateValue(obj.updated, "string", [], "", "updated")
	tObj.pubItemUse = validateValue(obj.pubItemUse, "string", util.validPubItemUseArray, "undefined", "pubItemUse")
	tObj.pubItem = validateValue(obj.pubItem, "string", [], "undefined", "pubItem")
	tObj.srcFileName = validateValue(obj.srcFileName, "string", [], "undefined", "srcFileName")
	tObj.UCDomainTags = validateValue(obj.UCDomainTags, "string", [], "", "UCDomainTags")
	tObj.generalTags = validateValue(obj.generalTags, "string", [], "", "generalTags")
	tObj.isTemplateMaster = validateValue(obj.isTemplateMaster, "boolean", [], false, "isTemplateMaster")
	tObj.isTemplateComponent = validateValue(obj.isTemplateComponent, "boolean", [], false, "isTemplateComponent")
	tObj.validationError = _validationError
	var matches = dirfn.files(dirName,  {sync:true, recursive: false})
	for(i=0, tObj.mdSnippet = false; i<matches.length; i++ ) {
		if ( matches[i].includes('.md') ) {
			tObj.mdSnippet = true
			tObj.pubItemUse = 'snippet'
			var name = matches[i].substring(matches[i].lastIndexOf('/') + 1)
			name = name.substring(0, name.lastIndexOf('.'))
			tObj.srcFileName = name + '.md'
			tObj.rootName = name
			tObj.pubItem = '{{>' + name + '}}'
			tObj.isTemplateComponent = true;
			break
		}
	}
	if(!tObj.mdSnippet) {
		tObj.srcFileName = validateValue(obj.srcFileName, "string", [], "undefined", "srcFileName")	
	}
	if( tObj.pubItemUse == 'video' ) {
		tObj.rootName = "YouTube"
		tObj.pubItem = "YouTube"
		tObj.text = obj.text
		_validationError = false
		if(tObj.pubItem===undefined || tObj.pubItem=="" || tObj.text===undefined || tObj.text =="" ) {
			_validationError = true
		}
	}
	if(_validationError) {
		winston.error("Partially incorrect metadata")
	}
	return tObj

}

function compileRest() {

	// Markdown compilation

	var srcDir = util.getRootDir() + '/src'
	var tempDir = util.getRootDir() + '/temp'
	var distDir = util.getRootDir() + '/dist'
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
			winston.error('Error reading metadata from : %s', matches[i])
		}
				  
	}

	// Write metamaster.json 
	writeJsonFile(tempDir + '/metamaster.json', metaMaster).then(() => {
		winston.info('Written metamaster.json');
	});
	winston.info("COMPILE MARKDOWN ...")

	// Iterate through the metamaster.json file, compiling any markdown files directly to /temp
	for(i=0; i<metaMaster.length; i++) {
		if(metaMaster[i].mdSnippet) {
			winston.debug("MD compile %s", metaMaster[i].srcDir + '/' + metaMaster[i].srcFileName)
			var eCmd = 'marked -o ' + tempDir  + '/' + metaMaster[i].rootName + '.hbp ' + metaMaster[i].srcDir + '/' + metaMaster[i].srcFileName 
			exec(eCmd, (err, stdout, stderr) => {
				if (err) {
					// node couldn't execute the command
					winston.error("Error compiling markdown")
				}
			});  
		}
		else { 
			// Copy the pubItem file to /temp
			if(metaMaster[i].pubItem && metaMaster[i].pubItem!='undefined') {
				// If a template master, then copy to /temp
				if(metaMaster[i].isTemplateMaster) {
					eCmd = 'cp ' + metaMaster[i].srcDir + '/' + metaMaster[i].pubItem.substring(0, metaMaster[i].pubItem.lastIndexOf('.')) + '.hbm ' + tempDir
				}
				else {
					eCmd = 'cp ' + metaMaster[i].srcDir + '/' + metaMaster[i].pubItem + ' ' + tempDir
				}
				winston.verbose(eCmd)
				exec(eCmd, (err, stdout, stderr) => {
					if (err) {
						// node couldn't execute the command
						winston.error(err.message)
						return
					}  
				});  
			}
		}
	}


}

