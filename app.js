const express = require('express')
const session = require('express-session')
const MongoStore = require('connect-mongo')(session)
const markdown = require('marked')
const app = express()
const sanitizeHTML = require('sanitize-html')


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

app.use(function(req, res, next){
    //make our markdown function available form within ejs template
    res.locals.filterUserHTML = function(content){
        return sanitizeHTML(markdown(content), {allowedTags:['p','br','ul', 'ol','li','strong', 'bold', 'i', 'em', 'h1','h2','h3','h4','h5','h6'], allowedAttributes: []})
    }
    // make all error and success flash messages available form all req
    res.locals.errors = req.flash('errors')
    res.locals.success = req.flash('success')
    //make current user id available on the req object
    if(req.session.user){
        req.visitorId = req.session.user._id
    }else{
        req.visitorId = 0
    }
    // make user session data avaiable from wuthin view templates
    res.locals.user = req.session.user
    next()
}) //passing user controller session data to every routes


const router = require('./router')

app.use(express.urlencoded({extended: false})) // tells express to add that users submitting data  to request object (req.body)
app.use(express.json()) // allows to send json data
app.use(express.static('public')) // make Public folder accessible

app.set('views', 'views')  // code for setting Views name
app.set('view engine', 'ejs') // letting express know which template is going to use 

app.use('/', router)

const server = require('http').createServer(app)
const io = require('socket.io')(server)

io.use(function(socket, next){
    sessionOptions(socket.request, socket.request.res, next)
})

io.on('connection', function(socket){
    if(socket.request.session.user){
        let user = socket.request.session.user
        socket.emit('welcome', {username: user.username, avatar: user.avatar})
        
        socket.on('chatMessageFromBrowser', function(data){
            socket.broadcast.emit('chatMessageFromServer', {message: sanitizeHTML(data.message, {allowedTags: [], allowedAttributes: {}}), username: user.username, avatar: user.avatar})
        })
    }
})
module.exports = server
