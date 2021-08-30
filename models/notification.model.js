const mongoose = require('mongoose');
const { Schema } = require('mongoose');

const notificationSchema = new Schema({
  reciever: {
    type: Schema.Types.ObjectId,
    ref: 'profile'
  },
  sender: {
    type: Schema.Types.ObjectId,
    ref: 'profile'
  },
  type: {
    type: String,
    enum: ['LIKED, FOLLOWED'],
    required: [true, 'notification is of type empty']
  },
  on: {
    type: Schema.Types.ObjectId,
    refPath: 'onModel'
  },
  onModel: {
    type: String,
    required: true,
    enum: ['profile', 'post', 'reply']
  },
  isRead: {
    type: Boolean,
    default: false
  }
}, { timestamps: true });

const userNotificationSchema = new Schema({
  profileId: {
    type: Schema.Types.ObjectId,
    ref: 'profile'
  },
  notifications: [ { type: Schema.Types.ObjectId, ref: 'notification' } ]
})

module.exports = { notificationSchema, userNotificationSchema }