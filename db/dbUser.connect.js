const mongoose = require('mongoose');

const dbUserURI = process.env['dbUserURI'];
const { userSchema } = require('../models/user.model.js');

const dbConnectUser = mongoose.createConnection(dbUserURI, {
  useNewUrlParser: true,
  useUnifiedTopology: true
});

const User = dbConnectUser.model('user', userSchema);

module.exports = { dbConnectUser, User}