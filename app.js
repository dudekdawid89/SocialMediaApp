const express = require('express')
const app = express()
const router = require('./router')

app.use(express.urlencoded({extended: false})) // tells express to add that users submitting data  to request object (req.body)
app.use(express.json()) // allows to send json data
app.use(express.static('public')) // make Public folder accessible

app.set('views', 'views')  // code for setting Views name
app.set('view engine', 'ejs') // letting express know which template is going to use 

app.use('/', router)

module.exports = app
