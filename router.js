const express = require('express')
const router = express.Router()
const userConstroller = require('./controllers/userController')
const postConstroller = require('./controllers/postController')
// user related routes
router.get('/', userConstroller.home)
router.post('/register', userConstroller.register)
router.post('/login', userConstroller.login)
router.post('/logout', userConstroller.logout)
// profile realted routes
router.get('/profile/:username', userConstroller.ifUserExists, userConstroller.profilePostsScreen)
// post realated routes
router.get('/create-post', userConstroller.mustBeLoggedIn, postConstroller.viewCreateScreen)
router.post('/create-post', userConstroller.mustBeLoggedIn, postConstroller.create)
router.get('/post/:id', postConstroller.viewSingle)
router.get('/post/:id/edit',userConstroller.mustBeLoggedIn, postConstroller.viewEditScreen)
router.post('/post/:id/edit',userConstroller.mustBeLoggedIn, postConstroller.edit)
router.post('/post/:id/delete',userConstroller.mustBeLoggedIn, postConstroller.delete)


module.exports = router