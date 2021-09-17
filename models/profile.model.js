const mongoose = require('mongoose');
const { Schema } = require('mongoose');

const profileSchema = new Schema({
  user_id: {
    type: Schema.Types.ObjectId,
    ref: 'user',
    index: true,
    unique: true,
    required: [true, "User ID not found"]
  },
  username: {
    type: String,
    index: true,
    unique: true,
    trim: true,
    required: [true, "Username is required"]
  },
  name: {
    type: String,
    trim: true
  },
  bio: {
    type: String
  },
  img: {
    profile: {
      src: {
        type: String
      },
      cloudinary_id: {
        type: String
      }
    },
    cover: {
      src: {
        type: String
      },
      cloudinary_id: {
        type: String
      }
    }
  },
  following: [{type: Schema.Types.ObjectId, ref: 'profile'}],
  followers: [{type: Schema.Types.ObjectId, ref: 'profile'}]
}, { timestamps: true });

module.exports = { profileSchema }