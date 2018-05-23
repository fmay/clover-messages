var HandlebarsGenerator = require('handlebars-generator');
const fs = require('fs')

HandlebarsGenerator.registerSourceDirectory(__dirname + '/src');
console.log(__dirname + '/src')

var items = fs.readdirSync(__dirname + '/src')
	console.log(items);

for (var i = 0; i < items.length; i++) {
	var item = items[i]
	if (item.indexOf('.html') !== -1) {
		item = item.replace('.html', '');
		console.log('add template item')
		HandlebarsGenerator.registerPage(item, item, {});
	}
}

HandlebarsGenerator.generatePages(__dirname + '/dist', {
	extension: 'html'
}, function(err) {
	if (err) console.error(err.message);
});