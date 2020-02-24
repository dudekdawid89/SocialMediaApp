const express = require('express')
const router = express.Router()
const userConstroller = require('./controllers/userController')

router.get('/', userConstroller.home)
router.post('/register', userConstroller.register)
router.post('/login', userConstroller.login)
router.post('/logout', userConstroller.logout)

module.exports = router