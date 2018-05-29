var util = require('./util.js')
var dirfn = require('node-dir')
var cheerio = require('cheerio')
const {exec} = require('child_process')
const fs = require('fs')

// Build a reference table for content from /temp
//
// Reads in all .html files
// Extracts h1 and h2 tags
// Extracts body copy
// Extract file name which yields the {{template}} name
// Puts everything into a table for searching, referencing etc.


// Get a list of all files to process
var srcDir = util.getRootDir() + '/temp'
var files = dirfn.files(srcDir, {sync:true})
var txt, h1, h2, hbsName, $, output

skeleton = fs.readFileSync(util.getRootDir() + '/ref-skeleton.html', 'utf8')
skel = cheerio.load(skeleton)

for(i=0; i<files.length; i++) {
    if(files[i].includes('.html')) {
        // Extract parts from html
        name = files[i].substring(files[i].lastIndexOf("/")+1)
        contents = fs.readFileSync(files[i], 'utf8')
        hbsName = '{{>' + files[i].substring(files[i].indexOf(srcDir)+srcDir.length+1)
        hbsName = hbsName.substring(0, hbsName.lastIndexOf('.html')) + '}}'
        // Don't include any root items or /temp
        if(hbsName.indexOf('/') != -1) {
            txt = ""
            $ = cheerio.load(contents)
            $("p, ul").each(function(index) {
                txt += $(this).text() + '\n'
            })
            h1 = $("h1").text()
            h2 = $("h2").text()
            
            // Add to output string
            output = '<tr><td><p class="template-field">' + hbsName + '</p></td>'
            output += "<td>" + h1 + "</td>"
            output += "<td>" + h2 + "</td>"
            output += "<td>" + contents + "</td></tr>\n"
            skel("table").append(output)        
        }
    }
}

// Write output to file
fs.writeFile(util.getRootDir() + '/dist/ref.html', skel("*").html(), function(err) {
    if(err) {
        return console.log(err);
    }
    console.log("Cheat sheet reference written successfully to file");
}); 


