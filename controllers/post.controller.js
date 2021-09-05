const { UserPost, Post, Profile } = require('../db/db.connect');
const { createNotification } = require('./notification.controller');

const getAllPost = async (req, res) => {
  try {
    const profileID = await Profile.findOne({ username: req.username })
    const posts = await UserPost.findOne({ author: profileID }).populate('posts').populate({
      path: "posts",
      populate: { 
        path: "author",
        select: "_id username name img.profile"
      }
      // path: "posts",
      // populate: { 
      //   path: "likes",
      //   select: "_id username name"
      // }
    });
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
    const postID = req.params.postID;
    const post = await Post.findOne({ _id: postID })
    .populate({ path: 'author', select: 'username name img.profile' })
    .populate({ path: 'likes', select: '_id username name img.profile' })
    // .populate({ 
    //   path: 'replies', 
    //   populate: {
    //     path: 'author likes'
    //   }
    // });
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
    await post.populate({ path: 'author', select: 'username name img.profile' })
    if (user_posts === null) {
      const newUserPost = new UserPost({
        author: req.user.profileID,
        posts: [post._id]
      });
      await newUserPost.save();
    } else {
      user_posts.posts.unshift(post._id);
      await user_posts.save();
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

const likeUnlikePost = async (req, res) => {
  try {
    const { postID } = req.body;
    const post = await Post.findOne({ _id: postID });
    const profile = await Profile.findOne({ user_id: req.user.userID });
    if (post.likes.includes(profile._id)) {
      post.likes.pull(profile._id)
    } else {
      post.likes.unshift(profile._id);
      if (!req.user.profileID.equals(post.author)) {
        createNotification({postID, senderID: req.user.profileID, recieverID: post.author});
      }
    }
    await post.save();
    
    res.status(200).json({
      success: true,
      profileID: profile._id,
      post
    })
  } catch (error) {
    res.status(400).json({
      success: false,
      error: error.message
    })
  }
}


module.exports = { getAllPost, getPost ,post, deletePost, likeUnlikePost }