const { Profile, UserPost } = require('../db/db.connect');
const { createNotification } = require('./notification.controller');

const getProfileByUsername = async (req, res) => {
  try {
    const username = req.params.username;
    const profile = await Profile.findOne({ username });
    if (profile === null) {
      return res.status(204).json({
        success: true
      })
    }
    res.status(200).json({
      success: true,
      profile: profile
    })
  } catch (error) {
    res.status(400).json({
      success: false,
      error: error.message
    })
  }
}

const getProfile = async (req, res) => {
  try {
    const profile = await Profile.findOne({ user_id: req.user.userID });
    if (profile === null) {
      return res.status(200).json({
        success: true,
        newUser: true
      })
    }
    
    res.status(200).json({
      success: true,
      newUser: false,
      profile
    })
  } catch (error) {
    res.status(400).json({
      success: false,
      error: error.message
    })
  }
}

const createProfile = async (req, res) => {
  try {
    const { username, name, bio ,imgProfile, imgCover } = req.body;
    const newProfile = new Profile({
      user_id: req.user.userID,
      username,
      name,
      bio,
      img: {
        profile: imgProfile,
        cover: imgCover
      },
      following: [],
      followers: []
    });
    const profile = await newProfile.save();
    res.status(200).json({
      success: true,
      profile
    })
  } catch (error) {
    res.status(400).json({
      success: false,
      error: error.message
    })
  }
}

const checkUsername = async (req, res) => {
  try {
    const { username } = req.body;
    const isUsernameAvailable = await Profile.exists({ username: username });
    if (isUsernameAvailable) {
      return res.status(200).json({
        success: true,
        isUsernameAvailable: false
      })
    }
    res.status(200).json({
      success: true,
      isUsernameAvailable: true
    })
  } catch (error) {
    res.status(400).json({
      success: false,
      error: error.message
    })
  }
}

const changeUsername = async (req, res) => {
  try {
    const { username } = req.body;
    const filter = { user_id: userID }
    const update = { username: username }
    const profile = await Profile.findOne(filter, update, { new: true })
    res.status(200).json({
      success: true,
      profile
    })
  } catch (error) {
    res.status(400).json({
      success: false,
      error: error.message
    })
  }
}

const changeProfile = async (req, res) => {
  try {
    const { name, bio ,imgProfile, imgCover } = req.body;
    const filter = { user_id: userID }
    const update = {
      name,
      bio,
      img: {
        profile: imgProfile,
        cover: imgCover
      }
    }
    const profile = await Profile.findOne(filter, update, { new: true })
    res.status(200).json({
      success: true,
      profile
    })
  } catch (error) {
    res.status(400).json({
      success: false,
      error: error.message
    })
  }
}

const follow = async (req, res) => {
  try {
    const { profileID } = req.body;
    const userProfile = await Profile.findOne({ user_id: req.user.userID });
    const followingProfile = await Profile.findOne({ _id: profileID });
    if (userProfile && followingProfile) {
      userProfile.following.unshift(profileID);
      followingProfile.followers.unshift(userProfile._id);
      await userProfile.save();
      await followingProfile.save();
    } else {
      throw new Error('failed to follow')
    }
    res.status(200).json({
      success: true,
      profileID
    })
  } catch (error) {
    res.status(400).json({
      success: false,
      error: error.message
    })
  }
}

const unfollow = async (req, res) => {
  try {
    const { profileID } = req.body;
    const userProfile = await Profile.findOne({ user_id: req.user.userID });
    const unfollowingProfile = await Profile.findOne({ _id: profileID });

    if (userProfile && unfollowingProfile) {
      userProfile.following.pull(profileID);
      unfollowingProfile.followers.pull(userProfile._id);
      await userProfile.save();
      await unfollowingProfile.save();
    } else {
      throw new Error('failed to unfollow')
    }

    res.status(200).json({
      success: true,
      profileID
    })

  } catch (error) {
    res.status(200).json({
      success: false,
      error: error.message
    })
  }
}

module.exports = { getProfileByUsername, getProfile,createProfile, checkUsername, changeUsername, changeProfile, follow, unfollow }