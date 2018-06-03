const express = require('express')
const app = express()
const listing = require('./srv_listing.js')
var util = require('./util.js')

var srcDir = util.getRootDir() + '/src'
var tempDir = util.getRootDir() + '/temp'
var tgtDir = util.getRootDir() + '/dist'

app.use(express.static('public'));
app.use('/img', express.static( tempDir ));
app.use('/css', express.static( util.getRootDir() + '/css' ));

app.get('/', (req, res) => res.send('Hello World!'))

app.get('/ref', (req, res) => { 
    listing.list(function(data) {
        res.send(data)
    })
})

app.listen(3000, () => console.log('Example app listening on port 3000!'))
