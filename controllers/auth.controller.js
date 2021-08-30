const { User } = require('../db/dbUser.connect.js');
const jwt = require('jsonwebtoken');

const handleErrors = (err) => {
  let errors = {
    email: '',
    password: ''
  }

  if(err.message === 'incorrect email') {
    errors.email = "This email is not registered";
  }

  if(err.message === 'incorrect password') {
    errors.password = "Incorrect password";
  }

  if(err.code === 11000) {
    errors.email = "Email is already registered";
  }

  return errors;
}

const signup = async (req, res) => {
  try {
    const newUser = new User({
      firstName: req.body.firstName,
      lastName: req.body.lastName,
      email: req.body.email,
      password: req.body.password
    });

    const user = await newUser.save();
    user.password = undefined;
    const token = jwt.sign({ userID: user._id }, process.env['secret'], { expiresIn: '24h' })

    res.status(200).json({
      success: true,
      message: "successfully created new user",
      user,
      token
    })
  } catch (err) {
    res.status(400).json({
      success: false,
      error: err.message
    })
  }
};

const login = async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.login(email, password);
    user.password = undefined;
    const token = jwt.sign( {userID: user._id }, process.env['secret'], { expiresIn: '24h' } )
    res.status(200).json({ success: true, user, token });
  } catch(err) {
    res.status(400).json({success: false, error: err.message});
  }
};

const getUser = async (req, res) => {
  try {
    const user = await User.findOne({ _id: req.user.userID });
    res.status(200).json({ success: true, user });
  } catch (error) {
    res.status(400).json({
      success: false,
      error: error.message
    })
  }
}

module.exports = { signup, login, getUser }
