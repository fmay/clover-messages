var hb = require('handlebars');
const fs = require('fs')
const loadJsonFile = require('load-json-file');
var util = require('./util.js')
var winston = require('winston')


module.exports = {

list: function(callback) {

    var srcDir = util.getRootDir() + '/src'
    var tempDir = util.getRootDir() + '/temp'
    var tgtDir = util.getRootDir() + '/dist'
    var _mm
    
    winston.level = 'debug'
    
    // Register helpers
    
    // Insert image tag
    hb.registerHelper('image', function(object) {
        var el = object.data.root.mm[object.data.index]
        if(el.pubItemUse == 'image')
            return new hb.SafeString('<img width="300" src="img/' + el.pubItem + '">')
        else
            return new hb.SafeString("")
      });
    
    // Link 
    hb.registerHelper('link', function(object) {
        var el = object.data.root.mm[object.data.index]
        if(el.pubItemUse != 'snippet')
            return new hb.SafeString('<a target="__blank" href="' + tempDir + '/' + el.pubItem + '">' + el.pubItem + '</a>')
        else
            return new hb.SafeString(el.pubItem)
      });
    
    
    // Load metamaster.json
    winston.info('Loading metamaster')
    loadJsonFile(tempDir + '/metamaster.json').then(_mm => {
        if(_mm !== undefined && _mm != "" ) {
            winston.info("Loaded metamaster.json")
            var html = fs.readFileSync('/Users/fmay/cheat/templates/listing.hbm', 'UTF8')
            var template = hb.compile(html);
            var data = {mm: _mm, uses: util.validPubItemUseArray}
            var output = template(data);
            callback(output)
            //fs.writeFileSync(tgtDir + '/ref.html', output)
        }
        else {
            winston.error("Error with metamaster.json")
            callback("")
        }
    });
        
}



}

