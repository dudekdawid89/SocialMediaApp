const express = require('express')
const session = require('express-session')
const MongoStore = require('connect-mongo')(session)
const app = express()
const router = require('./router')
const flash = require('connect-flash')

let sessionOptions = session({ // configuration session to enable session
    secret: 'JavaScript is soo cool',
    store: new MongoStore({client: require('./db')}), // overwrite default store option in order to store session in mongodb
    resave: false,
    saveUninitialized: false,
    cookie: {
        maxAge: 1000 * 60 * 60 * 24,
        httpOnly: true
    }
})

app.use(sessionOptions)
app.use(flash())  // use package for flashing messages on website

app.use(express.urlencoded({extended: false})) // tells express to add that users submitting data  to request object (req.body)
app.use(express.json()) // allows to send json data
app.use(express.static('public')) // make Public folder accessible

app.set('views', 'views')  // code for setting Views name
app.set('view engine', 'ejs') // letting express know which template is going to use 

app.use('/', router)

module.exports = app
