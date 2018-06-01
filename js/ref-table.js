var util = require('./util.js')
var dirfn = require('node-dir')
var cheerio = require('cheerio')
const {exec} = require('child_process')
const fs = require('fs')
const loadJsonFile = require('load-json-file');
var winston = require('winston')


// Build a reference table for content from /temp
//
// Reads in all .html files
// Extracts h1 and h2 tags
// Extracts body copy
// Extract file name which yields the {{template}} name
// Puts everything into a table for searching, referencing etc.

winston.level = 'debug'

// Get a list of all files to process
var srcDir = util.getRootDir() + '/temp'
var tgtDir = util.getRootDir() + '/dist'
var files = dirfn.files(srcDir, {sync:true})
var txt, h1, h2, hbsName, $, output
var metaMaster = []

// Load skeleton file into cheerio
var skeleton = fs.readFileSync(util.getRootDir() + '/ref-skeleton.html', 'utf8')
var _skel = cheerio.load(skeleton)

// Load metamaster.json
loadJsonFile(srcDir + '/metamaster.json').then(json => {
	if(json!==undefined && json != "" ) {
        winston.info("Loaded metamaster.json")
        genRef(json)
    }
    else {
        winston.error("Error with metamaster.json")
    }
});

function genRef(mm) {

    for(var i=0; i<mm.length; i++) {
        if( mm[i].mdSnippet || mm[i].isTemplateComponent) {
            // Template component, so add to ref.html
            name = mm[i].pubItem
            contents = fs.readFileSync(srcDir + '/' + mm[i].pubItem, 'utf8')
            hbsName = '{{>' + mm[i].pubItem.substring(0, mm[i].pubItem.lastIndexOf('.')) + '}}'
            txt = ""
            $ = cheerio.load(contents)
            $("p, ul").each(function(index) {
                txt += $(this).text() + '\n'
            })
            h1 = $("h1").text()
            h2 = $("h2").text()
            
            // Add to output string
            output = '<tr class="cs-template-component"><td><p class="template-field">' + hbsName + '</p></td>'
            output += "<td>" + h1 + "</td>"
            output += "<td>" + h2 + "</td>"
            output += "<td>" + contents + "</td></tr>\n"
            _skel("table").append(output)        
            
        }
        else {
            // Add reference to item
            if(mm[i].isTemplateMaster) {
                output = '<tr class="cs-template-master"><td><p class="template-field">'
                output += 'Template Master'
            }
            else {
                if(mm[i].pubItemType == 'image') {
                    output = '<tr class="cs-image"><td><p class="template-field">'
                    output += 'Image'
                }
                else {
                    output = '<tr class="cs-asset"><td><p class="template-field">'
                    output += 'Asset'                    
                }
            }
            output += '</p></td>'
            output += '<td>' + mm[i].pubItem + '</td>'
            output += '<td><a href="' + mm[i].pubItem + '" target="_blank">' + mm[i].pubItem + '</a></td>'
            if(mm[i].pubItemType=='image') {
                output += '<td><img src="' + mm[i].pubItem + '" width="300"></td></tr>\n'
            }   
            else {         
                output += '<td></td></tr>\n'
            }
            _skel("table").append(output)   
        }
    }
    
    // Write output to file
    fs.writeFile(util.getRootDir() + '/dist/ref.html', _skel("*").html(), function(err) {
        if(err) {
            winston.error("Error writing ref.html")
            return 
        }
        winston.info("Cheat sheet reference written successfully to file");
    }); 

}

