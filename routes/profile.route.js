const express = require('express');
const router = express.Router();

const { checkUser } = require('../middleware/auth.middleware.js');

const { getProfileByUsername, getProfile, createProfile, checkUsername, changeUsername, changeProfile, follow, unfollow } = require('../controllers/profile.controller');

router
.get('/:username', getProfileByUsername)
router
.use(checkUser)
.get('/', getProfile)
.post('/', createProfile)
.post('/username/check', checkUsername)
.post('/username/change', changeUsername)
.post('/follow', follow)
.post('/unfollow', unfollow);

module.exports = router;