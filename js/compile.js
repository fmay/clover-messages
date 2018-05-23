var HandlebarsGenerator = require('handlebars-generator');
var util = require('./util');
const fs = require('fs')

srcDir = util.getRootDir() + '/temp';
tgtDir = util.getRootDir() + '/dist';

HandlebarsGenerator.registerSourceDirectory(srcDir);
console.log('GENERATE HANDLEBARS OUTPUT ...')

var items = fs.readdirSync(srcDir)
console.log(items)

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
