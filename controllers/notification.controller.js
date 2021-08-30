const { Notification, UserNotification } = require('../db/db.connect');

const createNotification = async (req, res) => {
  try {
    const { postID, profileID, replyID, revieverID } = req.body;
    let notification;
    if (postID !== undefined) {
      notification = new Notification({
        reciever: recieverID,
        sender: req.user.profileID,
        type: 'LIKED',
        on: postID,
        onModel: 'post'
      });
    }
    if (profileID !== undefined) {
      notification = new Notification({
        reciever: recieverID,
        sender: req.user.profileID,
        type: 'FOLLOWED',
        on: profileID,
        onModel: 'profile'
      });
    }
    if (replyID !== undefined) {
      notification = new Notification({
        reciever: recieverID,
        sender: req.user.profileID,
        type: 'LIKED',
        on: replyID,
        onModel: 'reply'
      });
    }
    await notification.save();

    const recieverNotifications = await UserNotification.findOne({ profileId: recieverID });

    if (recieverNotifications === null) {
      const newRecieverNotifications = new UserNotification({
        profileID: recieverID,
        notifications: [notification._id]
      });
      await newRecieverNotifications.save();
    } else {
      recieverNotifications.notifications.push(notification._id);
      await recieverNotifications.save();
    }
    res.status(200).json({
      success: true,
    })
  } catch (error) {
    res.status(400).json({
      success: false,
      error: error.message
    })
  }
}

module.exports = { createNotification }