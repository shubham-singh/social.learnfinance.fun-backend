const { Post, Reply } = require('../db/db.connect');

const reply = async (req, res) => {
  try {
    const { postID, body } = req.body;
    const post = await Post.findOne({ _id: postID });
    const newReply = new Reply({
      to: postID,
      body: body,
      likes: []
    });

    if (post) {
      const reply = await newReply.save();
      post.replies.push(reply._id);
      await post.save();
      return res.status(200).json({
        success: true,
        reply
      })
    } else {
      throw new Error('post deleted')
    }

  } catch (error) {
    res.status(400).json({
      success: false,
      error: error.message
    })
  }
}

const deleteReply = async (req, res) => {
  try {
    const { replyID, postID } = req.body;
    const deletedReply = await Reply.deleteOne({ _id: replyID });
    const post = await Post.findOne({ _id: postID });
    post.replies.pull(replyID);
    await post.save();
    res.status(200).json({
      success: true,
      error: error.message
    })
  } catch (error) {
    res.status(400).json({
      success: true,
      error: error.message
    })
  }
}

module.exports = { reply, deleteReply }