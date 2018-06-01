const express = require('express')
const app = express()

app.get('/', (req, res) => res.send('Hello World!'))

app.get('/ref', (req, res) => { 
    var md = __dirname.substring(0, __dirname.lastIndexOf('/')) + '/dist/ref.html'
    res.sendFile(md)
})

app.listen(3000, () => console.log('Example app listening on port 3000!'))
