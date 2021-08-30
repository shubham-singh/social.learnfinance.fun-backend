const mongoose = require('mongoose');
const { Schema } = require('mongoose');

const replySchema = new Schema({
  author: {
    type: Schema.Types.ObjectId,
    ref: 'profile'
  },
  to: {
    type: Schema.Types.ObjectId,
    ref: 'post'
  },
  body: {
    type: String,
    required: [true, 'Post body is empty']
  },
  likes: [{ type: Schema.Types.ObjectId, ref: 'profile' }]
}, { timestamps: true });

const userReplySchema = new Schema({
  author: {
    type: Schema.Types.ObjectId,
    ref: 'profile'
  },
  replies: [{ type: Schema.Types.ObjectId, ref: 'reply' }]
}, { timestamps: true })

module.exports = { replySchema, userReplySchema }