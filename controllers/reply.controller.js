const { Post, Reply } = require('../db/db.connect');
const { createNotification } = require('./notification.controller');

const reply = async (req, res) => {
  try {
    const { postID, body } = req.body;
    var image = "", imageID = "";
    if (req.file !== undefined) {
      const result = await cloudinary.uploader.upload(req.file.path);
      image = result.secure_url;
      imageID = result.public_id;
    }
    const post = await Post.findOne({ _id: postID });
    const newReply = new Reply({
      author: req.user.profileID,
      to: postID,
      body: body,
      img: {
        src: image,
        cloudinary_id: imageID
      },
      likes: []
    });

    if (post) {
      const reply = await newReply.save();
      post.replies.push(reply._id);
      await post.save();
      if (!req.user.profileID.equals(post.author)) {
        createNotification({replyID: post._id, senderID: req.user.profileID, recieverID: post.author});
      }
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