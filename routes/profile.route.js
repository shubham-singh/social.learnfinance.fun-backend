const express = require('express');
const router = express.Router();

const { getProfile, createProfile, checkUsername, changeUsername, changeProfile, follow, unfollow } = require('../controllers/profile.controller');

router
.get('/', getProfile)
.post('/', createProfile)

module.exports = router;