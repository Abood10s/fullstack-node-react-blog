const asyncHandler = require("express-async-handler");
const { User, validateUpdateUser } = require("../models/User");
const bcrypt = require("bcryptjs");
const path = require("path");
const fs = require("fs");
const { Comment } = require("../models/Comment");
const { Post } = require("../models/Post");
const { cloudinaryRemoveMultipleImages } = require("../utils/cloudinary");
const {
  cloudinaryRemoveImage,
  cloudinaryUploadImage,
} = require("../utils/cloudinary");
/** ------------------------------------------------
 * @desc Get All users Profiles 
 * @route /api/users/profile
 * @method GET
 * @access private (only admin) 
 -------------------------------------------------*/
// in req you should provide header key called Authorization its value is "Bearer ${token}"
module.exports.getAllUsersCtrl = asyncHandler(async (req, res) => {
  // the req.user with the payload has in it isAdmin we created in the middleware verifyToken

  const users = await User.find().select("-password").populate("posts");
  res.status(200).json(users);
});

/** ------------------------------------------------
 * @desc Get User Profile
 * @route /api/users/profile/:id
 * @method GET
 * @access public 
 -------------------------------------------------*/
// in req you should provide header key called Authorization its value is "Bearer ${token}"
module.exports.getUserProfileCtrl = asyncHandler(async (req, res) => {
  // the req.user with the payload has in it isAdmin we created in the middleware verifyToken
  // select -password excludes password from the response
  const user = await User.findById(req.params.id)
    .select("-password")
    // because in virtual we named it posts gets me the posts written by user with his response profile
    .populate("posts");
  if (!user) {
    return res.status(404).json({ message: "User not found" });
  }
  res.status(200).json(user);
});
/** ------------------------------------------------
 * @desc Update User Profile
 * @route /api/users/profile/:id
 * @method PUT
 * @access private (only user himself) 
 -------------------------------------------------*/
module.exports.updateUserProfileCtrl = asyncHandler(async (req, res) => {
  const { error } = validateUpdateUser(req.body);
  if (error) {
    return res.status(400).json({ message: error.details[0].message });
  }
  //if request has password in it we want to hash it again
  if (req.body.password) {
    const salt = bcrypt.getSalt(10);
    req.body.password = await bcrypt.hash(req.body.password, salt);
  }
  const updatedUser = await User.findByIdAndUpdate(
    req.params.id,
    {
      //  looks for what updated from those and set it
      $set: {
        username: req.body.username,
        password: req.body.password,
        bio: req.body.bio,
      },
    },
    { new: true }
  )
    .select("-password")
    .populate("posts");
  res.status(200).json(updatedUser);
});

/** ------------------------------------------------
 * @desc Get Users Count 
 * @route /api/users/count
 * @method GET
 * @access private (only admin) 
 -------------------------------------------------*/
// in req you should provide header key called Authorization its value is "Bearer ${token}"
module.exports.getUsersCountCtrl = asyncHandler(async (req, res) => {
  // the req.user with the payload has in it isAdmin we created in the middleware verifyToken
  // count() only counts the length of records
  const count = await User.count();
  res.status(200).json(count);
});
/** ------------------------------------------------
 * @desc Profile photo upload 
 * @route /api/users/profile/profile-photo-upload
 * @method POST
 * @access private (only logged in user) 
 -------------------------------------------------*/
module.exports.profilePhotoUploadCtrl = asyncHandler(async (req, res) => {
  // 1.VALIDATION
  if (!req.file) {
    return res.status(400).json({ message: "no file provided" });
  }
  // 2.GET THE PATH TO THE IMAGE IN OUR IMAGES FOLDER
  const imagePath = path.join(__dirname, `../images/${req.file.filename}`);
  // 3.UPLOAD TO CLOUDINARY
  const result = await cloudinaryUploadImage(imagePath);
  console.log(result);
  // 4.GET THE USER FROM DB
  const user = await User.findById(req.user.id);
  // 5.DELETE THE OLD PHOTO PROFILE PHOTO IF EXIST
  if (user.profilePhoto?.publicId !== null) {
    await cloudinaryRemoveImage(user.profilePhoto.publicId);
  }
  // 6.CHANGE THE PROFILEPHOTO FIELD IN THE DB
  user.profilePhoto = {
    url: result.secure_url,
    // we need the public id to remove the photo after
    publicId: result.public_id,
  };
  // to save new changes
  await user.save();
  // 7.SEND RESPONSE TO CLIENT
  res.status(200).json({
    message: "Your profile photo has been uploaded successfully",
    profilePhotoUrl: { url: result.secure_url, publicId: result.public_id },
  });
  // 8.REMOVE IMAGE FROM THE SERVER IN OUR "IMAGE FOLDER" using nodejs fs file system module
  // this command removes a file from our folder takes the path
  fs.unlinkSync(imagePath);
});
/** ------------------------------------------------
 * @desc Delete User profile (Account)
 * @route /api/users/profile/:id
 * @method DELETE
 * @access private (only admin or user himself) 
 -------------------------------------------------*/
module.exports.deleteUserProfileCtrl = asyncHandler(async (req, res) => {
  // 1.GET THE USER FROM THE DB
  const user = await User.findById(req.params.id);
  if (!user) {
    res.status(404).json({ message: "User not found" });
  }

  // 2. GET ALL POSTS FROM DB
  const posts = await Post.find({ user: user._id });
  // 3. GET ALL PUBLIC ID'S FROM THE POSTS returns all public ids from all posts to remove them
  const publicIds = posts?.map((post) => post.image.publicId);
  // 4. DELETE ALL POSTS IMAGES FROM CLOUDINARY THAT BELONGS TO THE USER
  // > 0 maybe user doesnt have any images
  if (publicIds?.length > 0) {
    cloudinaryRemoveMultipleImages(publicIds);
  }
  // 5. DELETE THE User PROFILE PICTURE FROM CLOUDINARY
  // the if because some users don't have profile pictures
  if (user.profilePhoto.publicId !== null) {
    await cloudinaryRemoveImage(user.profilePhoto.publicId);
  }
  // 6. DELETE USER POSTS AND COMMENTS
  await Post.deleteMany({ user: user._id });
  await Comment.deleteMany({ user: user._id });
  // 7.DELETE THE USER HIMSELF
  await User.findByIdAndDelete(req.params.id);
  // 8.SEND A RESPONSE TO CLIENT
  res
    .status(200)
    .json({ message: "The profile has been deleted Successfully" });
});
