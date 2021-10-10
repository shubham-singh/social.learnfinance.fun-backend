const express = require('express');
const router = express.Router();
const upload = require('../middleware/multer');
const { checkUser } = require('../middleware/auth.middleware.js');

const { getProfileByUsername, getProfile, createProfile, checkUsername, changeUsername, changeProfile, follow, unfollow } = require('../controllers/profile.controller');

const imgUpload = upload.fields([{name: "imgProfile", maxCount: 1}, {name: "imgCover", maxCount: 1}]);

router
.get('/:username', getProfileByUsername)
router
.use(checkUser)
.get('/', getProfile)
.post('/', imgUpload, createProfile)
.post('/edit', imgUpload, changeProfile)
.post('/username/check', checkUsername)
.post('/username/change', changeUsername)
.post('/follow', follow)
.post('/unfollow', unfollow);

module.exports = router;