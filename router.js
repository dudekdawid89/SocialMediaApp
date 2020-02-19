const express = require('express')
const router = express.Router()
const userConstroller = require('./controllers/userController')

router.get('/', userConstroller.home)
router.post('/register', userConstroller.register)

module.exports = router