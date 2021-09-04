const express = require('express');
const router = express.Router();

const { checkUser } = require('../middleware/auth.middleware.js');

const { getAllPost, getPost, post, deletePost, likeUnlikePost, unlikePost } = require('../controllers/post.controller.js');

router.param('username', async (req, res, next ,id) => {
  try {
    req.username = id;
    next()
  } catch (error) {
    res.status(400).json({success: false, message: "could not retrieve post"})
  }
})

// router.param('postID', async (req, res, next ,id) => {
//   try {
//     req.postID = id;
//     next()
//   } catch (error) {
//     res.status(400).json({success: false, message: "could not retrieve post"})
//   }
// })

router
.get('/:username', getAllPost)
.get('/:username/:postID', getPost)
.use(checkUser)
.post('/', post)
.post('/:postID/react', likeUnlikePost)

module.exports = router;