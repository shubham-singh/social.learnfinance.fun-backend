const jwt = require('jsonwebtoken');
const { User } = require('../db/dbUser.connect.js');
const { Profile } = require('../db/db.connect.js');
const secret = process.env['secret'];

const checkUser = async (req, res, next) => {
  const token = req.headers.authorization;

  try {
    if(token) {
      const decoded = jwt.verify(token, secret);
      const user = await User.findById(decoded.userID);
      const profile = await Profile.findOne({ user_id: decoded.userID });
      if (profile !== null) {
        req.user = { userID: user._id, profileID: profile._id };
      } else {
        req.user = { userID: user._id };
      }
      return next();
    } else {
      throw Error('token not found')
    } 
  } catch (error) {
      res.status(401).json({
        success: false,
        error: error.message
      })
  }
}

module.exports = { checkUser }