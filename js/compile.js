var hb = require('handlebars');
var util = require('./util');
const fs = require('fs')
var winston = require('winston')
const loadJsonFile = require('load-json-file');
const writeJsonFile = require('write-json-file');
var dirfn = require('node-dir')
var cheerio = require('cheerio')

var srcDir = util.getRootDir() + '/src';
var tempDir = util.getRootDir() + '/temp';
var tgtDir = util.getRootDir() + '/dist';

winston.level = 'debug'
winston.info('GENERATE HANDLEBARS OUTPUT ...')


// Load metamaster.json
loadJsonFile(tempDir + '/metamaster.json').then(json => {
	if(json!==undefined && json != "" ) {
        winston.info("Loaded metamaster.json")
        compile(json)
    }
    else {
        winston.error("Error with metamaster.json")
    }
});

// Main processing
function compile(mm) {

	// Register all .hbp files as handlebars partials
	var matches = dirfn.files(tempDir,  {sync:true, recursive: false})
	for(var i=0; i<matches.length; i++) {
		if(matches[i].includes('.hbp')) {
			// Register contents as a handlebars partial
			var data = fs.readFileSync(matches[i], 'UTF8')
			var name = matches[i].substring(matches[i].lastIndexOf('/')+1, matches[i].lastIndexOf('.hbp'))
			hb.registerPartial(name, data)

			// Now extract data to enrich for metamaster.json
            var txt = ""
            $ = cheerio.load(data)
            $("p, ul").each(function(index) {
                txt += $(this).text() + '\n'
            })
            h1 = $("h1").text()
            h2 = $("h2").text()
			
			// Enrich metamaster 
			var obj = mm.find(function (obj) { return obj.rootName == name ; });
			obj.h1 = h1
			obj.h2 = h2
			obj.text = txt

		}
	}
	
	// Rewrite enriched metamaster.json
	writeJsonFile(tempDir + '/metamaster.json', mm).then(() => {
		winston.info('Written metamaster.json');
	});

	// Process everything
	for(var i=0; i<mm.length; i++) {

		// Generate static html for any handlebars pages 
        if( mm[i].isTemplateMaster ) {
			var tgtPath = (tempDir + '/' + mm[i].pubItem).replace('.html', '') + '.html'
			var srcPath = (tempDir + '/' + mm[i].pubItem).replace('.html', '') + '.hbm'
			winston.debug("Registering master %s", srcPath)
			var data = fs.readFileSync(srcPath, 'UTF8')
			var template = hb.compile(data);
			var output = template();
			fs.writeFileSync(tgtPath, output)
		}

		// Generate extra metadata from partials
		

	}

}

