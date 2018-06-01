var hb = require('handlebars');
var util = require('./util');
const fs = require('fs')
var winston = require('winston')
const loadJsonFile = require('load-json-file');
var dirfn = require('node-dir')

srcDir = util.getRootDir() + '/src';
tempDir = util.getRootDir() + '/temp';
tgtDir = util.getRootDir() + '/dist';
winston.level = 'debug'
winston.info('GENERATE HANDLEBARS OUTPUT ...')


// Load metamaster.json
loadJsonFile(tempDir + '/metamaster.json').then(json => {
	if(json!==undefined && json != "" ) {
        winston.info("Loaded metamaster.json")
        genMasters(json)
    }
    else {
        winston.error("Error with metamaster.json")
    }
});

// Main processing
function genMasters(mm) {

	// Register directory, all .hbp files
	var matches = dirfn.files(tempDir,  {sync:true, recursive: false})
	for(var i=0; i<matches.length; i++) {
		if(matches[i].includes('.hbp')) {
			var data = fs.readFileSync(matches[i], 'UTF8')
			hb.registerPartial(matches[i].substring(matches[i].lastIndexOf('/')+1, matches[i].lastIndexOf('.hbp')), data)
		}
	}
	
	// Scan for any template master files
	for(var i=0; i<mm.length; i++) {

		// Look for any template master files
        if( mm[i].isTemplateMaster ) {
			var tgtPath = (tgtDir + '/' + mm[i].pubItem).replace('.html', '') + '.html'
			var srcPath = (tempDir + '/' + mm[i].pubItem).replace('.html', '') + '.hbm'
			winston.debug("Registering master %s", srcPath)
			var data = fs.readFileSync(srcPath, 'UTF8')
			var template = hb.compile(data);
			var output = template();
			fs.writeFileSync(tgtPath, output)
		}

	}

}

return

HandlebarsGenerator.registerSourceDirectory(srcDir);
winston.info('GENERATE HANDLEBARS OUTPUT ...')

var items = fs.readdirSync(srcDir)


// Scan /temp folder for any template masters
for (var i = 0; i < items.length; i++) {
	var item = items[i]
	if (item.indexOf('.html') !== -1) {
		item = item.replace('.html', '');
		console.log(item);
		HandlebarsGenerator.registerPage(item, item, {});
	}
}

HandlebarsGenerator.generatePages(tgtDir, {
	extension: 'html'
}, function(err) {
	if (err) console.error(err.message);
});
