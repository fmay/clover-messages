var hb = require('handlebars');
const fs = require('fs')

data = {
   parameter: "test text"     
}

var html = fs.readFileSync('/Users/fmay/cheat/js/test.html', 'UTF8')
var partial = fs.readFileSync('/Users/fmay/cheat/js/partial.hbp', 'UTF8')
hb.registerPartial('partial', partial)
var template = hb.compile(html);
var output = template(data);
console.log(output)