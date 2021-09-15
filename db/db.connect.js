const mongoose = require('mongoose');

const dbURI = process.env['dbURI'];

const { profileSchema } = require('../models/profile.model');
const { replySchema, userReplySchema } = require('../models/reply.model');
const { postSchema, userPostSchema } = require('../models/post.model');
const { notificationSchema, userNotificationSchema } = require('../models/notification.model');

const dbConnect = mongoose.createConnection(dbURI, {
  useNewUrlParser: true,
  useUnifiedTopology: true
})

const Profile = dbConnect.model('profile', profileSchema);
const Post = dbConnect.model('post', postSchema);
const UserPost = dbConnect.model('user_post', userPostSchema);
const Reply = dbConnect.model('reply', replySchema);
const UserReply = dbConnect.model('user_reply', userReplySchema);
const Notification = dbConnect.model('notification', notificationSchema);
const UserNotification = dbConnect.model('user_notification', userNotificationSchema);


module.exports = { dbConnect, Profile, Post, UserPost, Reply, UserReply, Notification, UserNotification };