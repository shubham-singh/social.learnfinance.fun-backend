const { Profile, Post } = require('../db/db.connect');

const getFeed = async (req, res) => {
  try {
    const query = Post.find();
    query.setOptions({ lean : true });
    query.collection(Post.collection);
    const userProfile = await Profile.findOne({ user_id: req.user.user_id });
    let followingList = [userProfile._id].concat(userProfile.following);

  } catch (error) {
    res.status(400).json({
      success: false,
      error: error.message
    })
  }
}

module.exports = { getFeed }