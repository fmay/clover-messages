var HandlebarsGenerator = require('handlebars-generator');
const fs = require('fs')

var dirName = __dirname.split('/')
dirName.pop()
srcDir = dirName.join('/') + '/temp';
tgtDir = dirName.join('/') + '/dist';

HandlebarsGenerator.registerSourceDirectory(srcDir);
console.log(srcDir)

var items = fs.readdirSync(srcDir)
	console.log(items);

for (var i = 0; i < items.length; i++) {
	var item = items[i]
	if (item.indexOf('.html') !== -1) {
		item = item.replace('.html', '');
		console.log('add template item')
		HandlebarsGenerator.registerPage(item, item, {});
	}
}

HandlebarsGenerator.generatePages(tgtDir, {
	extension: 'html'
}, function(err) {
	if (err) console.error(err.message);
});