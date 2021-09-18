const mongoose = require('mongoose');
const { Schema } = require('mongoose');

const postSchema = new Schema({
  author: {
    type: Schema.Types.ObjectId,
    ref: 'profile'
  },
  body: {
    type: String,
    required: [true, 'Post body is empty']
  },
  img: {
    src: {
      type: String
    },
    cloudinary_id: {
      type: String
    }
  },
  likes: [{ type: Schema.Types.ObjectId, ref: 'profile' }],
  replies: [{ type: Schema.Types.ObjectId, ref: 'reply' }]
}, { timestamps: true });

const userPostSchema = new Schema({
  author: {
    type: Schema.Types.ObjectId,
    ref: 'profile',
    index: true,
    unique: true
  },
  posts: [{ type: Schema.Types.ObjectId, ref: 'post' }]
})

module.exports = { postSchema, userPostSchema };