const { Notification, UserNotification } = require('../db/db.connect');

const createNotification = async ({postID, profileID, replyID, senderID ,recieverID}) => {
  try {
    let notification;
    if (postID !== undefined) {
      notification = new Notification({
        reciever: recieverID,
        sender: senderID,
        type: 'LIKED',
        onItem: postID,
        onModel: 'post'
      });
    }
    if (profileID !== undefined) {
      notification = new Notification({
        reciever: recieverID,
        sender: senderID,
        type: 'FOLLOWED',
        onItem: profileID,
        onModel: 'profile'
      });
    }
    if (replyID !== undefined) {
      notification = new Notification({
        reciever: recieverID,
        sender: senderID,
        type: 'LIKED',
        onItem: replyID,
        onModel: 'reply'
      });
    }
    await notification.save();

    const recieverNotifications = await UserNotification.findOne({ profileID: recieverID });

    if (recieverNotifications === null) {
      const newRecieverNotifications = new UserNotification({
        profileID: recieverID,
        notifications: [notification._id]
      });
      await newRecieverNotifications.save();
    } else {
      recieverNotifications.notifications.unshift(notification._id);
      await recieverNotifications.save();
    }
  } catch (error) {
  }
}

const getNotification = async (req, res) => {
  try {
    const notification = await UserNotification.findOne({ profileID: req.user.profileID }).populate("notifications").populate({
      path: "notifications",
      populate: {
        path: "sender",
        select: "_id username name img.profile"
      }
    });
    
    if (notification === null) {
      return res.status(200).json({
        success: true,
        notification: []
      })
    }
    
    res.status(200).json({
      success: true,
      notification
    })
  } catch (error) {
    success: false;
    error: error.message
  }
}

module.exports = { getNotification ,createNotification }