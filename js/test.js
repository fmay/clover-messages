var hb = require('handlebars');
const fs = require('fs')
const loadJsonFile = require('load-json-file');
var util = require('./util.js')
var winston = require('winston')

var srcDir = util.getRootDir() + '/src'
var tempDir = util.getRootDir() + '/temp'
var tgtDir = util.getRootDir() + '/dist'
var _mm

winston.level = 'debug'

// Load metamaster.json
winston.info('Loading metamaster')
loadJsonFile(tempDir + '/metamaster.json').then(_mm => {
	if(_mm !== undefined && _mm != "" ) {
        winston.info("Loaded metamaster.json")
        var html = fs.readFileSync('/Users/fmay/cheat/templates/listing.hbm', 'UTF8')
        var template = hb.compile(html);
        var output = template(_mm);
        fs.writeFileSync(tgtDir + '/ref.html', output)
        winston.info("Written ref.html")
    }
    else {
        winston.error("Error with metamaster.json")
    }
});
