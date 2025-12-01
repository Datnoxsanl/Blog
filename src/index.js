const express = require('express')
const path = require('path');
const morgan = require('morgan')
const handlebars = require('express-handlebars')
const app = express()
const port = 3000
// https:localhost:3000

//https
app.use(morgan('combined'))


app.get('/', (req, res) => {
  // res.send('Hello World! 123')
   res.send(`
    <h1>Hello World!</h1>
    `)
})
//127.0.0.1
app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
  console.log(`Example app listening at http://localhost:${port}`)
})