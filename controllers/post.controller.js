const { UserPost, Post, Profile } = require('../db/db.connect');

const getAllPost = async (req, res) => {
  try {
    const posts = await UserPost.findOne({ author: req.user.profileID });
    if (posts === null) {
      return res.status(200).json({
        success: true,
        posts: {
          posts: []
        }
      })
    }
    res.status(200).json({
      success: true,
      posts
    })
  } catch (error) {
    res.status(400).json({
      success: false,
      error: error.message
    })
  }
}

const getPost = async (req, res) => {
  try {
    const { postID } = req;
    const post = await Post.findOne({ _id: postID })
    .populate({ path: 'author', select: 'username name img' })
    .populate({ path: 'likes', select: 'username name img' })
    .populate({ 
      path: 'replies', 
      populate: {
        path: 'author likes'
      }
    });
    if (post === null) {
      throw new Error('post deleted')
    }
    res.status(200).json({
      success: true,
      post
    })
  } catch (error) {
    res.status(400).json({
      success: false,
      error: error.message
    })
  }
}

const post = async (req, res) => {
  try {
    const { body } = req.body;
    const user_posts = await UserPost.findOne({ author: req.user.profileID });
    const newPost = new Post({
      author: req.user.profileID,
      body: body,
      likes: [],
      replies: []
    });
    const post = await newPost.save();
    user_posts.posts.push(post._id);
    await user_post.save();
    res.status(200).json({
      success: true,
      post
    })
  } catch (error) {
    res.status(400).json({
      success: false,
      error: error.message
    })
  }
}

const deletePost = async (req, res) => {
  try {
    const { postID } = req.body;
    const deletedPost = await Post.deleteOne({ _id: postID })
    const user_posts = await UserPost.findOne({ author: req.user.profileID });
    user_posts.posts.pull(postID);
    await user_posts.save();
    res.status(200).json({
      success: true,
      deletedPost
    })
  } catch (error) {
    res.status(200).json({
      success: false,
      error: error.message
    })
  }
}

const likePost = async (req, res) => {
  try {
    const { postID } = req.body;
    const post = await Post.findOne({ _id: postID });
    const profile = await Profile.findOne({ user_id: req.user.userID });
    post.likes.push(profile._id);
    await post.save();
    res.status(200).json({
      success: true,
      post
    })
  } catch (error) {
    res.status(400).json({
      success: false,
      error: error.message
    })
  }
}

module.exports = { post, deletePost, likePost, unlikePost }