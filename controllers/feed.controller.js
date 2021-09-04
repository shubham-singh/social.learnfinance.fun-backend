const { Profile, Post, UserPost } = require('../db/db.connect');

const getFeed = async (req, res) => {
  try {
    const user = await Profile.findOne(req.user.profileID);
    const userPosts = await UserPost.findOne({ author: req.user.profileID }).populate('posts').populate({
      path: "posts",
      populate: { 
        path: "author",
        select: "_id username name img.profile"
      }
    });
    const friendPosts = await Promise.all(
      user.following.map((friendID) => {
        return UserPost.findOne({ author: friendID }).populate('posts').populate({
          path: "posts",
          options: {
            limit: 10
          },
          populate: { 
            path: "author",
            select: "_id username name img.profile"
          }
        }).select('posts -_id');
      })
    )
    const feed = friendPosts.map(friend => friend.posts).flat();
    res.json({
      success: true,
      feed: userPosts.posts.concat(feed)
    })
  } catch (error) {
    console.log(error);
  }
}

module.exports = { getFeed }