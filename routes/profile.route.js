const express = require('express');
const router = express.Router();

const { getProfile, createProfile, checkUsername, changeUsername, changeProfile, follow, unfollow } = require('../controllers/profile.controller');

router
.get('/', getProfile)
.post('/', createProfile)
.post('/username/check', checkUsername)
.post('/username/change', changeUsername)
.post('/follow', follow)
.post('/unfollow', unfollow);

module.exports = router;