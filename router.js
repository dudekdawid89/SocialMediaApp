const express = require('express')
const router = express.Router()
const userConstroller = require('./controllers/userController')
const postConstroller = require('./controllers/postController')

router.get('/', userConstroller.home)
router.post('/register', userConstroller.register)
router.post('/login', userConstroller.login)
router.post('/logout', userConstroller.logout)
// post realated routes
router.get('/create-post', userConstroller.mustBeLoggedIn, postConstroller.viewCreateScreen)
router.post('/create-post', userConstroller.mustBeLoggedIn, postConstroller.create)
router.get('/post/:id', postConstroller.viewSingle)

module.exports = router