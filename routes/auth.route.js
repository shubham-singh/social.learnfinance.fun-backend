const express = require('express');
const router = express.Router();

const { signup, login, getUser } = require('../controllers/auth.controller.js');

const { checkUser } = require('../middleware/auth.middleware.js')

router
.post('/signup', signup)
.post('/login', login)

router.use(checkUser);

router.get('/', getUser)

module.exports = router;