const { Profile, UserPost } = require('../db/db.connect');
const { createNotification } = require('./notification.controller');
const cloudinary = require("../db/cloudinary");
const upload = require("../middleware/multer");

const getProfileByUsername = async (req, res) => {
  try {
    const username = req.params.username;
    const profile = await Profile.findOne({ username });
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
    const { username, name, bio } = req.body;
    var imgProfile = "", imgCover = "", imgProfileID = "", imgCoverID = "";
    if (req.files["imgProfile"] !== undefined) {
      const result = await cloudinary.uploader.upload(req.files["imgProfile"][0].path);
      imgProfile = result.secure_url;
      imgProfileID = result.public_id;
    }
    if (req.files["imgCover"] !== undefined) {
      const result = await cloudinary.uploader.upload(req.files["imgCover"][0].path);
      imgCover = result.secure_url;
      imgCoverID = result.public_id;
    }
    const newProfile = new Profile({
      user_id: req.user.userID,
      username,
      name,
      bio,
      img: {
        profile: {
          src: imgProfile,
          cloudinary_id: imgProfileID
        },
        cover: {
          src: imgCover,
          cloudinary_id: imgCoverID
        }
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
    await cloudinary.uploader.destroy(imgProfileID);
    await cloudinary.uploader.destroy(imgCoverID);
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
    const { name, bio } = req.body;
    var imgProfile = "", imgCover = "", imgProfileID = "", imgCoverID = "";
    if (req.files["imgProfile"] !== undefined) {
      const result = await cloudinary.uploader.upload(req.files["imgProfile"][0].path);
      imgProfile = result.secure_url;
      imgProfileID = result.public_id;
    }
    if (req.files["imgCover"] !== undefined) {
      const result = await cloudinary.uploader.upload(req.files["imgCover"][0].path);
      imgCover = result.secure_url;
      imgCoverID = result.public_id;
    }
    const filter = { user_id: userID }
    const update = {
      name,
      bio,
      img: {
        profile: {
          src: imgProfile,
          cloudinary_id: imgProfileID
        },
        cover: {
          src: imgCover,
          cloudinary_id: imgCoverID
        }
      }
    }
    const profile = await Profile.findOne(filter, update, { new: true })
    res.status(200).json({
      success: true,
      profile
    })
  } catch (error) {
    await cloudinary.uploader.destroy(imgProfileID);
    await cloudinary.uploader.destroy(imgCoverID);
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
      if (profileID !== userProfile._id) {
        createNotification({profileID, senderID: req.user.profileID, recieverID: profileID});
      }
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