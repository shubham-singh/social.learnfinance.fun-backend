const { Profile, Post, UserPost } = require('../db/db.connect');

const getFeed = async (req, res) => {
  try {
    const user = await Profile.findOne({_id: req.user.profileID});
    let userPosts = await UserPost.findOne({ author: req.user.profileID }).populate('posts').populate({
      path: "posts",
      populate: { 
        path: "author",
        select: "_id username name img.profile"
      }
    });

    if (userPosts === null) {
      userPosts = {
        posts: []
      }
    }
    
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
    
    const feed = friendPosts.map(friend => {
      if(friend !== null) {
        return friend.posts
      } return [];
    }).flat();

    res.json({
      success: true,
      feed: userPosts.posts.concat(feed)
    })
  } catch (error) {
  }
}

module.exports = { getFeed }