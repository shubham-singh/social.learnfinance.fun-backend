const mongoose = require('mongoose');
const { Schema } = require('mongoose');
const { isEmail } = require('validator');
const bcrypt = require('bcrypt');

const userSchema = new Schema({
  email: {
    type: String,
    required: [true, 'Email is required'],
    unique: true,
    lowercase: true,
    trim: true,
    validate: [isEmail, 'Please enter a valid email']
  },
  password: {
    type: String,
    required: [true, 'Please enter password'],
    select: false,
    trim: true,
    minlength: [6, 'Minimum password length is 6 characters']
  },
  firstName: {
    type: String, 
    trim: true,
    required: [true, 'Name is required']
  },
  lastName: {
    type: String, 
    trim: true
  }
});

userSchema.pre('save', async function(next) {
  const salt = await bcrypt.genSalt();
  this.password = await bcrypt.hash(this.password, salt);
  next();
})

userSchema.statics.login = async function(email, password) {
  const user = await this.findOne( { email } ).select('firstName password');
  if(user) {
    const auth = await bcrypt.compare(password, user.password);
    if(auth) {
      return user;
    }
    throw Error('Incorrect password');
  }
  throw Error('Incorrect email');
}

module.exports = { userSchema };